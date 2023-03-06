import React, { useContext, useState } from 'react';
import dayjs from 'dayjs';
import Dropdown from '../ui/Dropdown';
import Icon from '../ui/Icon';
import { ReactionsList, ReactionsMenu } from './Reactions';
import Comments from './Comments';
import Image, { ImageGrid } from './Image';
import { PreviewContext } from "../contexts/PreviewContext";
import Attachment from './Attachment';
import Avatar from './Avatar';
import Embed from './Embed';
import { UserContext } from '../contexts/UserContext';
import useMutateTrashPost from '../hooks/useMutateTrashPost';
import CommentCount from './CommentCount';
import useMutateSubscribe from '../hooks/useMutateSubscribe';
import useMutateUnsubscribe from '../hooks/useMutateUnsubscribe';
import Poll from './Poll';
import MeetingCard from './MeetingCard';
import { EmbedType, FileType, MeetingType, MemberType, PollOptionType, ReactableType } from '../types/types';

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
    embed: EmbedType | undefined,
    comment_count?: number,
    is_subscribed: boolean,
    options?: PollOptionType[],
    meeting?: MeetingType,
    onEdit: (e: any) => void
}

const PostView = ({ appId, id, html, created_at, modified_at, created_by, attachments, reactions, embed, comment_count, is_subscribed, options, meeting, onEdit }: Props) => {
    const { user } = useContext(UserContext);
    const [loadComments, setLoadComments] = useState<boolean>(false);
    const [showComments, setShowComments] = useState<boolean>(false);
    const { openPreview, setPreviewFiles } = useContext(PreviewContext);
    const date = dayjs.utc(created_at).tz(dayjs.tz.guess());
    const trashPost = useMutateTrashPost();
    const subscribe = useMutateSubscribe();
    const unsubscribe = useMutateUnsubscribe();

    let images = attachments?.filter((a: FileType) => a.kind === "image" && a.thumbnail_url);
    let files = attachments?.filter((a: FileType) => a.kind !== "image" || !a.thumbnail_url);

    const handleCommentsClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        setShowComments((previous) => !previous)
        setLoadComments(true);
    }

    const handlePreviewClick = (e: React.MouseEvent<HTMLInputElement>, attachmentId: number) => {
        e.preventDefault();
        setPreviewFiles(attachments);
        openPreview(attachmentId);
    }

    const handleTrash = () => {
        trashPost.mutate({ id: id, appId: appId });
    }

    const handleSubscription = () => {
        if (is_subscribed) {
            unsubscribe.mutate({ id: id, appId: appId });
        } else {
            subscribe.mutate({ id: id, appId: appId });
        }

    }

    return (
        <div>
            <div className='wy-item wy-item-lg'>
                <Avatar src={created_by.avatar_url} size={48} name={created_by.display_name} />
                <div className='wy-item-body'>
                    <div className='wy-item-row'>
                        <div className='wy-item-title'>{created_by.display_name}</div>
                    </div>
                    <div className='wy-item-row'>
                        <div className='wy-item-text'>
                            <time dateTime={created_at} title={date.format('LLLL')}>{date.fromNow()}</time>
                            {modified_at &&
                                <time dateTime={modified_at}> · edited</time>
                            }
                        </div>
                    </div>
                </div>

                <div className='wy-item-actions wy-item-actions-top'>
                    <Dropdown.UI directionX='left'>

                        {/* subscribe / unsubscribe */}
                        <Dropdown.Item onClick={handleSubscription}>
                            {is_subscribed &&
                                <>
                                    <Icon.UI name="bell-off" /> Unsubscribe
                                </>
                            }
                            {!is_subscribed &&
                                <>
                                    <Icon.UI name="bell" /> Subscribe
                                </>
                            }

                        </Dropdown.Item>

                        {/* edit action */}
                        {user.id === created_by.id &&
                            <Dropdown.Item onClick={onEdit}>
                                <Icon.UI name="pencil" /> Edit
                            </Dropdown.Item>
                        }

                        {/* trash action */}
                        {user.id === created_by.id &&
                            <Dropdown.Item onClick={handleTrash}>
                                <Icon.UI name="trashcan" /> Trash
                            </Dropdown.Item>
                        }
                    </Dropdown.UI>
                </div>

            </div>

            {/* image grid */}
            {images && !!images.length && <ImageGrid>
                {images.map((a: FileType) =>
                    <React.Fragment key={a.id} >
                        {a.download_url &&
                            <Image onClick={(e) => handlePreviewClick(e, a.id)} src={a.download_url} previewSrc={a.preview_url} width={a.width} height={a.height} />
                        }
                    </React.Fragment>
                )}
            </ImageGrid>}

            {/* embeds */}
            {embed &&
                <Embed embed={embed} />
            }

            <div className='wy-post-body'>
                <div className='wy-content' dangerouslySetInnerHTML={{ __html: html }}>
                    {/* markdown */}

                </div>

                {/* poll */}
                {options && options.length > 0 &&
                    <Poll appId={appId} parentId={id} parentType="posts" options={options} />
                }

                {/* files */}
                {files && !!files.length && <div className="wy-list wy-list-bordered">
                    {files.map((a: FileType) =>
                        <Attachment key={a.id} onClick={(e) => handlePreviewClick(e, a.id)} name={a.name} previewFormat={a.kind} provider={a.provider} url={a.download_url} previewUrl={a.provider ? a.external_url : a.preview_url} mediaType={a.media_type} kind={a.kind} size={a.size} />
                    )}
                </div>}

                {/* meeting */}
                {meeting &&
                    <MeetingCard meeting={meeting}/>
                }
            </div>

            <div className='wy-post-footer'>
                <div className='wy-reactions-line'>
                    {/* reactions */}
                    <ReactionsList id={id} type="posts" parentId={appId} reactions={reactions} />
                    <ReactionsMenu id={id} type="posts" parentId={appId} reactions={reactions} />
                </div>

                {/* comment count */}
                <a href="#" className='wy-meta' onClick={(e) => handleCommentsClick(e)}>
                    <CommentCount id={id} count={comment_count || 0} />
                </a>
            </div>

            {/* comments */}
            {loadComments &&
                <div {...(showComments ? {} : { "hidden": true })}>
                    <Comments appId={appId} parentId={id} type="posts" />
                </div>
            }
        </div>
    )
}

export default PostView;