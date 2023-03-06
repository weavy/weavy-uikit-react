import React from "react";
import Avatar from "./Avatar";
import dayjs from 'dayjs';
import { MemberType } from "../types/types";

type Props = {
    id: number,
    parentId: number | null,
    seenBy: MemberType[],
    createdAt: string
}

const SeenBy = ({ seenBy }: Props) => {

    return (
        <>
            {seenBy && seenBy.length > 0 &&
                <div className="wy-readby-status">
                    {seenBy.map((member: MemberType) => {
                        const date = dayjs.utc(member.marked_at).tz(dayjs.tz.guess());                        
                        return (<Avatar name={`Seen by ${member.display_name} at ${date.format('LLLL')}`} src={member.avatar_url} size={16} key={member.id} />)
                    })
                    }
                </div>
            }
        </>

    )
}

export default SeenBy;

