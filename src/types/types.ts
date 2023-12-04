export interface IWeavyClient {
    url: string,
    tokenFactoryInternal: () => Promise<string>,
    subscribe: Function,
    unsubscribe: Function,
    destroy: Function,
    get: (url: string, retry?: boolean) => Promise<Response>,
    post: (url: string, method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH", body: string | FormData, contentType?: string, retry?: boolean) => Promise<Response>,
    upload: (url: string, method: "POST" | "PUT" | "PATCH", body: string | FormData, contentType?: string, onProgress?: (progress: number) => void, retry?: boolean) => Promise<Response>
}

export type WeavyClientOptions = {
    url: string,
    tokenFactory: (refresh: boolean) => Promise<string>
}

export type ServerErrorResponse = {
    status: number,
    title: string,
    detail?: string
}

export type WeavyContextProps = {
    client: IWeavyClient | null,
    options?: WeavyContextOptions  
};

export type WeavyContextOptions = {
    zoomAuthenticationUrl?: string,
    teamsAuthenticationUrl?: string,    
    enableScrollbarDetection?: boolean,
    filebrowserUrl?: string,
    pdfWorkerUrl?: string,
    pdfCMapsUrl?: string,
    reactions?: string[]
}

export type MessengerContextProps = {    
    selectedConversationId: null | number,
    setSelectedConversationId: Function    
};

export type UserContextProps = {        
    user: UserType    
};

export type CloudFilesContextProps = {        
  open: Function  
};

export type PreviewContextProps = {
    openPreview: Function,
    closePreview: Function,
    setPreviewFiles: Function
}


export type ProviderProps = {
    children: React.ReactNode,
    client: any
};

export type InsertConversationProps = {
    title: string,
    text: string
}

export type ConversationsResult = {
    data: ConversationType[],
    start: number,
    end: number,
    count: number
}


export type MembersResult = {
    data: MemberType[],
    start: number,
    end: number,
    count: number
}

export type MessagesResult = {
    data: MessageType[],
    start: number,
    end: number,
    count: number
}

export type SortOrder = {
    by: string,
    descending: boolean
} 

export type FileOrderBy = "id" | "name" | "size" | "created_at" | "modified_at" | "timestamp";

export type FileOrder = SortOrder & {
    by: FileOrderBy,
    descending: boolean
}

export type FileView = "list" | "grid";

export type FilesResult = {
    data: FileType[],
    start: number,
    end: number,
    count: number
}

export type ConversationType = {
    id: number,
    created_by_id: number,
    display_name: string,    
    last_message: MessageType,
    is_unread : boolean,
    is_pinned: boolean,    
    is_starred: boolean,
    type: string,
    avatar_url: string,
    user_id?: number,
    members: MembersResult
}

export type MessageType = {
    id: number,
    html: string,    
    text: string,    
    plain: string,    
    app_id: number,        
    temp?: boolean,
    created_at: string,
    created_by: MemberType,    
    created_by_id: number,
    modified_at?: string,
    modified_by?: MemberType,        
    trashed_at?: string,
    trashed_by?: MemberType,        
    attachments: FileType[],
    attachment_ids: number[],
    attachment_count?: number,
    meeting?: MeetingType,
    meeting_id?: number,
    reactions: ReactableType[],    
    embed?: EmbedType,
    comment_count?: number,
    is_subscribed: boolean,
    is_trashed: boolean,
    options?: PollOptionType[]
}

export type PollOptionType = {
    id: number | null,
    text: string,
    has_voted?: boolean,
    vote_count?: number
}

export type UserType = {
    id: number;
    uid?: string;
    name: string;
    username?: string;
    email?: string;
    display_name: string;
    avatar_url?: string;
    presence: string
}

export type MemberType = UserType & {  
    delivered_at?: string,
    read_at?: string,
    marked_id?: number,
    marked_at?: string
    presence: string,
}

export type MemberTypingType =  MemberType & {
    time: number
}


export type FileKindType = "archive"|"audio"|"code"|"document"|"email"|"presentation"|"spreadsheet"|"image"|"text"|"video"|"file";

export type PreviewFormatType = "audio"|"code"|"embed"|"html"|"image"|"pdf"|"text"|"video"|"none";

export type ProviderType = "google-drive"|"onedrive"|"box"|"dropbox";

export type BlobType = {
    id: number,
    name: string,
    size?: number,
    media_type?: string,
    thumbnail_url?: string
}

export type FileType = {
    id: number,
    refId?: number 
    version: number,
    name: string,
    kind: FileKindType,
    media_type: string,
    width?: number,
    height?: number,
    size?: number,
    provider?: string,
    download_url?: string,
    embed_url: string,
    external_url?: string,
    application_url?: string,
    preview_format: PreviewFormatType,
    preview_url?: string,
    thumbnail_url?: string,
    created_at: string,
    created_by?: UserType,
    created_by_id: number,
    modified_at?: string,
    modified_by?: UserType,
    modified_by_id?: number,
    comment_ids?: number[],
    is_subscribed: boolean,
    is_trashed: boolean,
    status?: "ok"|"pending"|"conflict"|"error",
    statusText?: string,
    progress?: number
}

export type ReactionType = {    
    id: number,
    parent: MessageType, 
    content: string,    
    created_by: MemberType,    
    count?: number
}

export type ReactableType = {    
    content: string,    
    created_by_id: number    
}

export type ReactionGroup = {
    content: string,
    count: number,
    has_reacted: boolean
}

export type ReactionsResult = {
    data: ReactionType[],
    start: number,
    end: number,
    count: number
}

export type MeetingType = {
    id: number,
    provider: string,
    provider_id: string,
    uuid: string,
    join_url: string,
    recording_url: string,
    ended_at: string
}

export type BadgeType = {
    private: number,
    rooms: number,
    chat: number
}

export type EntityType = {
    id: number,
    type: string
}

export type RealtimeMessage = {
    action: string,
    id: number,
    actor: UserType,
    message: MessageType
}

export type RealtimeReaction = {
    action: string,
    id: number,
    actor: UserType,
    entity: EntityType,
    reaction: string
}

export type RealtimeApp = {
    action: string,
    id: number,
    actor: UserType,
    app: ConversationType    
}

export type RealtimeMember = {
    action: string,
    id: number,
    actor: UserType,
    app: ConversationType,
    member: MemberType    
}

export type RealtimeTyping = {
    action: string,
    id: number,
    actor: MemberTypingType,
    entity: EntityType,
    type: string    
}

export type AppType = {
    id: number,
    type: string,
    uid: string,
    display_name: string,
    name: string,
    description: string,   
    avatar_url: string,
    metadata: any,
    tags?: string[],
    created_at: string,
    created_by_id: number,
    created_by?: UserType,
    modified_at?: string,
    modified_by_id?: number,
    modified_by?: UserType,
    member_count?: number,
    members?: MemberType[],
    is_subscribed: boolean,
    is_trashed: boolean,
    archive_url: string
}

export type PostsType = {
    id: number,
    display_name: string,    
    last_message: MessageType,
    is_unread : boolean,
    is_pinned: boolean,    
    type: string,
    member_ids: number[],
    avatar_url: string
}

export type EmbedType = {
    id: number,
    title: string,
    description: string,
    type: "link" | "video" | "photo" | "audio" | "rich",
    host: string,
    original_url: string,
    provider_name: string,
    provider_url?: string,
    thumbnail_url?: string,
    thumbnail_width?: number,
    thumbnail_height?: number,
    width?: number,
    height?: number,
    author_name: string,
    author_url: string,
    html?: string
    image?: string
}

export type AppFeatures = {
    attachments?: boolean,
    cloudFiles?: boolean,
    embeds?: boolean,
    meetings?: boolean,
    mentions?: boolean,
    polls?: boolean,
    previews?: boolean,
    reactions?: boolean,
    receipts?: boolean,
    thumbnails?: boolean,
    typing?: boolean,
    comments?: boolean,
    versions?: boolean,
    webDAV?: boolean,
}