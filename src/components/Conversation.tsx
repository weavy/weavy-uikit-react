import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import { MessengerContext } from '../contexts/MessengerContext';
import { WeavyContext } from '../contexts/WeavyContext';
import useMembers from '../hooks/useMembers';
import { ConversationProps } from '../types/Conversation';
import Typing from './Typing';
import Dropdown from '../ui/Dropdown';
import Icon from '../ui/Icon';
import Button from '../ui/Button';
import Overlay from '../ui/Overlay';
import SearchUsers from './SearchUsers';
import useMutateMembers from '../hooks/useMutateMembers';
import useConversation from '../hooks/useConversation';
import useMutateConversationName from '../hooks/useMutateConversationName';
import useMutateRemoveMembers from '../hooks/useMutateRemoveMembers';
import Avatar from './Avatar';
import { UserContext } from '../contexts/UserContext';
import Messages from './Messages';
import useMutateLeaveConversation from '../hooks/useMutateLeaveConversation';
import { MemberType, RealtimeApp } from '../types/types';
import ConversationBadge from './ConversationBadge';
import Presence from './Presence';
import useFeatures from '../hooks/useFeatures';

const Conversation = ({ id, showBackButton, features }: ConversationProps) => {

    const queryClient = useQueryClient();
    const { client } = useContext(WeavyContext);
    const { selectedConversationId, setSelectedConversationId } = useContext(MessengerContext);
    const { user } = useContext(UserContext);
    const [modalAddOpen, setModalAddOpen] = useState(false);
    const [modalDetailsOpen, setModalDetailsOpen] = useState(false);
    const [title, setTitle] = useState<string>("");
    const [isRoomOrChat, setIsRoomOrChat] = useState<boolean>(false);

    const ChatRoom = "edb400ac-839b-45a7-b2a8-6a01820d1c44";
    const Chat = "d65dd4bc-418e-403c-9f56-f9cf4da931ed";

    if (!client) {
        throw new Error('Weavy Conversation component must be used within an WeavyProvider');
    }

    const { isLoading: isLoadingConversation, data: dataConversation } = useConversation(selectedConversationId, {
        // The query will not execute until the activeConversation exists
        enabled: selectedConversationId != null
    });

    const { isLoading: isLoadingMembers, data: dataMembers, refetch: refetchMembers } = useMembers(selectedConversationId, {
        // The query will not execute until the activeConversation exists
        enabled: selectedConversationId != null
    });

    const { isLoading: isLoadingFeatures, data: dataFeatures } = useFeatures("chat", {
        // The query will not execute until the activeConversation exists
        enabled: selectedConversationId != null
    });

    // react-query (mutation)

    const addMembersMutation = useMutateMembers();
    const updateNameMutation = useMutateConversationName();
    const removeMembers = useMutateRemoveMembers();
    const leaveConversation = useMutateLeaveConversation();

    const handleRealtimeAppUpdated = useCallback((realtimeEvent: RealtimeApp) => {
        if (realtimeEvent.app.id !== selectedConversationId) return;
        queryClient.invalidateQueries(['conversation', selectedConversationId]);
    }, [selectedConversationId]);

    const handleAdd = async (selected: MemberType[]) => {
        const membersList = selected.map((m) => m.id);
        await addMembersMutation.mutateAsync({ id: selectedConversationId, members: membersList });
        setModalAddOpen(false);
    }

    const toggleAddModal = (open: boolean) => {
        setModalAddOpen(open);
    }

    const toggleDetailsModal = (open: boolean) => {
        setModalDetailsOpen(open);
    }

    const handleUpdateTitle = (e: any) => {
        setTitle(e.target.value);
    }

    const handleSaveTitle = () => {
        updateNameMutation.mutate({ id: selectedConversationId, name: title || null });
    }

    const handleLeaveConversation = () => {
        leaveConversation.mutate({ id: selectedConversationId, members: [user.id] });
        setModalDetailsOpen(false);
        setModalAddOpen(false);
    }

    const handleAddMembers = () => {
        setModalDetailsOpen(false);
        setModalAddOpen(true);
    }

    const handleRemoveMember = (id: number) => {
        removeMembers.mutate({ id: selectedConversationId, members: [id] }, {
            onSuccess: () => {
                refetchMembers();
            }
        });
    }

    const handleBack = () => {
        setSelectedConversationId(null);
    }

    // set selected conversation id if id is supplied to component
    useEffect(() => {
        if (id) {
            setSelectedConversationId(id);
        }
    }, [id]);

    useEffect(() => {

        if (selectedConversationId) {
            client.subscribe(`a${selectedConversationId}`, "app_updated", handleRealtimeAppUpdated);
        }

        return () => {

            if (selectedConversationId) {

                client.unsubscribe(`a${selectedConversationId}`, "app_updated", handleRealtimeAppUpdated);
            }
        }
    }, [selectedConversationId]);

    useEffect(() => {
        if (dataConversation && dataConversation.type === ChatRoom) {
            setTitle(dataConversation?.display_name);
        }
        if (dataConversation && (dataConversation.type === ChatRoom || dataConversation.type === Chat)) {
            setIsRoomOrChat(true)
        }
    }, [dataConversation]);

    return (
        <>
            <header className="wy-appbars" data-adjust-scrollbar-top>
                <nav className="wy-appbar">
                    <div>
                        {showBackButton &&
                            <>
                                <Button.UI onClick={handleBack}><Icon.UI name="back" /></Button.UI>
                                <ConversationBadge />
                            </>
                        }</div>
                    {selectedConversationId && dataConversation &&

                        <>
                            <div className="wy-appbar-text">
                                <Typing id={selectedConversationId} context="conversation">
                                <div className="wy-appbar-text wy-typing-hide">
                                        {!isRoomOrChat && dataConversation.user_id &&
                                            <Presence id={dataConversation.user_id} status="away" />
                                        }
                                        {dataConversation.display_name}
                                    </div>
                                </Typing>
                            </div>
                            <Dropdown.UI directionX='left'>

                                <Dropdown.Item onClick={() => toggleDetailsModal(true)}>
                                    <Icon.UI name="information" />
                                    Details
                                </Dropdown.Item>

                                {dataConversation.type === ChatRoom &&
                                    <>
                                        <Dropdown.Item onClick={() => toggleAddModal(true)}>
                                            <Icon.UI name="account-plus" />
                                            Add members
                                        </Dropdown.Item>
                                        <Dropdown.Item onClick={handleLeaveConversation}>
                                            <Icon.UI name="account-minus" />
                                            Leave conversation
                                        </Dropdown.Item>
                                    </>
                                }

                            </Dropdown.UI>
                        </>
                    }
                </nav>
            </header>

            {!selectedConversationId &&
                <div className="wy-avatar-header">
                    <Avatar src={user.avatar_url} name={user.display_name} presence={user.presence} id={user.id} size={256} />
                    <h2 className='wy-title'>Welcome {user.name}!</h2>
                    Create or select a conversation to get started
                </div>
            }
            {selectedConversationId && dataMembers && dataConversation && dataFeatures &&
                <div className="wy-pane-body">
                    <Messages id={selectedConversationId} chatRoom={isRoomOrChat} members={dataMembers} displayName={dataConversation?.display_name} avatarUrl={dataConversation?.avatar_url} lastMessageId={dataConversation?.last_message?.id} features={dataFeatures} appFeatures={features}/>
                </div>
            }

            <Overlay.UI isOpen={modalAddOpen} className="wy-modal">
                <header className="wy-appbars" data-adjust-scrollbar-top>
                    <nav className="wy-appbar">
                        <Button.UI onClick={() => toggleAddModal(false)}><Icon.UI name='close' /></Button.UI>
                        <div className="wy-appbar-text">Add members</div>
                    </nav>
                </header>
                {dataMembers &&
                    <SearchUsers existingMembers={dataMembers.data} handleSubmit={handleAdd} buttonTitle="Save" />
                }

            </Overlay.UI>

            <Overlay.UI isOpen={modalDetailsOpen} className="wy-modal">
                <header className="wy-appbars">
                    <nav className="wy-appbar">
                        <Button.UI onClick={() => toggleDetailsModal(false)}><Icon.UI name='close' /></Button.UI>
                        <div className="wy-appbar-text">Details</div>
                    </nav>
                </header>
                <div className='wy-scroll-y'>
                    {dataConversation && <div className="wy-avatar-header">
                        <Avatar src={dataConversation?.avatar_url} name={title} size={128} />
                        {dataConversation?.type !== ChatRoom &&
                            <h3 className="wy-headline">{dataConversation?.display_name}</h3>
                        }
                    </div>}

                    {dataConversation?.type === ChatRoom && (
                        <>
                            <div className="wy-pane-group">
                                <label className="wy-input-label">Conversation name</label>
                                <div className="wy-input-group">

                                    <input className="wy-input" value={title} onChange={(e) => handleUpdateTitle(e)} />
                                    <Button.UI onClick={handleSaveTitle} className="wy-button-icon">
                                        <Icon.UI name="content-save" />
                                    </Button.UI>
                                </div>
                                <div className="wy-description">Changing the name of a group chat changes it for everyone.</div>

                            </div>
                            <div className="wy-pane-group">
                                <label className="wy-input-label">Members</label>

                                {dataConversation && dataMembers && dataMembers.data && dataMembers.data.map((m: MemberType) => {
                                    return (
                                        <div className='wy-item' key={m.id}>
                                            <Avatar src={m.avatar_url} name={m.display_name} id={m.id} size={32} presence={m.presence} />
                                            <div className="wy-item-body">
                                                {m.display_name}
                                            </div>
                                            {dataConversation.created_by_id === user.id && m.id !== user.id &&
                                                <Button.UI onClick={() => handleRemoveMember(m.id)} className="wy-button-icon" title="Remove member">
                                                    <Icon.UI name="account-minus" />
                                                </Button.UI>
                                            }
                                            {m.id === user.id &&
                                                <Button.UI onClick={() => handleLeaveConversation()} className="wy-button-icon" title="Leave conversation">
                                                    <Icon.UI name="account-minus" />
                                                </Button.UI>
                                            }
                                        </div>
                                    )
                                })}
                                <Button.UI onClick={handleAddMembers} title="Add members">
                                    <Icon.UI name="account-plus" />
                                    <div className="wy-item-body">Add members</div>
                                </Button.UI>
                            </div>
                        </>
                    )}
                </div>
            </Overlay.UI>


        </>
    )
}

export default React.memo(Conversation);
