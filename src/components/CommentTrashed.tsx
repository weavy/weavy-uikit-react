import React from "react";
import { useQueryClient } from "react-query";
import useMutateRestoreComment from "../hooks/useMutateRestoreComment";
import Button from '../ui/Button';
import { updateCacheItem } from "../utils/cacheUtils";

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
    embed: EmbedType | undefined    
}


const CommentTrashed = ({id, appId, parentId}: Props) => {

    const restoreComment = useMutateRestoreComment();
    const queryClient = useQueryClient();

    const handleUndo = () => {
        restoreComment.mutate({ id: id, appId: appId, parentId: parentId}, {
            onSuccess: () => {
                updateCacheItem(queryClient, ['posts', appId], parentId, (item: MessageType) => {                
                    item.comment_count = (item.comment_count || 0) + 1;
                });                
            }
        });
    }

    return (
        <div className="wy-item wy-item-lg">
            <div className="wy-item-body">Comment was trashed.</div>
            <Button.UI onClick={handleUndo} className='wy-button-variant'>Undo</Button.UI>
            
        </div>
    )
}

export default CommentTrashed;