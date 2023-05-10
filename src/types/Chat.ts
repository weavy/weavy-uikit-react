import { AppFeatures } from "./types";

export interface ChatProps {
  uid: string,
  className?: string,
  features?: AppFeatures | undefined
}
