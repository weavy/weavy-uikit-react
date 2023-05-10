import { AppFeatures } from "../types/types";

export enum Feature {
    Attachments = "Attachments",
    CloudFiles = "CloudFiles",
    Embeds = "Embeds",
    Meetings = "Meetings",
    Mentions = "Mentions",
    Polls = "Polls",
    Previews = "Previews",
    Reactions = "Reactions",
    Receipts = "Receipts",
    Thumbnails = "Thumbnails",
    Typing = "Typing",
    Webhooks = "Webhooks",
    Comments = "Comments",
    Versions = "Versions",
    WebDAV = "WebDAV"
}

export const hasFeature = (features: string[], feature: Feature, enabled: boolean = true) => {
    return features.indexOf(feature) != -1 && enabled;    
}