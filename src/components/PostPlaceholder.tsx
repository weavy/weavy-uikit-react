import React from 'react';
import Avatar from './Avatar';

type Props = {    
    text: string,    
    created_at: string,
    created_by: MemberType    
}


const PostPlaceHolder = ({ ...props }: Props) => {

    return (
        <div className='wy-post'>
            <div className='wy-item wy-item-lg'>                
                <img alt="" className="wy-avatar wy-placeholder" height={48} width={48} src={props.created_by.avatar_url} />            
                
                <div className='wy-item-body'>
                    <div className='wy-item-title'><span className='wy-placeholder'>Placeholder name</span></div>
                    <div className='wy-item-text'><time className='wy-placeholder' dateTime='2022-12-31 00:00:00'>2022-12-31 00:00:00</time></div>
                </div>
            </div>
            <div className='wy-post-body'>
                <div className='wy-content'>
                    <span className='wy-placeholder'>Lorem</span> <span className='wy-placeholder'>ipsum</span> <span className='wy-placeholder'>dolor</span> <span className='wy-placeholder'>sit</span> <span className='wy-placeholder'>amet.</span>
                </div>
            </div>
        </div>
    )
}

export default PostPlaceHolder;