export interface MessageProps {
    id: number,
    html: string,
    temp?: boolean | false,
    me: boolean,
    avatar?: string,
    name: string,
    created_at: string,
    created_by: string,
    attachments: AttachmentType[],
    meeting: MeetingCardType,
    parentId: number | null,
    reactions: ReactableType[],
    reactions_count?: number,
    seenBy: MemberType[],
    chatRoom: boolean
}

