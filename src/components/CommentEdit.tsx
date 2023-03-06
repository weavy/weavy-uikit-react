import React from 'react';
import Icon from '../ui/Icon';
import Button from '../ui/Button';
import Editor from './Editor';
import useMutateEditComment from '../hooks/useMutateEditComment';
import { BlobType, EmbedType, FileType, MemberType, PollOptionType, ReactableType } from '../types/types';

type Props = {
    appId: number,
    parentId: number,
    id: number,
    text: string,
    html: string,
    created_at: string,
    created_by: MemberType,
    attachments: FileType[],
    reactions: ReactableType[],
    embed: EmbedType | undefined,
    onClose: (e?: any) => void
}

const CommentEdit = ({ appId, parentId, id, text, embed, attachments, onClose }: Props) => {
    const editCommentMutation = useMutateEditComment();

    const handleUpdate = async (text: string, blobs: BlobType[], attachments: FileType[], meeting: number | null, embed: number | null,  options: PollOptionType[]) => {
        await editCommentMutation.mutateAsync({ id: id, appId: appId, parentId: parentId, text: text, blobs: blobs, attachments: attachments, meeting: meeting, embed: embed });
        onClose();
    }

    return (
        <>
            <nav className='wy-item'>
                <div className='wy-item-body'>
                    <div className='wy-item-title'>Edit comment</div>
                </div>

                <a className='wy-button wy-button-icon'>
                    <Button.UI onClick={onClose}>
                        <Icon.UI name="close" />
                    </Button.UI>

                </a>
            </nav>
            <Editor editorType='posts' editorLocation='posts' id={id} appId={appId} placeholder={'Update the comment'} text={text} embed={embed} attachments={attachments} buttonText='Update' onSubmit={handleUpdate} showAttachments={true} showCloudFiles={true} showEmbeds={false} showPolls={false} />
        </>
    )
}

export default CommentEdit;