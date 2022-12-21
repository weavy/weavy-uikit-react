import React, { FC, useContext } from 'react';
import dayjs from 'dayjs';
import { MessageProps } from "../types/Message"
import Attachment from './Attachment';
import { ReactionsMenu, ReactionsList } from './Reactions';
import { Image, ImageGrid } from "./Image"
import SeenBy from './SeenBy';
import Avatar from "./Avatar";
import MeetingCard from './MeetingCard';
import { PreviewContext } from "../contexts/PreviewContext";
import classNames from 'classnames';

const Message: FC<MessageProps> = ({ id, html, temp, me, avatar, name, created_at, created_by, attachments, meeting, parentId, reactions, seenBy, chatRoom }) => {

    const { openPreview, setPreviewFiles } = useContext(PreviewContext);

    let images = attachments?.filter((a: FileType) => a.kind === "image" && a.thumbnail_url);
    let files = attachments?.filter((a: FileType) => a.kind !== "image" || !a.thumbnail_url);

    const date = dayjs.utc(created_at).tz(dayjs.tz.guess());

    const handlePreviewClick = (e: React.MouseEvent<HTMLInputElement>, attachmentId: number) => {
        e.preventDefault();
        setPreviewFiles(attachments);
        openPreview(attachmentId);
    }

    return (
        <>
            <div className={classNames("wy-message", { "wy-message-me": me })}>
                {!me && (
                    <div className="wy-message-author">
                        {avatar && <Avatar src={avatar} size={32} name={name} />}
                    </div>
                )}
                <div className="wy-message-content">
                    <div className="wy-message-meta">
                        {chatRoom && !me &&
                            <span>{created_by} · </span>                            
                        }
                        <time dateTime={created_at} title={date.format('LLLL')}>{date.fromNow()}</time>
                    </div>

                    <div className="wy-message-bubble">
                        {temp &&
                            <div className="wy-content">{html}</div>
                        }
                        {!temp &&
                            <>
                                {images && !!images.length && <ImageGrid>
                                    {images.map((a: FileType) => 
                                        a.download_url &&
                                        <Image onClick={(e) => handlePreviewClick(e, a.id)} key={a.id} src={a.download_url} previewSrc={a.preview_url} width={a.width} height={a.height} /> || null
                                    )}
                                </ImageGrid>}

                                {html && <div className="wy-content" dangerouslySetInnerHTML={{ __html: html || "" }}></div>}

                                {meeting &&
                                    <MeetingCard meeting={meeting} />
                                }

                                {files && !!files.length && <div className="wy-list wy-list-bordered">
                                    {files.map((a: FileType) =>
                                        <Attachment key={a.id} onClick={(e) => handlePreviewClick(e, a.id)} name={a.name} previewFormat={a.kind} provider={a.provider} url={a.download_url} previewUrl={a.provider ? a.external_url : a.preview_url} mediaType={a.media_type} kind={a.kind} size={a.size} />
                                    )}
                                </div>}
                                <div className="wy-reactions-line">
                                    <ReactionsList id={id}  type="messages" parentId={parentId} reactions={reactions} />
                                    {!temp && <ReactionsMenu  parentId={parentId}id={id} type="messages" reactions={reactions} placement={ me ? "top-end" : "top-start"} />}
                                </div>
                            </>
                        }
                    </div>
                </div>
            </div>
            <SeenBy id={id} parentId={parentId} seenBy={seenBy} createdAt={created_at} />
        </>
    )

}

export default Message;