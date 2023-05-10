import React from 'react';
import { useQueryClient } from 'react-query';
import useCommentList from '../hooks/useCommentList';
import useMutateComment from '../hooks/useMutateComment';
import { AppFeatures, BlobType, FileType, MessageType, PollOptionType } from '../types/types';
import Spinner from '../ui/Spinner';
import { updateCacheItem } from '../utils/cacheUtils';
import Comment from './Comment';
import CommentPlaceholder from './CommentPlaceholder';
import Editor from './Editor';
import { Feature, hasFeature } from '../utils/featureUtils';

type Props = {
    appId: number,
    parentId: number,
    type: "posts" | "files" | "apps",
    features: string[],
    appFeatures: AppFeatures | undefined
}

const Comments = ({ appId, parentId, type, features, appFeatures }: Props) => {
    const queryClient = useQueryClient();
    const addCommentMutation = useMutateComment();
    const { isLoading, isError, data, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } = useCommentList(parentId, type, {});

    const handleCreate = async (text: string, blobs: BlobType[], attachments: FileType[], meeting: number | null, embed: number | null,  options: PollOptionType[]) => {
        await addCommentMutation.mutateAsync({ parentId: parentId, type: type, text: text, blobs: blobs, meeting: null, embed: embed }, {
            onSuccess: (data: MessageType) => {                                
                updateCacheItem(queryClient, [type, appId], parentId, (item: MessageType) => {                
                    item.comment_count = (item.comment_count || 0) + 1;
                });
            }
        });
    }

    if (isLoading) {
        return (<div className='wy-buttons'><Spinner.UI /></div>)
    }
    return (
        <div>
            <div className='wy-comments'>
                {!isLoading && data && data.pages && data.pages.map((group, i) => {
                    return <React.Fragment key={data.pages.length - i}>
                        {
                            group.data?.map((comment: MessageType) => {
                                return comment.temp ?
                                    <CommentPlaceholder key={'comment' + comment.id} text={comment.text} created_at={comment.created_at} created_by={comment.created_by} /> :
                                    <Comment
                                        key={'comment' + comment.id}
                                        appId={appId}
                                        parentId={parentId}
                                        id={comment.id}
                                        text={comment.text}
                                        html={comment.html}
                                        created_at={comment.created_at}
                                        modified_at={comment.modified_at}
                                        created_by={comment.created_by}
                                        trashed_at={comment.trashed_at}
                                        attachments={comment.attachments}
                                        reactions={comment.reactions}
                                        embed={comment.embed}
                                        is_trashed={comment.is_trashed}
                                        features={features}
                                        appFeatures={appFeatures}
                                    />
                            })
                        }
                    </React.Fragment>
                })}

            </div>

            {type === "files" ?
                <div className='wy-comment-editor-bottom'>
                    <Editor 
                        editorType='comments' 
                        editorLocation={type} 
                        appId={appId} 
                        parentId={parentId} 
                        placeholder={'Create a comment'} 
                        buttonText="Comment" 
                        onSubmit={handleCreate} 
                        showMention={hasFeature(features, Feature.Mentions, appFeatures?.mentions)} 
                        showAttachments={hasFeature(features, Feature.Attachments, appFeatures?.attachments)} 
                        showCloudFiles={hasFeature(features, Feature.CloudFiles, appFeatures?.cloudFiles)} 
                        showEmbeds={false} 
                        showPolls={false} 
                        useDraft={true} />
                </div>
            :
                <Editor 
                    editorType='comments' 
                    editorLocation={type} 
                    appId={appId} 
                    parentId={parentId} 
                    placeholder={'Create a comment'} 
                    buttonText="Comment" 
                    onSubmit={handleCreate} 
                    showMention={hasFeature(features, Feature.Mentions, appFeatures?.mentions)} 
                    showAttachments={hasFeature(features, Feature.Attachments, appFeatures?.attachments)} 
                    showCloudFiles={hasFeature(features, Feature.CloudFiles, appFeatures?.cloudFiles)} 
                    showEmbeds={false} 
                    showPolls={false} 
                    useDraft={true} />
            }
        </div>
    )
}

export default Comments;