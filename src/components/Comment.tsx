import React, { useState } from 'react';
import { AppFeatures, EmbedType, FileType, MemberType, ReactableType } from '../types/types';
import CommentEdit from './CommentEdit';
import CommentTrashed from './CommentTrashed';
import CommentView from './CommentView';

type Props = {
    appId: number,
    parentId: number,
    id: number,
    text: string,
    html: string,
    created_at: string,
    modified_at?: string,
    created_by: MemberType,
    trashed_at?: string,
    attachments: FileType[],
    reactions: ReactableType[],
    embed: EmbedType | undefined,
    is_trashed: boolean,
    features: string[],
    appFeatures: AppFeatures | undefined
}


const Comment = ({ ...props }: Props) => {
    const [edit, setEdit] = useState<boolean>(false);

    return (
        <div className='wy-comment'>
            {props.is_trashed && 
                <CommentTrashed {...props} />                
            }
            {!props.is_trashed && edit &&
                <CommentEdit {...props} onClose={() => setEdit(prev => !prev)} />
            }

            {!props.is_trashed && !edit &&
                <CommentView {...props} onEdit={() => setEdit(prev => !prev)} />
            }
        </div>
    )
}

export default Comment;