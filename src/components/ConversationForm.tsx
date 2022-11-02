import React, { useEffect, useRef, useState } from 'react';
import { useQueryClient } from 'react-query';
import useFileUploader from '../hooks/useFileUploader';
import File from './File';
import Icon from '../ui/Icon';
import Button from '../ui/Button';
import useMutateTyping from '../hooks/useMutateTyping';
import useThrottle from '../hooks/useThrottle';
import { flushSync } from 'react-dom';
import Meetings from './Meetings';
import Meeting from './Meeting';
import FileBrowser from './FileBrowser';
import { getIcon } from '../utils/fileUtilities';

type Props = {
    conversationId: number,
    handleInsert: Function
}

let uploadedFiles: any[] = [];

const ConversationForm = ({ conversationId, handleInsert }: Props) => {

    const [text, setText] = useState<string>("");
    const [files, setFiles] = useState<string>("");
    const [fileCount, setFileCount] = useState<number>(0);
    const [currentUploadCount, setCurrentUploadCount] = useState<number>(1);
    const [working, setWorking] = useState<boolean>(false);
    const queryClient = useQueryClient();
    const [attachments, setAttachments] = useState<FileType[]>([]);
    const [meetings, setMeetings] = useState<MeetingType[]>([]);
    const [uploadError, setUploadError] = useState<string | boolean>(false);
    const startTyping = useMutateTyping();
    const textInput = useRef<HTMLTextAreaElement>(null);

    let fileInput: HTMLInputElement | null;

    const handleUploaded = (attachment: any) => {
        // update attachment list        
        flushSync(() => {
            if (attachment.status && attachment.status !== 200) {
                setUploadError(attachment.detail);
            } else {
                setAttachments([...attachments, attachment[0]]);
            }
        })
    }

    const { mutateAsync: uploadFile, isSuccess: uploadSuccess } = useFileUploader(handleUploaded);

    useEffect(() => {
        // set stored text and attachments if available
        let textValue: any = queryClient.getQueryData(["form-text", conversationId]) || "";
        setText(textValue);
        
        let attachmentValue: any = queryClient.getQueryData(["form-attachments", conversationId]) || [];
        setAttachments(attachmentValue);
    }, [conversationId]);

    useEffect(() => {
        // store attachments
        queryClient.setQueryData(["form-attachments", conversationId], attachments);
    }, [attachments]);

    useEffect(() => {
        handleAutoGrow();
    }, [text])

    const handleInsertMessage = (e: React.KeyboardEvent<EventTarget>) => {

        if(e.type === 'keydown' && !(e.key === "Enter" && e.ctrlKey )) return;

        e.preventDefault();
        e.stopPropagation();
        
        if (text === "" && attachments.length === 0 && meetings.length === 0) return;

        handleInsert(text, attachments, meetings);
        setText("");
        setFiles("");
        setAttachments([]);
        setMeetings([]);
        
        // clear stored text and attachments
        queryClient.setQueryData(["form-text", conversationId], "");
        queryClient.setQueryData(["form-attachments", conversationId], []);
    }

    const handleChange = (e: any) => {

        // store text
        queryClient.setQueryData(["form-text", conversationId], e.target.value);

        // set text  value
        setText(e.target.value);
        
    }

    const handleFileUpload = async (e: any) => {
        setUploadError(false);
        setFiles(e.target.value);
        setFileCount(e.target.files.length);
        setWorking(true);

        for (var i = 0; i < e.target.files.length; i++) {
            setCurrentUploadCount(i + 1);
            const file = e.target.files[i];
            await uploadFile({ request: { file } });
        }

        setWorking(false)
    }

    const handleRemoveFile = (id: number, e: any) => {
        setFiles("");
        setAttachments(attachments.filter((a: FileType) => {
            return a.id !== id
        }));
    }

    const handleKeyPress = () => {
        startTyping.mutate({ id: conversationId });
    }

    const openFileInput = (e: any) => {
        fileInput?.click();
    }

    const handleAddMeeting = (data: any) => {
        if (meetings.length > 0) return;

        setMeetings([...meetings, data]);
    }

    const handleExternalFileAdded = (blobs: FileType[]) => {
        setAttachments([...attachments, ...blobs]);
    }

    const handleRemoveMeeting = (id: number, e: any) => {
        setMeetings(meetings.filter((a: MeetingType) => {
            return a.id !== id
        }));
    }

    const handleAutoGrow = () => {
        if(textInput.current && textInput.current.parentNode){
            const parent = textInput.current.parentNode as HTMLElement;            
            parent.dataset.replicatedValue = textInput.current.value;
        }
        
    }


    return (
        <form className="wy-message-form">
            {uploadError &&
                <div>{uploadError}</div>
            }

            {(working || attachments.length > 0 || meetings.length > 0) &&
                <div>
                    {working &&
                        <div>Now uploading ({currentUploadCount} of {fileCount}) selected files</div>
                    }
                    <div className="wy-picker-list">
                        {attachments.map((a: FileType) => {
                            let { icon } = getIcon(a.name);
                            return (
                                <div key={a.id} className="wy-picker-list-item">
                                    <File id={a.id} name={a.name} className="wy-picker-list-item-title" icon={ icon } />
                                    <Button.UI onClick={handleRemoveFile.bind(ConversationForm, a.id)}><Icon.UI name='close-circle' /></Button.UI>
                                </div>

                            )
                        })}

                        {meetings.map((m: MeetingType) => {
                            return (
                                <div key={m.id} className="wy-picker-list-item">
                                    <Meeting id={m.id} title={m.provider} className="wy-picker-list-item-title" />
                                    <Button.UI onClick={handleRemoveMeeting.bind(ConversationForm, m.id)}><Icon.UI name='close-circle' /></Button.UI>
                                </div>

                            )
                        })}
                    </div>
                </div>
            }
            <div className="wy-message-editor-inputs">

                <div className="wy-message-editor-buttons">
                    <input type="file" ref={input => fileInput = input} value={files} onChange={handleFileUpload} multiple hidden tabIndex={-1} />
                    <Button.UI title="Upload attachment" onClick={openFileInput}><Icon.UI name="attachment" /></Button.UI>
                    <Meetings onMeetingAdded={handleAddMeeting} />
                    <FileBrowser onFileAdded={handleExternalFileAdded} />
                </div>

                <div className="wy-message-editor-text wy-message-editor-grow">
                    <textarea rows={1} ref={textInput} className="wy-message-editor-textfield wy-message-editor-textcontent"  value={text} onChange={handleChange} onKeyDown={handleInsertMessage} onKeyPress={useThrottle(handleKeyPress, 4000)}></textarea>
                </div>
                <div className="wy-message-editor-buttons">
                    <Button.UI type="button" onClick={handleInsertMessage} ><Icon.UI color="primary" name="send"/></Button.UI>
                </div>
            </div>
        </form>

    )
}

export default ConversationForm;