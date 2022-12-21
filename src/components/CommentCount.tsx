import React from "react";

type Props = {
    id: number,
    count: number
}

const CommentCount = ({ id, count }: Props) => {

    return (
        <>{count} {'comment' + (count !== 1 ? 's': '')}</>        
    )
}

export default CommentCount;