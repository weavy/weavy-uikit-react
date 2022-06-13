import React from "react";
import Avatar from "./Avatar";
import dayjs  from 'dayjs';
import { prefix as wy } from "../utils/styles";

type Props = {
    id: number,
    parentId: number | null,
    seenBy: MemberType[],
    createdAt: string
}

const SeenBy = ({ seenBy }: Props) => {
   
    return (
        <div className={wy('readby-status')}>
            {seenBy && seenBy.length > 0 && seenBy.map((member: MemberType) => {
                const date = dayjs.utc(member.read_at).tz(dayjs.tz.guess());
                return (<Avatar name={`Seen by ${member.name} at ${date.format('LLLL')}`} src={member.avatar_url} size={16} key={member.id}/>)})
            }
        </div>
    )
}

export default SeenBy;

