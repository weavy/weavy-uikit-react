import React from "react";
import Button from '../ui/Button';
import Icon from '../ui/Icon';
import dayjs from 'dayjs';
type Props = {
    meeting: MeetingCardType

}
const MeetingCard = ({ meeting }: Props) => {

    return (
        <div className="wy-list">
            {meeting.ended_at &&
                <div className="wy-item wy-meeting">
                    <Icon.UI name="zoom" size={4} color="#cccccc"/>
                    <div className="wy-item-body">                        
                        <div className="wy-item-title">Zoom meeting</div>                        
                        <div className="wy-item-body">                            
                            <div>Ended {dayjs.utc(meeting.ended_at).tz(dayjs.tz.guess()).fromNow()}</div>
                            {meeting.recording_url &&
                            <div className="wy-meeting-actions">
                                <a href={meeting.recording_url} target="_blank" className="wy-button wy-button-primary">Play recording</a>
                            </div>
                            }
                        
                        </div>
                    </div>
                </div>
            }

            {!meeting.ended_at &&
                <a className="wy-item wy-meeting" href={meeting.join_url} target="_blank">
                    <Icon.UI name="zoom" color="#4a8cff" size={4} />
                    <div className="wy-item-body">                        
                        <div className="wy-item-title">Zoom meeting</div>                        
                        <div className="wy-item-body">
                            <div>ID: {`${meeting.provider_id.substring(0, 3)}-${meeting.provider_id.substring(3, 6)}-${meeting.provider_id.substring(6)}`}</div>
                            <div className="wy-meeting-actions">
                            <Button.UI className="wy-button-primary">Join meeting</Button.UI>
                            </div>
                            
                        </div>
                    </div>
                </a>
            }

        </div>

    )
}

export default MeetingCard;