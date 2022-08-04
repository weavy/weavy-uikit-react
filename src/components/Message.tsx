import React, { FC } from 'react';
import dayjs from 'dayjs';
import { MessageProps } from "../types/Message"
import Attachment from './Attachment';
import { ReactionsMenu, ReactionsList } from './Reactions';
import joypixels from 'emoji-toolkit';
import { Image, ImageGrid } from "./Image"
import SeenBy from './SeenBy';
import Avatar from "./Avatar";
import MeetingCard from './MeetingCard';
import usePreview from '../hooks/usePreview';
import classNames from 'classnames';

const Message: FC<MessageProps> = ({ id, html, temp, me, avatar, name, created_at, attachments, meeting, parentId, reactions, seenBy }) => {

    const { open, close } = usePreview(attachments);

    var images = attachments?.filter((a: AttachmentType) => a.kind === "image" && a.thumbnail_url);
    var files = attachments?.filter((a: AttachmentType) => a.kind !== "image" || !a.thumbnail_url);

    const date = dayjs.utc(created_at).tz(dayjs.tz.guess());

    const handlePreviewClick = (e: React.MouseEvent<HTMLInputElement>, attachmentId: number) => {
        e.preventDefault();
        open(attachmentId);
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
                        <time dateTime={created_at} title={date.format('LLLL')}>{date.fromNow()}</time>
                    </div>
                    <div className="wy-message-content-row">
                        <div className="wy-message-bubble">
                            {temp &&
                                <div className="wy-message-text">{html}</div>
                            }
                            {!temp &&
                                <>
                                    {images && !!images.length && <ImageGrid>
                                        {images.map((a: AttachmentType) =>
                                            <Image onClick={(e) => handlePreviewClick(e, a.id)} key={a.id} src={a.download_url} previewSrc={a.preview_url} width={a.width} height={a.height} />
                                        )}
                                    </ImageGrid>}

                                    {html && <div className="wy-message-text" dangerouslySetInnerHTML={{ __html: joypixels.shortnameToUnicode(html || "") }}></div>}

                                    {meeting &&
                                        <MeetingCard meeting={meeting} />
                                    }

                                    {files && !!files.length && <div className="wy-attachments">
                                        {files.map((a: AttachmentType) =>
                                            <Attachment key={a.id} name={a.name} previewFormat={a.kind} provider={a.provider} url={a.download_url} previewUrl={a.provider ? a.external_url : a.preview_url} mediaType={a.media_type} kind={a.kind} size={a.size} />
                                        )}
                                    </div>}
                                </>

                            }
                        </div>
                        <div className="wy-message-buttons">
                            {!temp && <ReactionsMenu id={id} reactions={reactions} />}
                        </div>
                    </div>

                    {!temp && (
                        <div className="wy-reactions">
                            <ReactionsList id={id} parentId={parentId} reactions={reactions} />
                        </div>
                    )}
                    
                </div>

                
            </div>
            <SeenBy id={id} parentId={parentId} seenBy={seenBy} createdAt={created_at} />
        </>
    )

}

export default Message;