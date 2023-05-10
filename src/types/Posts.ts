import { AppFeatures } from "./types";

export interface PostsProps {
  uid: string,
  className?: string,
  features: AppFeatures | undefined;
}
