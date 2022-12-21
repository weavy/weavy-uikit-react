import React, { useContext } from 'react';
import dayjs from 'dayjs';
import Dropdown from '../ui/Dropdown';
import Icon from '../ui/Icon';
import { ReactionsList, ReactionsMenu } from './Reactions';
import Image, { ImageGrid } from './Image';
import Attachment from './Attachment';
import Avatar from './Avatar';
import Embed from './Embed';
import { UserContext } from '../contexts/UserContext';
import { PreviewContext } from "../contexts/PreviewContext";
import useMutateTrashComment from '../hooks/useMutateTrashComment';
import { useQueryClient } from 'react-query';
import { updateCacheItem } from '../utils/cacheUtils';

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
    onEdit: (e: any) => void
}

const CommentView = ({ appId, id, parentId, html, created_at, modified_at, created_by, attachments, reactions, embed, onEdit }: Props) => {
    const { user } = useContext(UserContext);
    const queryClient = useQueryClient();
    const { openPreview, setPreviewFiles } = useContext(PreviewContext);
    const date = dayjs.utc(created_at).tz(dayjs.tz.guess());
    const trashComment = useMutateTrashComment();

    let images = attachments?.filter((a: FileType) => a.kind === "image" && a.thumbnail_url);
    let files = attachments?.filter((a: FileType) => a.kind !== "image" || !a.thumbnail_url);

    const handlePreviewClick = (e: React.MouseEvent<HTMLInputElement>, attachmentId: number) => {
        e.preventDefault();
        setPreviewFiles(attachments);
        openPreview(attachmentId);
    }

    const handleDelete = () => {
        trashComment.mutate({ id: id, appId: appId, parentId: parentId }, {
            onSuccess: () => {
                updateCacheItem(queryClient, ['posts', appId], parentId, (item: MessageType) => {                
                    item.comment_count = (item.comment_count || 1) - 1;
                });                
            }
        });
    }

    return (
        <>
            <div className='wy-item wy-item-sm wy-comment-header'>
                <Avatar src={created_by.avatar_url} size={32} name={created_by.display_name} />
                <div className='wy-item-body'>
                    <div className='wy-item-title'>{created_by.display_name}</div>
                    <div className='wy-item-text'>
                        <time dateTime={created_at} title={date.format('LLLL')}>{date.fromNow()}</time>
                        {modified_at &&
                            <time dateTime={modified_at}> · edited</time>
                        }
                    </div>
                </div>

                <div className='wy-item-actions wy-item-actions-top'>
                    <Dropdown.UI directionX='left'>

                        {/* subscribe / unsubscribe */}

                        {/* edit action */}
                        {user.id === created_by.id &&
                            <Dropdown.Item onClick={onEdit}>
                                <Icon.UI name="pencil"></Icon.UI> Edit
                            </Dropdown.Item>
                        }

                        {/* trash action */}
                        {user.id === created_by.id &&
                            <Dropdown.Item onClick={handleDelete}>
                                <Icon.UI name="trashcan"></Icon.UI> Trash
                            </Dropdown.Item>
                        }
                    </Dropdown.UI>
                </div>

            </div>

            <div className='wy-comment-body'>
                <div className='wy-comment-content'>
                    {/* image grid */}
                    {images && !!images.length && <ImageGrid>
                        {images.map((a: FileType) =>
                             <React.Fragment key={a.id} >
                                {a.download_url &&
                                    <Image onClick={(e) => handlePreviewClick(e, a.id)} key={a.id} src={a.download_url} previewSrc={a.preview_url} width={a.width} height={a.height} />
                                }
                            </React.Fragment>
                        )}
                    </ImageGrid>}

                    {/* embeds */}
                    {embed &&
                        <Embed embed={embed} />
                    }

                    <div className='wy-content' dangerouslySetInnerHTML={{ __html: html }}>
                        {/* markdown */}

                    </div>

                    {/* poll */}

                    {/* files */}
                    {files && !!files.length && <div className="wy-list wy-list-bordered">
                        {files.map((a: FileType) =>
                            <Attachment key={a.id} onClick={(e) => handlePreviewClick(e, a.id)} name={a.name} previewFormat={a.kind} provider={a.provider} url={a.download_url} previewUrl={a.provider ? a.external_url : a.preview_url} mediaType={a.media_type} kind={a.kind} size={a.size} />
                        )}
                    </div>}

                    {/* meeting */}
                </div>
            </div>

            
            <div className='wy-reactions-line'>
                {/* reactions */}
                <ReactionsList id={id} type="comments" parentId={parentId} reactions={reactions} />
                <ReactionsMenu id={id} type="comments" parentId={parentId} reactions={reactions} placement="top-end" />
            </div>
        
        </>
    )
}

export default CommentView;