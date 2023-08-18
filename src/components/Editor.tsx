import ReactCodeMirror, { ReactCodeMirrorRef } from '@uiw/react-codemirror';
import React, { useContext, useState, useRef, useEffect, useCallback } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap } from '@codemirror/view';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { defaultHighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { autocompletion } from '@codemirror/autocomplete';
import { CompletionResult, Completion, CompletionContext } from '@codemirror/autocomplete';
import { MentionsCompletion } from '../types/interfaces';
import { mentions } from '../utils/mentions';
import { WeavyContext } from '../contexts/WeavyContext';
import useEmbeds from '../hooks/useEmbeds';
import Blob from './Blob';
import Icon from '../ui/Icon';
import Button from '../ui/Button';
import Dropdown from '../ui/Dropdown';
import Embed from './Embed';
import classNames from "classnames";
import useCloudFiles from '../hooks/useCloudFiles';
import throttle from 'lodash.throttle';
import useMutateTyping from '../hooks/useMutateTyping';
import Meetings from './Meetings';
import Meeting from './Meeting';
import useUpdateEffect from '../hooks/useUpdateEffect';
import { FileMutation, useClearMutatingFileUpload, useMutateFileUpload, useMutatingFileUploads, useRemoveMutatingFileUpload } from '../hooks/useMutateFile';
import FileItem from './FileItem';
import Dropzone from './Dropzone';
import { BlobType, EmbedType, FileType, MeetingType, PollOptionType } from '../types/types';

type Props = {
    id?: number,
    appId: number,
    parentId?: number,
    placeholder: string,
    text?: string,
    buttonText: string,
    embed?: EmbedType | undefined,
    attachments?: FileType[] | undefined,
    options?: PollOptionType[] | undefined,
    meeting?: MeetingType | undefined,
    showAttachments?: boolean,
    showCloudFiles?: boolean,
    showEmbeds?: boolean,
    showPolls?: boolean,
    showMeetings?: boolean,
    showTyping?: boolean,
    useDraft?: boolean,
    showMention?: boolean,
    onSubmit: (text: string, blobs: BlobType[], attachments: FileType[], meeting: number | null, embed: number | null, options: PollOptionType[]) => Promise<void>,
    editorType: "posts" | "comments" | "messages",
    editorLocation: "apps" | "posts" | "messages" | "files"
}

let typed = null;

const Editor = ({ id, appId, parentId, placeholder, text, buttonText, embed, attachments: initialAttachments, options: initialOptions, meeting: initialMeeting, showAttachments = false, showCloudFiles = false, showEmbeds = false, showPolls = false, showMeetings = false, showTyping = false, useDraft = false, showMention = false, onSubmit, editorType, editorLocation }: Props) => {

    const { client, options } = useContext(WeavyContext);
    const [files, setFiles] = useState<string>("");
    const [editorError, setEditorError] = useState<boolean>(false);
    const [blobs, setBlobs] = useState<BlobType[]>([]);
    const [attachments, setAttachments] = useState<FileType[]>([]);
    const [meeting, setMeeting] = useState<MeetingType | null>(null);
    const [pollOptions, setPollOptions] = useState<PollOptionType[]>([]);
    const [pollVisible, setPollVisible] = useState<boolean>(false);
    const [embeds, setEmbeds] = useState<EmbedType[]>([]);
    const [disabled, setDisabled] = useState<boolean>(false);
    const [value, setValue] = useState<string>('');
    const { openCloudFiles } = useCloudFiles(handleExternalFileAdded);
    const editorRef = useRef<ReactCodeMirrorRef>(null);
    let fileInput: HTMLInputElement | null;
    const sendTyping = useMutateTyping();
    const cacheKey = [`${editorLocation}-${editorType}-uploads`, appId, id];
    const uploadFileMutation = useMutateFileUpload(cacheKey);
    const { mutations: fileList, progress: progress, status: status } = useMutatingFileUploads(cacheKey);
    const removeMutatingFileUpload = useRemoveMutatingFileUpload(cacheKey);
    const clearMutatingFileUpload = useClearMutatingFileUpload(cacheKey);

    const throttledTyping = useCallback(throttle(function () { sendTyping.mutate({ id: appId, type: editorType, location: editorLocation }) }, 2000), [appId]);
    const throttledDrafting = useCallback(throttle(function () { saveDraft() }, 500), [appId, blobs, meeting, value, pollOptions]);

    const extensions: any[] = [
        keymap.of([{
            key: "Ctrl-Enter",
            preventDefault: true,
            run: () => {
                handleCreate();
                return true;
            }
        }]),
        markdown({ base: markdownLanguage }),
        mentions,
        autocompletion({
            override: showMention ? [autocomplete] : null,
            closeOnBlur: false,
            icons: false,
            addToOptions: [
                {
                    render: function (completion: MentionsCompletion, state: EditorState) {
                        let div = document.createElement("div");
                        div.classList.add("wy-item");
                        div.classList.add("wy-item-hover");

                        if (!completion.item?.is_member) {
                            div.classList.add("wy-disabled");
                        }

                        let img = document.createElement("img");
                        img.classList.add("wy-avatar");
                        img.src = completion.item?.avatar_url || "";

                        let name = document.createElement("div");
                        name.classList.add("wy-item-body");
                        name.innerText = (completion.item?.display_name) || "";

                        div.appendChild(img);
                        div.appendChild(name);
                        return div;
                    },
                    position: 10
                }
            ]
        }),
        syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
        EditorView.lineWrapping,
        EditorView.domEventHandlers({
            paste(this: any, evt: ClipboardEvent, view: EditorView): boolean | void {

                let files: any[] = [];
                const items = evt.clipboardData?.items || [];

                for (let index in items) {
                    const item = items[index];
                    if (item.kind === 'file') {
                        files = [...files, item.getAsFile()];
                    }
                }
                if (files.length > 0 && showAttachments) {
                    for (var i = 0; i < files.length; i++) {
                        let file = files[i];
                        let fileProps = { file: file }
                        uploadFileMutation.mutateAsync(fileProps, {});
                    }
                    return true;
                }
            }
        })
    ];

    async function autocomplete(context: CompletionContext): Promise<CompletionResult | null> {
        // match @mention except when preceeded by ](
        // regex lookbehind is unfortunately not supported in safari
        // let before = context.matchBefore(/(?<!\]\()@[^@]+/);
        let before = context.matchBefore(/(?!\]\(@)(^[^@]{0,1}|[^@]{2})@([^@]+)/);
        //let before = context.matchBefore(/(?<!\]\()@[^@]+/);

        // If completion wasn't explicitly started and there
        // is no word before the cursor, don't open completions.
        if (!context.explicit && !before) return null

        // if valid, rematch (only when not using regex lookbehind)
        before = context.matchBefore(/@[^@]+/);

        typed = before?.text.substring(1);

        const response = await client?.get("/api/users/autocomplete?id=" + appId + "&q=" + typed);
        const result = await response?.json();

        let completions = [];

        if (result.data) {
            completions = result.data.filter((item: any) => typeof (item.display_name) !== 'undefined').map((item: any) => {
                return {
                    item: item,
                    label: item.display_name,
                    apply: function (view: EditorView, completion: Completion, from: number, to: number) {
                        var toInsert = "[" + item.display_name + "](@u" + item.id.toString() + ")";
                        var transaction = view.state.update({ changes: { from: from - 1, to: from } });
                        view.dispatch(transaction);
                        transaction = view.state.update({ changes: { from: from - 1, to: to - 1, insert: toInsert } });
                        view.dispatch(transaction);
                        //view.dispatch(pickedCompletion);
                    }
                }
            });
        }

        return {
            from: before ? before.from + 1 : context.pos,
            options: completions,
            filter: false
        }

    }

    useEffect(() => {
        if (text != null) {
            setValue(text);
        }
        if (embed != null) {
            setEmbeds([embed]);
            initEmbeds([embed.original_url])
        }
        if (initialAttachments != null) {
            setAttachments(initialAttachments);
        }

        if (initialOptions != null) {
            setPollOptions([...initialOptions, { id: null, text: "" }]);
            setPollVisible(true);
        }
        if (initialMeeting != null) {
            setMeeting(initialMeeting);
        }
    }, [appId, text, embed, initialAttachments, initialOptions, initialMeeting])

    useEffect(() => {
        if (useDraft) {
            let key = `draft-${editorType}-${parentId || appId}`;
            let draft = localStorage.getItem(key);
            if (draft) {
                let values = JSON.parse(draft);

                setValue(values.text);
                setBlobs(values.blobs);
                setEmbeds(values.embeds);
                setMeeting(values.meeting);
                if (values.pollOptions?.length > 0) {
                    setPollVisible(true);
                    setPollOptions(values.pollOptions);
                }
            }
        }

        return () => {
            clearMutatingFileUpload();
        }
    }, [])


    useUpdateEffect(() => {
        if (useDraft) {
            saveDraft();
        }
    }, [editorRef, fileList, blobs, meeting, embeds, value, pollOptions]);

    function saveDraft() {
        let key = `draft-${editorType}-${parentId || appId}`;

        // get editor text        
        let text = editorRef.current?.view?.state.doc.toString();
        if (text === undefined) {
            text = value;
        }

        const blobFiles = fileList.filter((m) => m?.state?.context?.blob != null).map((f) => {
            return f!.state.context!.blob;
        });
        const allBlobs = [...blobFiles, ...blobs];

        if (!allBlobs.length && !meeting && !embeds.length && !pollOptions.length && text === "") {
            localStorage.removeItem(key);
        } else {
            localStorage.setItem(key, JSON.stringify({ blobs: allBlobs, meeting: meeting, text: text, pollOptions: pollOptions, embeds: embeds }));
        }

    }

    // search for embeds
    const handleEmbeds = async (content: string) => {
        await getEmbeds(content)
    }

    // add resolved embed
    const handleAddEmbed = (data: EmbedType) => {
        // update embeds                
        setEmbeds((previous) => [data, ...previous]);
    }

    // get embeds hook
    const { getEmbeds, initEmbeds, clearEmbeds } = useEmbeds(handleAddEmbed);

    const handleEmbedRemove = (embedId: number) => {
        setEmbeds((previous) => previous.filter((e: EmbedType) => e.id !== embedId));
    }

    const handleEmbedSwap = () => {

        setEmbeds((previous) => {
            let first = previous.shift();
            if (first) {
                return [...previous, first];
            }

            return previous;

        });
    }

    const onChange = (value: string, viewUpdate: any) => {
        //setValue(value);
        if (showEmbeds) {
            handleEmbeds(value);
        }

        if (showTyping) {
            throttledTyping();
        }

        if (useDraft) {
            throttledDrafting();
        }

    };

    // upload files
    const handleFileUpload = async (e: any) => {
        if (e.target.files) {
            for (var i = 0; i < e.target.files.length; i++) {
                let file = e.target.files[i];
                let fileProps = { file: file }
                uploadFileMutation.mutateAsync(fileProps, {});
            }
        }
    }

    // open file dialog
    const openFileInput = (e: any) => {
        fileInput?.click();
    }

    // remove uploaded file 
    const handleRemoveFile = (mutation: FileMutation, id: number, e: any) => {
        setFiles("");
        removeMutatingFileUpload(mutation);
    }

    // remove blob
    const handleRemoveBlob = (id: number, e: any) => {
        setFiles("");
        setBlobs(blobs.filter((b: BlobType) => {
            return b.id !== id
        }));
    }

    // remove file attachment
    const handleRemoveAttachment = (id: number, e: any) => {
        setAttachments(attachments.filter((a: FileType) => {
            return a.id !== id
        }));
    }

    // add ecternal file
    function handleExternalFileAdded(externalFiles: BlobType[]) {
        setBlobs([...blobs, ...externalFiles]);
    }

    const onDrop = useCallback((acceptedFiles: File[]) => {
        // this callback will be called after files get dropped, we will get the acceptedFiles. If you want, you can even access the rejected files too
        
        if (acceptedFiles.length > 0 && showAttachments) {
            for (var i = 0; i < acceptedFiles.length; i++) {
                let file = acceptedFiles[i];
                let fileProps = { file: file }
                uploadFileMutation.mutateAsync(fileProps, {});
            }
            return true;
        }

    }, []);

    const handlePoll = () => {
        if (!pollVisible) {
            if (pollOptions.length === 0) {
                const option = { id: null, text: "" };
                setPollOptions((prev) => [...prev, option]);
            }
            setPollVisible(true);
        } else {
            setPollVisible(false);
        }
    }

    const handlePollOptionAdd = (e: React.FocusEvent<HTMLInputElement>, key: number) => {
        if (key === pollOptions.length - 1) {
            const option = { id: null, text: "" };
            setPollOptions((prev) => [...prev, option]);
        }
    }

    const handlePollOptionChange = (i: number, e: React.ChangeEvent<HTMLInputElement>) => {
        let newValues = [...pollOptions];
        newValues[i].text = e.target.value;
        setPollOptions(newValues);
    }

    const handleMeetingAdd = (m: any) => {
        setMeeting(m)
    }

    const handleMeetingDelete = () => {
        setMeeting(null);
    }

    // create post
    const handleCreate = async () => {
        // get editor text
        const text = (editorRef.current?.view?.state.doc.toString() || "");

        const blobFiles = fileList.filter((m) => m?.state?.context?.blob != null).map((f) => {
            return f!.state.context!.blob;
        });
        const allBlobs = [...blobFiles, ...blobs];
        // check if not empty
        if (text === "" && allBlobs.length === 0 && attachments.length === 0 && embeds.length === 0 && meeting === null && pollOptions.filter(p => p.text.trim() !== "").length === 0) {
            setEditorError(true);
            return;
        };

        setDisabled(true);

        queueMicrotask(() => {
            // clear visual state in a moment
            setValue("");
            setFiles("");
            setBlobs([]);
            setAttachments([]);
            setEmbeds([]);
            setPollOptions([]);
            setPollVisible(false);
            clearEmbeds();
            setMeeting(null);
            editorRef.current?.view?.dispatch({ changes: { from: 0, to: editorRef.current?.view?.state.doc.length, insert: "" } });
            setEditorError(false);
            clearMutatingFileUpload();
        })
        
        // create post/comment/message
        await onSubmit(text, allBlobs, attachments, meeting?.id || null, embeds.length > 0 ? embeds[0].id : null, pollOptions);

        // ready

        setDisabled(false);
    }

    let editorInputs = (
        <>
            {editorType === "messages" &&
                <div className="wy-message-editor-inputs">
                    {(showAttachments || showCloudFiles) &&
                        <Dropdown.UI directionY='up' icon="plus">

                            {showAttachments &&
                                <>
                                    <Dropdown.Item onClick={openFileInput}>
                                        <Icon.UI name="attachment" /> File from device
                                    </Dropdown.Item>
                                    <input type="file" ref={input => fileInput = input} value={files} onChange={handleFileUpload} multiple hidden tabIndex={-1} />
                                </>
                            }

                            {showCloudFiles &&
                                <Dropdown.Item onClick={openCloudFiles}>
                                    <Icon.UI name="cloud" /> File from cloud
                                </Dropdown.Item>
                            }
                            {/* meetings */}
                            {showMeetings &&
                                <Meetings onMeetingAdded={handleMeetingAdd} dropdown={true} />
                            }
                        </Dropdown.UI>
                    }
                    <div className={classNames("wy-message-editor-text", { "wy-is-invalid": editorError })}>
                        <ReactCodeMirror
                            ref={editorRef}
                            value={value}
                            placeholder={placeholder}
                            extensions={extensions}
                            onChange={onChange}
                            indentWithTab={false}
                            basicSetup={{
                                defaultKeymap: false,
                                lineNumbers: false,
                                dropCursor: true,
                                highlightActiveLine: false,
                                history: true,
                                foldGutter: false,
                                autocompletion: true,
                                drawSelection: false,
                                highlightSpecialChars: false,
                                syntaxHighlighting: false,
                                highlightSelectionMatches: false
                            }}
                        />
                    </div>
                    {/* submit */}
                    <Button.UI title={buttonText} disabled={disabled} onClick={handleCreate}><Icon.UI name="send" color="primary" /></Button.UI>
                </div>
            }
            {editorType === "comments" &&
                <>
                    <div className="wy-comment-editor-inputs">

                        {(showAttachments || showCloudFiles) &&
                            <Dropdown.UI directionY='up' icon="plus">

                                {showAttachments &&
                                    <>
                                        <Dropdown.Item onClick={openFileInput}>
                                            <Icon.UI name="attachment" /> File from device
                                        </Dropdown.Item>
                                        <input type="file" ref={input => fileInput = input} value={files} onChange={handleFileUpload} multiple hidden tabIndex={-1} />
                                    </>
                                }

                                {showCloudFiles &&
                                    <Dropdown.Item onClick={openCloudFiles}>
                                        <Icon.UI name="cloud" /> File from cloud
                                    </Dropdown.Item>
                                }
                            </Dropdown.UI>
                        }
                        <div className={classNames("wy-comment-editor-text", { "wy-is-invalid": editorError })}>
                            <ReactCodeMirror
                                ref={editorRef}
                                value={value}
                                placeholder={placeholder}
                                extensions={extensions}
                                onChange={onChange}
                                indentWithTab={false}
                                basicSetup={{
                                    defaultKeymap: false,
                                    lineNumbers: false,
                                    dropCursor: true,
                                    highlightActiveLine: false,
                                    history: true,
                                    foldGutter: false,
                                    autocompletion: true,
                                    drawSelection: false,
                                    highlightSpecialChars: false,
                                    syntaxHighlighting: false,
                                    highlightSelectionMatches: false
                                }}
                            />
                        </div>
                        {/* submit */}
                        <Button.UI title={buttonText} disabled={disabled} onClick={handleCreate}><Icon.UI name="send" color="primary" /></Button.UI>
                    </div>
                </>
            }

            {editorType === "posts" &&
                <>
                    <div className={classNames("wy-post-editor-text", { "wy-is-invalid": editorError })}>
                        <ReactCodeMirror
                            ref={editorRef}
                            value={value}
                            placeholder={placeholder}
                            extensions={extensions}
                            onChange={onChange}
                            indentWithTab={false}
                            basicSetup={{
                                defaultKeymap: false,
                                lineNumbers: false,
                                dropCursor: true,
                                highlightActiveLine: false,
                                history: true,
                                foldGutter: false,
                                autocompletion: true,
                                drawSelection: false,
                                highlightSpecialChars: false,
                                syntaxHighlighting: false,
                                highlightSelectionMatches: false
                            }}
                        />
                    </div>

                    <div className='wy-post-editor-inputs'>
                        {/* attachments */}
                        {showAttachments &&
                            <div>
                                <Button.UI title="Add file from device" onClick={openFileInput}><Icon.UI name="attachment" /></Button.UI>
                                <input type="file" ref={input => fileInput = input} value={files} onChange={handleFileUpload} multiple hidden tabIndex={-1} />
                            </div>
                        }

                        {/* cloud files */}
                        {showCloudFiles &&
                            <Button.UI title="Add file from cloud" onClick={openCloudFiles}>
                                <Icon.UI name="cloud" />
                            </Button.UI>
                        }

                        {/* meetings */}
                        {showMeetings &&
                            <Meetings onMeetingAdded={handleMeetingAdd} />
                        }

                        {/* polls */}
                        {showPolls &&
                            <Button.UI title="Add poll" onClick={handlePoll}>
                                <Icon.UI name="poll" />
                            </Button.UI>
                        }

                        {/* submit */}
                        <Button.UI className='wy-button-primary' title={buttonText} disabled={disabled} onClick={handleCreate}>{buttonText}</Button.UI>

                    </div>
                </>
            }


        </>
    )

    let editorLists = (
        <>
            {/* polls */}
            {showPolls && pollVisible && pollOptions.length > 0 &&
                <div className='wy-poll-form'>
                    {pollOptions.map((p: PollOptionType, index: number) => {
                        return (
                            <input key={'option_' + index} value={p.text} onChange={e => handlePollOptionChange(index, e)} className='wy-input' type='text' placeholder='+ add an option' onFocus={(e) => handlePollOptionAdd(e, index)} />
                        )
                    })}
                </div>

            }

            {/* attachments */}
            {(showAttachments || showCloudFiles) &&
                <div>
                    {attachments.map((a: FileType) => {
                        return (
                            <Blob key={a.id} id={a.id} name={a.name} className="wy-item-body">
                                <Button.UI onClick={handleRemoveAttachment.bind(Editor, a.id)}><Icon.UI name='close-circle' /></Button.UI>
                            </Blob>
                        )
                    })}
                    {/* uploaded files */}
                    {fileList && fileList.map((m, index) => {
                        let f = m.state.context?.file;
                        return (
                            <React.Fragment key={'f' + index}>
                                {f &&
                                    <FileItem.Item file={f} features={[]} appFeatures={undefined}>
                                        <Button.UI onClick={handleRemoveFile.bind(Editor, m, f.id)}><Icon.UI name='close-circle' /></Button.UI>
                                    </FileItem.Item>
                                }
                            </React.Fragment>

                        )
                    })}
                    {/* files from draft */}
                    {blobs.map((a: BlobType) => {
                        return (
                            <Blob key={a.id} id={a.id} name={a.name} className="wy-item-body">
                                <Button.UI onClick={handleRemoveBlob.bind(Editor, a.id)}><Icon.UI name='close-circle' /></Button.UI>
                            </Blob>
                        )
                    })}
                </div>
            }

            {/* meetings */}
            {showMeetings && meeting &&
                <div className="wy-item">
                    <Meeting id={meeting.id} title={meeting.provider} className="wy-item-body" />
                    <Button.UI onClick={handleMeetingDelete}><Icon.UI name='close-circle' /></Button.UI>
                </div>
            }

            {/* embeds */}
            {showEmbeds &&
                <div className='wy-embed-preview'>
                    <>
                        {embeds.map((embed: EmbedType, index: number) => {
                            return (
                                <Embed key={'embed' + index} embed={embed} onRemove={handleEmbedRemove} onSwap={embeds.length > 1 ? handleEmbedSwap : null} />
                            )
                        })}
                    </>

                </div>
            }
        </>
    )

    return (

        <div className={classNames({ 'wy-post-editor': editorType === 'posts' }, { 'wy-comment-editor': editorType === 'comments' }, { 'wy-message-editor': editorType === 'messages' })}>
            <Dropzone onDrop={onDrop} dragClass={classNames({ 'wy-post-editor-dragging': editorType === 'posts' }, { 'wy-comment-editor-dragging': editorType === 'comments' }, { 'wy-message-editor-dragging': editorType === 'messages' })}>
                {editorType === "messages" &&
                    <>
                        {editorLists}
                    </>
                }

                {editorInputs}

                {(editorType === "posts" || editorType === "comments") &&
                    <>
                        {editorLists}
                    </>
                }
            </Dropzone>
        </div>

    )
}

export default Editor;