import { FileType, MeetingType, MemberType, PollOptionType, ReactableType } from "./types";

export interface MessageProps {
    id: number,
    html: string,
    temp?: boolean | false,
    me: boolean,
    avatar?: string,
    name: string,
    created_at: string,
    created_by: string,
    attachments: FileType[],
    meeting?: MeetingType,
    options?: PollOptionType[],
    appId: number,
    reactions: ReactableType[],
    reactions_count?: number,
    seenBy: MemberType[],
    chatRoom: boolean
}

