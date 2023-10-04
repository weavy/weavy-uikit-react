import React, { useCallback, useContext, useEffect, useState } from "react";
import useMutateReaction from "../hooks/useMutateReaction";
import Icon from "../ui/Icon";
import Button from "../ui/Button";
import classNames from "classnames";
import useEvents from "../hooks/useEvents";

import useMutateDeleteReaction from "../hooks/useMutateDeleteReaction";
import { WeavyContext } from "../contexts/WeavyContext";
import Sheet from "../ui/Sheet";
import Avatar from "./Avatar";
import Spinner from "../ui/Spinner";
import useReactionList from "../hooks/useReactionList";
import { UserContext } from "../contexts/UserContext";
import useMutateReplaceReaction from "../hooks/useMutateReplaceReaction";

import { usePopper } from 'react-popper';
import { ReactableType, ReactionGroup, ReactionType, RealtimeReaction } from "../types/types";
import { Feature } from "../utils/featureUtils";

type ReactionMenuProps = {
    id: number,
    parentId: number | null,
    type: "messages" | "posts" | "comments",
    placement?: "top" | "top-start" | "top-end",
    reactions: ReactableType[]
}

type ReactionsProps = {
    id: number,
    type: "messages" | "posts" | "comments",
    parentId: number | null,
    reactions: ReactableType[],
    featureEnabled?: boolean
}

export const ReactionsLike = ({ id, parentId, type, reactions }: ReactionMenuProps) => {
    const { user } = useContext(UserContext);

    const [reactedEmoji, setReactedEmoji] = useState<string>('');
    const react = useMutateReaction();
    const unreact = useMutateDeleteReaction();
    const replaceReact = useMutateReplaceReaction();
    const like = '👍';

    useEffect(() => {
        var filtered = reactions?.find((e) => e.created_by_id === user.id);
        setReactedEmoji(filtered ? filtered.content : '')
    }, [reactions]);

    const handleReaction = async (emoji: string) => {
        const existing = reactions?.find((r) => r.created_by_id === user.id)

        if (existing && existing.content !== emoji) {
            // replace
            await replaceReact.mutateAsync({ parentId: parentId, id: id, type: type, reaction: emoji })
        } else if (existing) {
            // remove
            await unreact.mutateAsync({ parentId: parentId, id: id, type: type, reaction: emoji });
        } else {
            // add
            await react.mutateAsync({ parentId: parentId, id: id, type: type, reaction: emoji });
        }
    }

    return (
        <Button.UI className="wy-like-button" onClick={() => handleReaction(like)}><Icon.UI name={reactedEmoji === like ? "thumb-up" : "thumb-up-outline"} size={20} /></Button.UI>
        
    )
}

export const ReactionsMenu = ({ id, parentId, type, placement = "top", reactions }: ReactionMenuProps) => {
    const { user } = useContext(UserContext);
    const { options } = useContext(WeavyContext);

    const [visible, setVisible] = useState<boolean>(false);
    const [reactedEmoji, setReactedEmoji] = useState<string>('');
    const emojis = options?.reactions;
    const react = useMutateReaction();
    const unreact = useMutateDeleteReaction();
    const replaceReact = useMutateReplaceReaction();

    const [referenceElement, setReferenceElement] = useState<HTMLButtonElement | null>(null);
    const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null);
    const { styles, attributes, update } = usePopper(visible ? referenceElement : undefined, visible ? popperElement : undefined, { placement: placement });

    useEffect(() => {
        update?.();

        if (visible) {
            document.addEventListener("click", () => { setVisible(false) });
        } else {
            document.removeEventListener("click", () => { setVisible(false) });
        }
    }, [visible]);

    useEffect(() => {
        var filtered = reactions?.find((e) => e.created_by_id === user.id);
        setReactedEmoji(filtered ? filtered.content : '')
    }, [reactions]);

    const toggleReactionMenu = (e: any) => {
        e.stopPropagation();
        setVisible(!visible);
    }

    const handleReaction = async (emoji: string) => {
        const existing = reactions?.find((r) => r.created_by_id === user.id)

        if (existing && existing.content !== emoji) {
            // replace
            await replaceReact.mutateAsync({ parentId: parentId, id: id, type: type, reaction: emoji })
        } else if (existing) {
            // remove
            await unreact.mutateAsync({ parentId: parentId, id: id, type: type, reaction: emoji });
        } else {
            // add
            await react.mutateAsync({ parentId: parentId, id: id, type: type, reaction: emoji });
        }


        setVisible(false);

    }

    return (
        <div className={classNames({ "wy-active": visible })} style={{ position: 'relative' }}>
            <Button.UI ref={setReferenceElement} className="wy-reaction-menu-button" onClick={toggleReactionMenu}><Icon.UI name="emoticon-plus" size={20} /></Button.UI>
            <div ref={setPopperElement} className="wy-reaction-menu wy-dropdown-menu" hidden={!visible} style={styles.popper} {...attributes.popper}>
                <div className="wy-reaction-picker">
                    {emojis?.map((r: string, i: number) => {
                        return <Button.UI key={i} onClick={() => handleReaction(r)} className={classNames("wy-button-icon wy-reaction-button", { "wy-active": reactedEmoji === r })} data-emoji={r}><span className="wy-emoji">{r}</span></Button.UI> //reactedEmoji
                    })}
                </div>
            </div>
        </div>
    )
}

export const ReactionsList = ({ id, type, reactions, featureEnabled = true }: ReactionsProps) => {
    const { user } = useContext(UserContext);
    const [reactionsList, setReactionsList] = useState<ReactableType[]>();
    const [list, setList] = useState<ReactionGroup[]>([]);
    const [count, setCount] = useState<number>(0)
    const { data, isLoading, refetch } = useReactionList(id, type, { enabled: false });
    const { on, off } = useEvents();    
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        on('reaction_added_' + id, handleRealtimeReactionInserted);
        on('reaction_deleted_' + id, handleRealtimeReactionDeleted);

        return () => {
            off('reaction_added_' + id, handleRealtimeReactionInserted);
            off('reaction_deleted_' + id, handleRealtimeReactionDeleted);
        }
    }, [id]);

    useEffect(() => {
        setReactionsList(reactions);
    }, [reactions])

    useEffect(() => {

        if (reactionsList) {
            let group = [...new Map<string, ReactableType>(reactionsList?.map((item: ReactableType) => [item.content, item])).values()];

            let list = group.map((item: ReactableType): ReactionGroup => {
                return {
                    content: item.content,
                    count: reactionsList.filter((r) => r.content === item.content).length,
                    has_reacted: reactionsList.filter((r) => r.content === item.content && r.created_by_id === user.id).length > 0
                }
            });

            let reactionCount = list.reduce(
                (previousValue, currentItem) => previousValue + currentItem.count,
                0,
            );
            setList(list);
            setCount(reactionCount);

            if (isOpen) {
                setTimeout(() => refetch(), 200);
            }
        }

    }, [reactionsList, id, type]);

    const handleRealtimeReactionInserted = useCallback((reaction: RealtimeReaction) => {
        if (reaction.entity.id === id && reaction.actor.id !== user.id) {
            setReactionsList((oldList) => {
                return [...oldList || [], { content: reaction.reaction, created_by_id: reaction.actor.id }];
            });
        }
    }, [id, reactionsList]);

    const handleRealtimeReactionDeleted = useCallback((reaction: RealtimeReaction) => {
        if (reaction.entity.id === id && reaction.actor.id !== user.id) {
            setReactionsList(oldList => oldList?.filter(item => item.created_by_id !== reaction.actor.id));
        }
    }, [id, reactionsList]);


    const handleOpen = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        refetch();
        setIsOpen(true);
    }


    return (
        <>
            {count > 0 && featureEnabled && <>
                <Button.UI className="wy-reactions wy-button-icon" onClick={handleOpen}>
                    {!!list && list.map((r: ReactionGroup, i: number) => {
                        return <span key={i} className="wy-emoji" title={r.count.toString()}>{r.content}</span>
                    })}
                    {count > 1 && <span className="wy-reaction-count">{count}</span>}
                </Button.UI>

                {<Sheet.UI title="Reactions" isOpen={isOpen} onClose={() => { setIsOpen(false); }}>
                    {isOpen && <>
                        {isLoading &&
                            <Spinner.UI overlay={true} />
                        }
                        {!isLoading && data && data.data?.map((reaction: ReactionType, index: number) => {
                            return (
                                <div className="wy-item" key={'r' + index}>
                                    <Avatar size={32} src={reaction.created_by.avatar_url} name={reaction.created_by.display_name} />
                                    <div className="wy-item-body">{reaction.created_by.display_name}</div>
                                    <span className="wy-emoji">{reaction.content}</span>
                                </div>
                            )
                        })}
                    </>}
                </Sheet.UI>}
            </>}

            {count > 0 && !featureEnabled && <>
                <a href="#" className="wy-like-count" onClick={(e) => handleOpen(e)}>{count} {count === 1 ? "like": "likes"}</a>

                {<Sheet.UI title="Reactions" isOpen={isOpen} onClose={() => { setIsOpen(false); }}>
                    {isOpen && <>
                        {isLoading &&
                            <Spinner.UI overlay={true} />
                        }
                        {!isLoading && data && data.data?.map((reaction: ReactionType, index: number) => {
                            return (
                                <div className="wy-item" key={'r' + index}>
                                    <Avatar size={32} src={reaction.created_by.avatar_url} name={reaction.created_by.display_name} />
                                    <div className="wy-item-body">{reaction.created_by.display_name}</div>
                                    <span className="wy-emoji">{reaction.content}</span>
                                </div>
                            )
                        })}
                    </>}
                </Sheet.UI>}
            </>}

        </>
    )
}
