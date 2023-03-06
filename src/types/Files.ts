import { FileOrder, FileView } from "./types";

export interface FilesProps {
  uid: string,
  className?: string,
  view?: FileView,
  order?: FileOrder,
  trashed?: boolean 
}
