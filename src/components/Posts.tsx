import React, { useState, useContext, useEffect, useCallback } from 'react';
import { WeavyContext } from '../contexts/WeavyContext';
import { PostsProps } from '../types/Posts';
import usePosts from '../hooks/usePosts';
import classNames from 'classnames';
import Editor from './Editor';
import PostList from './PostList';
import useMutatePost from '../hooks/useMutatePost';
import { BlobType, FileType, MessageType, PollOptionType } from '../types/types';
import { Feature, hasFeature } from '../utils/featureUtils';
import useFeatures from '../hooks/useFeatures';

const Posts = ({ uid, className, features }: PostsProps) => {

    const { client } = useContext(WeavyContext);
    const [appId, setAppId] = useState<number | null>(null);    
    const addPostMutation = useMutatePost();
    if (!client) {
        throw new Error('Weavy Posts component must be used within an WeavyProvider');
    }

    // init app
    const { isLoading, data } = usePosts(uid, {});

    const { isLoading: isLoadingFeatures, data: dataFeatures } = useFeatures("feeds", { });

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
            {appId && data && dataFeatures &&
                <div className='wy-post'>
                    <Editor 
                        editorType='posts' 
                        editorLocation='apps' 
                        appId={appId} 
                        placeholder={'Create a post'} 
                        buttonText='Post' 
                        onSubmit={handleCreate} 
                        showMention={hasFeature(dataFeatures, Feature.Mentions, features?.mentions)} 
                        showAttachments={hasFeature(dataFeatures, Feature.Attachments, features?.attachments)} 
                        showCloudFiles={hasFeature(dataFeatures, Feature.CloudFiles, features?.cloudFiles)} 
                        showEmbeds={hasFeature(dataFeatures, Feature.Embeds, features?.embeds)} 
                        showPolls={hasFeature(dataFeatures, Feature.Polls, features?.polls)} 
                        useDraft={true}/>
                </div>
            }        
            
            {appId && dataFeatures &&
                <PostList appId={appId} features={dataFeatures} appFeatures={features}/>
            }
        
        </div>
    )
}

export default Posts;