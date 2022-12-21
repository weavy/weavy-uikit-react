interface WeavyClient {
    url: string,
    tokenFactoryInternal: () => Promise<string>,
    subscribe: Function,
    unsubscribe: Function,
    destroy: Function,
    get: (url: string, retry?: boolean) => Promise<Response>,
    post: (url: string, method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH", body: string | FormData, contentType?: string, retry?: boolean) => Promise<Response>,
    upload: (url: string, method: "POST" | "PUT" | "PATCH", body: string | FormData, contentType?: string, onProgress?: (progress: number) => void, retry?: boolean) => Promise<Response>
}

type WeavyClientOptions = {
    url: string,
    tokenFactory: (refresh: boolean) => Promise<string>
}

type ServerErrorResponse = {
    status: number,
    title: string,
    detail?: string
}

type WeavyContextProps = {
    client: WeavyClient | null,
    options?: WeavyContextOptions  
};

type WeavyContextOptions = {
    zoomAuthenticationUrl?: string,
    teamsAuthenticationUrl?: string,
    enableCloudFiles?: boolean,
    enableScrollbarDetection?: boolean,
    filebrowserUrl?: string,
    pdfWorkerUrl?: string,
    pdfCMapsUrl?: string,
    reactions?: string[]
}

type MessengerContextProps = {    
    selectedConversationId: null | number,
    setSelectedConversationId: Function    
};

type UserContextProps = {        
    user: UserType    
};

type CloudFilesContextProps = {        
  open: Function  
};

type PreviewContextProps = {
    openPreview: Function,
    closePreview: Function,
    setPreviewFiles: Function
}


type ProviderProps = {
    children: React.ReactNode,
    client: any
};

type InsertConversationProps = {
    title: string,
    text: string
}

type ConversationsResult = {
    data: ConversationType[],
    start: number,
    end: number,
    count: number
}


type MembersResult = {
    data: MemberType[],
    start: number,
    end: number,
    count: number
}

type MessagesResult = {
    data: MessageType[],
    start: number,
    end: number,
    count: number
}

type SortOrder = {
    by: string,
    descending: boolean
} 

type FileOrderBy = "id" | "name" | "size" | "created_at" | "modified_at" | "timestamp";

type FileOrder = SortOrder & {
    by: FileOrderBy,
    descending: boolean
}

type FileView = "list" | "grid";

type FilesResult = {
    data: FileType[],
    start: number,
    end: number,
    count: number
}

type ConversationType = {
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
    member_count?: number
}

type MemberType = {
    id: number,
    name: string,
    display_name: string,
    avatar_url: string,    
    delivered_at?: string,
    read_at?: string,
    presence: string,
    marked_id?: number,
    marked_at?: string

}

type MemberTypingType =  MemberType & {
    time: number
}

type MessageType = {
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

type PollOptionType = {
    id: number | null,
    text: string,
    has_voted?: boolean,
    vote_count?: number
}
 
type UserType = {
    id: number,
    uid: string,
    name: string,
    username: string, 
    email: string,
    display_name: string,    
    avatar_url: string,
    presence: string
}

type FileKindType = "archive"|"audio"|"code"|"document"|"email"|"presentation"|"spreadsheet"|"image"|"text"|"video"|"file";

type PreviewFormatType = "audio"|"code"|"embed"|"html"|"image"|"pdf"|"text"|"video"|"none";

type ProviderType = "google-drive"|"onedrive"|"box"|"dropbox";

type BlobType = {
    id: number,
    name: string,
    size?: number,
    media_type?: string,
    thumbnail_url?: string
}

type FileType = {
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

type ReactionType = {    
    id: number,
    parent: MessageType, 
    content: string,    
    created_by: MemberType,    
    count?: number
}

type ReactableType = {    
    content: string,    
    created_by_id: number    
}

type ReactionGroup = {
    content: string,
    count: number,
    has_reacted: boolean
}

type ReactionsResult = {
    data: ReactionType[],
    start: number,
    end: number,
    count: number
}

type MeetingType = {
    id: number,
    provider: string,
    provider_id: string,
    uuid: string,
    join_url: string,
    recording_url: string,
    ended_at: string
}

type BadgeType = {
    private: number,
    rooms: number,
    chat: number
}

type EntityType = {
    id: number,
    type: string
}

type RealtimeMessage = {
    action: string,
    id: number,
    actor: UserType,
    message: MessageType
}

type RealtimeReaction = {
    action: string,
    id: number,
    actor: UserType,
    entity: EntityType,
    reaction: string
}

type RealtimeApp = {
    action: string,
    id: number,
    actor: UserType,
    app: ConversationType    
}

type RealtimeMember = {
    action: string,
    id: number,
    actor: UserType,
    app: ConversationType,
    member: MemberType    
}

type RealtimeTyping = {
    action: string,
    id: number,
    actor: MemberTypingType,
    entity: EntityType,
    type: string    
}

type AppType = {
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

type PostsType = {
    id: number,
    display_name: string,    
    last_message: MessageType,
    is_unread : boolean,
    is_pinned: boolean,    
    type: string,
    member_ids: number[],
    avatar_url: string
}

type EmbedType = {
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
