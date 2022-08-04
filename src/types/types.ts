interface WeavyClient {
    url: string,
    tokenFactory: (() => string | Promise<string>),
    subscribe: Function,
    unsubscribe: Function,
}

type WeavyClientOptions = {
    url: string,
    tokenFactory: (() => string | Promise<string>)
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
    reactions?: string[]
}

type MessengerContextProps = {    
    selectedConversationId: null | number,
    setSelectedConversationId: Function    
};

type UserContextProps = {        
    user: UserType    
};

type PreviewContextProps = {
    openPreview: Function,
    closePreview: Function
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

type ConversationType = {
    id: number,
    display_name: string,    
    last_message: MessageType,
    is_unread : boolean,
    is_pinned: boolean,    
    type: string,
    member_ids: number[],
    avatar_url: string
}

type MemberType = {
    id: number,
    name: string,
    display_name: string,
    avatar_url: string,    
    delivered_at: string,
    read_at: string,
    presence: string
}

type MessageType = {
    id: number,
    html: string,    
    text: string,    
    app_id: number,        
    temp?: boolean,
    created_at: string,
    created_by: MemberType,    
    attachments: AttachmentType[],
    attachment_ids: number[],
    meeting: MeetingCardType,
    meeting_id?: number,
    reactions: ReactableType[],    
}
 
type UserType = {
    id: number,
    username: string, 
    email: string,
    name: string,
    title: string,
    avatar_url: string,
    presence: string
}

type FileType = {
    id: number,
    name: string
}

type AttachmentType = {
    id: number,
    name: string,    
    kind: string,
    media_type: string,
    width: number,
    height: number,
    size: number,
    provider: string,
    download_url: string,
    preview_url: string,
    thumbnail_url: string,
    external_url: string
}

type PreviewFormatType = "text"|"code"|"markup"|"image"|"video"|"audio"|"document"|"embed"|"link"|"download"|"none";

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

type MeetingType = {
    id: number,
    provider: string
}

type MeetingCardType = {
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
