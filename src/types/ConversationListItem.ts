import { ConversationType, MembersResult } from "./types";

export interface ConversationListItemProps {
    item: ConversationType,
    userId: number,
    members?: MembersResult,
    refetchConversations: Function
}