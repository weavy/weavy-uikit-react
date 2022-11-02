import { useCallback, useContext, useEffect, useLayoutEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import useEvents from "./useEvents";

export default function useReactions(id: number, reactions: ReactableType[]) {
    const { on, off } = useEvents();
    const { user } = useContext(UserContext);
    const [reactionsList, setReactionsList] = useState<ReactableType[]>([]);

    const groupReactions = useCallback((data: ReactableType[]) => {
        var group = [...new Map<string, ReactableType>(data.map((item: ReactableType) => [item.content, item])).values()];

        return group.map((item: ReactableType): ReactionGroup => {
            return {
                content: item.content,
                count: data.filter((r) => r.content === item.content).length,
                has_reacted: data.filter((r) => r.content === item.content && r.created_by_id === user.id).length > 0
            }
        });
    }, [reactionsList]);

    const handleRealtimeReactionInserted = useCallback((reaction: RealtimeReaction) => {        
        if (reaction.entity.id === id) {            
            setReactionsList((oldList) => {
                return [...oldList || [], { content: reaction.reaction, created_by_id: reaction.actor.id }];
            });
        }
    }, [id, reactionsList]);

    const handleRealtimeReactionDeleted = useCallback((reaction: RealtimeReaction) => {        
        if (reaction.entity.id === id) {
            setReactionsList(oldList => oldList.filter(item => item.created_by_id !== reaction.actor.id));
        }
    }, [id, reactionsList]);

    useLayoutEffect(() => {
        setReactionsList(reactions || []);
    }, [reactions]);

    useEffect(() => {
        on('reaction_added_' + id, handleRealtimeReactionInserted);
        on('reaction_deleted_' + id, handleRealtimeReactionDeleted);

        return () => {
            off('reaction_added_' + id, handleRealtimeReactionInserted);
            off('reaction_deleted_' + id, handleRealtimeReactionDeleted);
        }
    }, [id]);

    return { reactionsList: groupReactions(reactionsList) };
}