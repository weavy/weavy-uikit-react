import { Completion } from "@codemirror/autocomplete"

interface MentionsCompletion extends Completion {
    item?: {
        is_member: boolean,
        avatar_url: string,
        display_name: string
    }
}

export {
    MentionsCompletion
}