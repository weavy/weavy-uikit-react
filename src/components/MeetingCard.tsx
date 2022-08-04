import React from "react";
import Button from '../ui/Button';
import Icon from '../ui/Icon';

type Props = {
    meeting: MeetingCardType

}
const MeetingCard = ({ meeting }: Props) => {

    const handleJoin = () => {

    }

    return (
        <div className="wy-attachments">
            <a className="wy-attachment" href={meeting.join_url} target="_blank">
                <div className="wy-attachment-icon" title="Zoom meeting"><Icon.UI name="zoom" color="#4a8cff" size={4} /></div>
                <div className="wy-attachment-content">
                    <div className="wy-attachment-title">Zoom meeting</div>
                    <div className="wy-attachment-meta">Meeting ID: {`${meeting.provider_id.substring(0,3)}-${meeting.provider_id.substring(3,6)}-${meeting.provider_id.substring(6)}`}</div>                    
                    <Button.UI className="wy-button-primary">Join meeting</Button.UI>
                </div>
            </a>
        </div>

    )
}

export default MeetingCard;