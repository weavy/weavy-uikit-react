import React from 'react';
import Icon from '../ui/Icon';
import Button from '../ui/Button';
import Editor from './Editor';
import useMutateEditPost from '../hooks/useMutateEditPost';

type Props = {
    appId: number,
    id: number,
    text: string,
    html: string,
    created_at: string,
    created_by: MemberType,
    attachments: FileType[],
    reactions: ReactableType[],
    embed: EmbedType | undefined,
    meeting?: MeetingType | undefined,
    options?: PollOptionType[],
    onClose: (e?:any) => void
}

const PostEdit = ({ appId, id, text, embed, attachments, options, meeting, onClose }: Props) => {
    const editPostMutation = useMutateEditPost();

    const handleUpdate = async (text: string, blobs: BlobType[], attachments: FileType[], meeting: number | null, embed: number | null, options: PollOptionType[]) => {
        await editPostMutation.mutateAsync({ id: id, appId: appId, text: text, blobs: blobs, attachments: attachments, meeting: meeting, embed: embed, options: options });
        onClose();
    }

    return (
        <>
            <nav className='wy-item'>
                <div className='wy-item-body'>
                    <div className='wy-item-title'>Edit post</div>
                </div>

                <a className='wy-button wy-button-icon'>
                    <Button.UI onClick={onClose}>
                        <Icon.UI name="close" />
                    </Button.UI>
                    
                </a>
            </nav>
            <Editor editorType='posts' editorLocation='apps' id={id} appId={appId} placeholder={'Update the post'} text={text} embed={embed} meeting={meeting} attachments={attachments} options={options} buttonText='Update' onSubmit={handleUpdate} showAttachments={true} showCloudFiles={true} showEmbeds={true} showPolls={true} />
        </>
    )
}

export default PostEdit;