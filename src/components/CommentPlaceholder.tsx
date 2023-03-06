import React from 'react';
import { MemberType } from '../types/types';

type Props = {
    text: string,
    created_at: string,
    created_by: MemberType
}


const CommentPlaceholder = ({ ...props }: Props) => {

    return (
        <div className='wy-comment'>
            <div className='wy-item wy-comment-header'>
                <img alt="" className="wy-avatar wy-placeholder" height={32} width={32} src={props.created_by.avatar_url} />

                <div className='wy-item-body'>
                    <div className='wy-item-title'><span className='wy-placeholder'>Placeholder name</span></div>
                    <div className='wy-item-text'><time className='wy-placeholder' dateTime='2022-12-31 00:00:00'>2022-12-31 00:00:00</time></div>
                </div>
            </div>
            <div className='wy-comment-body'>
                <div className='wy-comment-content'>
                    <div className='wy-content'>
                        <span className='wy-placeholder'>Lorem</span> <span className='wy-placeholder'>ipsum</span> <span className='wy-placeholder'>dolor</span> <span className='wy-placeholder'>sit</span> <span className='wy-placeholder'>amet.</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CommentPlaceholder;