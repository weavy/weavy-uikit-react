import React, { useContext, useEffect } from "react";
import { UserContext } from "../contexts/UserContext";
import { WeavyContext } from "../contexts/WeavyContext";
import useMutateMeeting from "../hooks/useMutateMeeting";
import Button from '../ui/Button';
import Icon from '../ui/Icon';

type Props = {
    onMeetingAdded: Function
}

const Meetings = ({ onMeetingAdded }: Props) => {

    const { options } = useContext(WeavyContext);
    const { user } = useContext(UserContext);

    const addMeeting = useMutateMeeting();
    useEffect(() => {
        window.addEventListener("message", createMeeting);


        return () => {
            window.removeEventListener("message", createMeeting);
        }
    }, [onMeetingAdded])

    const createMeeting = async (e: any) => {

        switch (e.data.name) {
            case "zoom-signed-in":
                var meeting = await addMeeting.mutateAsync({ provider: "zoom" });                
                onMeetingAdded(meeting)
                break;

            case "teams-signed-in":
                //console.log("Add Teams meeting");
                break;
        }

    }

    const handleZoom = () => {
        window.open(`${options?.zoomAuthenticationUrl}&state=${user.id}`,
            "zoomAuthWin",
            "height=640,width=480");
    }

    return (
        <>
            {options?.zoomAuthenticationUrl &&
                <Button.UI onClick={handleZoom} title="Add Zoom meeting"><Icon.UI name="zoom" /></Button.UI>
            }
        </>

    )
}

export default Meetings;