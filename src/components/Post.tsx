import React, { useState } from 'react';
import PostView from './PostView';
import PostEdit from './PostEdit';
import PostTrashed from './PostTrashed';

type Props = {
    appId: number,
    id: number,
    text: string,
    html: string,
    created_at: string,
    modified_at?: string,
    created_by: MemberType,
    trashed_at?: string,
    attachments: FileType[],
    reactions: ReactableType[],
    embed: EmbedType | undefined
    comment_count?: number,
    is_subscribed: boolean,
    is_trashed: boolean,
    options?: PollOptionType[],
    meeting?: MeetingType
}


const Post = ({ ...props }: Props) => {
    const [edit, setEdit] = useState<boolean>(false);

    return (
        <div className='wy-post'>
            {props.is_trashed && 
                <PostTrashed {...props} />                
            }
            {!props.is_trashed && edit &&
                <PostEdit {...props} onClose={() => setEdit(prev => !prev)} />
            }

            {!props.is_trashed && !edit &&
                <PostView {...props} onEdit={() => setEdit(prev => !prev)} />
            }
        </div>
    )
}

export default Post;