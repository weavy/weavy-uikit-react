import React, { useContext, useEffect, useState } from "react";
import useMutateReaction from "../hooks/useMutateReaction";
import Icon from "../ui/Icon";
import Button from "../ui/Button";
import { MessengerContext } from "../contexts/MessengerContext";
import classNames from "classnames";

import { prefix as wy } from "../utils/styles";
import useReactions from "../hooks/useReactions";
import useMutateDeleteReaction from "../hooks/useMutateDeleteReaction";

type ReactionMenuProps = {
    id: number,
    reactions: ReactableType[]
}

type ReactionsProps = {
    id: number,
    parentId: number | null,
    reactions: ReactableType[]
}

export const ReactionsMenu = ({ id, reactions }: ReactionMenuProps) => {
    const { reactionsList } = useReactions(id, reactions);
    const reactionMutation = useMutateReaction();
    const reactionDeleteMutation = useMutateDeleteReaction();
    const [visible, setVisible] = useState<boolean>(false);
    const { options } = useContext(MessengerContext);
    const [reactedEmoji, setReactedEmoji] = useState<string>('');

    const emojis = options?.reactions;

    useEffect(() => {
        var filtered = reactionsList.find((e) => e.has_reacted);
        setReactedEmoji(filtered ? filtered.content : '')
    }, [reactionsList]);

    useEffect(() => {
        if (visible) {
            document.addEventListener("click", () => { setVisible(false) });
        } else {
            document.removeEventListener("click", () => { setVisible(false) });
        }

    }, [visible]);

    const toggleReactionMenu = (e: any) => {
        e.stopPropagation();
        setVisible(!visible);
    }

    const handleReaction = async (e: any) => {
        // check if the reaction already exists for the user
        const existing = reactionsList.find((r) => r.has_reacted)
        const emoji = e.target.dataset.emoji;

        if (existing) {
            // delete existing reaction
            await reactionDeleteMutation.mutateAsync({ id: id, reaction: emoji });
        }

        // add if not same reaction as before
        if (!existing || existing.content !== emoji) {
            await reactionMutation.mutateAsync({ id: id, reaction: emoji });
        }

        setVisible(false);
    }

    return (
        <div className={wy(classNames("", { "active": visible }))} style={{ position: 'relative' }}>
            <Button.UI onClick={toggleReactionMenu}><Icon.UI name="emoticon-outline" size={1} /></Button.UI>
            <div className={wy('reaction-menu dropdown-menu')} style={{ display: visible ? 'block' : 'none', position: 'absolute', top: '-3.25rem' }}>
                <div className={wy('reaction-picker')}>
                    {emojis?.map((r: string, i: number) => {
                        return <Button.UI key={i} onClick={handleReaction} className={wy(classNames("button-icon reaction-button", { "active": reactedEmoji === r }))} data-emoji={r}>{r}</Button.UI> //reactedEmoji
                    })}
                </div>
            </div>
        </div>
    )

}

export const ReactionsList = ({ id, reactions }: ReactionsProps) => {
    const { reactionsList } = useReactions(id, reactions);

    return (
        <>
            {reactionsList && reactionsList.map((r: ReactionGroup, i: number) => {
                return <span key={i} className={wy('reaction')} title={r.count.toString()}>{r.content}</span> //r.has_reacted
            })}
        </>
    )
}
