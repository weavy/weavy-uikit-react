import React from "react";
import useMutateRestorePost from "../hooks/useMutateRestorePost";
import Button from '../ui/Button';

type Props = {
    appId: number,
    id: number,
    text: string,
    html: string,
    created_at: string,
    created_by: MemberType,
    attachments: FileType[],
    reactions: ReactableType[],
    embed: EmbedType | undefined    
}


const PostTrashed = ({id, appId}: Props) => {

    const restorePost = useMutateRestorePost();

    const handleRestore = () => {
        restorePost.mutate({ id: id, appId: appId});
    }

    return (
        <div className="wy-item wy-item-lg">
            <div className="wy-item-body">Post was trashed.</div>
            <Button.UI onClick={handleRestore} className='wy-button-variant'>Undo</Button.UI>
            
        </div>
    )
}

export default PostTrashed;