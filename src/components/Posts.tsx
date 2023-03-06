import React, { useState, useContext, useEffect, useCallback } from 'react';
import { WeavyContext } from '../contexts/WeavyContext';
import { PostsProps } from '../types/Posts';
import usePosts from '../hooks/usePosts';
import classNames from 'classnames';
import Editor from './Editor';
import PostList from './PostList';
import useMutatePost from '../hooks/useMutatePost';
import { BlobType, FileType, MessageType, PollOptionType } from '../types/types';

const Posts = ({ uid, className }: PostsProps) => {

    const { client } = useContext(WeavyContext);
    const [appId, setAppId] = useState<number | null>(null);    
    const addPostMutation = useMutatePost();
    if (!client) {
        throw new Error('Weavy Posts component must be used within an WeavyProvider');
    }

    // init app
    const { isLoading, data } = usePosts(uid, {});

    useEffect(() => {
        if (data) {
            setAppId(data.id);
        } else {
            setAppId(null);
        }
    }, [data]);

    const handleCreate = async (text: string, blobs: BlobType[], attachments: FileType[], meetingId: number | null, embed: number | null, options: PollOptionType[]) => {
        
        await addPostMutation.mutateAsync({ appId: appId, text: text, blobs: blobs, meeting: meetingId, embed: embed, options: options }, {
            onSuccess: (data: MessageType) => {
                
            }
        });
    } 

    return (
        <div className={classNames("wy-posts", className)}>
            
            {!isLoading && !data &&
                <div>No posts app with the contextual id <strong>{uid}</strong> was found.</div>
            }
            {appId && data &&
                <div className='wy-post'>
                    <Editor editorType='posts' editorLocation='apps' appId={appId} placeholder={'Create a post'} buttonText='Post' onSubmit={handleCreate} showAttachments={true} showCloudFiles={true} showEmbeds={true} showPolls={true} useDraft={true}/>
                </div>
            }        
            
            {appId &&
                <PostList appId={appId} />
            }
        
        </div>
    )
}

export default Posts;