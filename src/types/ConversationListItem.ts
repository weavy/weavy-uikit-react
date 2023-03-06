import { ConversationType } from "./types";

export interface ConversationListItemProps {
    item: ConversationType,
    userId: number,
    refetchConversations: Function
}