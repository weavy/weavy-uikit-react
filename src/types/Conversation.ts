import { AppFeatures } from "./types";

export interface ConversationProps {
  id?: number | null,  
  showBackButton?: boolean,
  features?: AppFeatures | undefined
}
