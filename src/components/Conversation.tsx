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
import { prefix as wy } from "../utils/styles";
import useMutateRemoveMembers from '../hooks/useMutateRemoveMembers';
import Avatar from './Avatar';
import { UserContext } from '../contexts/UserContext';
import Messages from './Messages';

const Conversation = ({ id, showBackButton }: ConversationProps) => {


    const queryClient = useQueryClient();
    const { client } = useContext(WeavyContext);
    const { selectedConversationId, setSelectedConversationId } = useContext(MessengerContext);
    const { user } = useContext(UserContext);
    const [modalAddOpen, setModalAddOpen] = useState(false);
    const [modalDetailsOpen, setModalDetailsOpen] = useState(false);    
    const [title, setTitle] = useState<string>("");

    const ChatRoom = "edb400ac-839b-45a7-b2a8-6a01820d1c44";

    if (!client) {
        throw new Error('Weavy Conversation component must be used within an WeavyProvider');
    }

    const { isLoading: isLoadingConversation, data: dataConversation } = useConversation(selectedConversationId, {
        // The query will not execute until the activeConversation exists
        enabled: selectedConversationId != null
    });

    const { isLoading: isLoadingMembers, data: dataMembers } = useMembers(selectedConversationId, {
        // The query will not execute until the activeConversation exists
        enabled: selectedConversationId != null
    });

    // react-query (mutation)

    const addMembersMutation = useMutateMembers();
    const updateNameMutation = useMutateConversationName();
    const removeMembers = useMutateRemoveMembers();

    const handleRealtimeAppUpdated = useCallback((data: ConversationType) => {
        if (data.id !== selectedConversationId) return;
        queryClient.invalidateQueries(['conversation', selectedConversationId]);
    }, [selectedConversationId]);

    const handleAdd = async (selected: UserType[]) => {

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
        updateNameMutation.mutate({ id: selectedConversationId, name: e.target.value });
    }

    const handleLeaveConversation = () => {
        removeMembers.mutate({ id: selectedConversationId, members: [user.id] });
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
            client.subscribe(`a${selectedConversationId}`, "app-updated", handleRealtimeAppUpdated);
        }

        return () => {

            if (selectedConversationId) {

                client.unsubscribe(`a${selectedConversationId}`, "app-updated", handleRealtimeAppUpdated);
            }
        }
    }, [selectedConversationId]);

    useEffect(() => {
        if (dataConversation && dataConversation.type === ChatRoom) {
            setTitle(dataConversation?.display_name);
        }
    }, [dataConversation]);




    return (
        <>
            <header className={wy('appbars')}>
                <nav className={wy('appbar')}>
                    <div>
                        {showBackButton &&
                            <Button.UI onClick={handleBack}><Icon.UI name="back" /></Button.UI>
                        }</div>
                    {selectedConversationId && dataConversation &&

                        <>
                            <div className='wy-appbar-text'>
                                <Typing id={selectedConversationId} context="conversation">
                                    {dataConversation.display_name}
                                </Typing>
                            </div>
                            <Dropdown.UI directionX='left'>

                                <Dropdown.Item onClick={() => toggleDetailsModal(true)}>Details</Dropdown.Item>

                                {dataConversation.type === ChatRoom &&
                                    <>
                                        <Dropdown.Item onClick={() => toggleAddModal(true)}>Add people</Dropdown.Item>
                                        <Dropdown.Item onClick={handleLeaveConversation}>Leave conversation</Dropdown.Item>
                                    </>
                                }

                            </Dropdown.UI>
                        </>
                    }
                </nav>
            </header>

            {!selectedConversationId &&
                <div className={wy('avatar-header')}>
                    <Avatar src={user.avatar_url} name={user.title} presence={user.presence} id={user.id} size={256} />
                    <h2>Welcome {user.name}!</h2>
                    Create or select a conversation to get started
                </div>
            }
            {selectedConversationId && dataMembers &&
                <Messages id={selectedConversationId} members={dataMembers} displayName={dataConversation?.display_name} avatarUrl={dataConversation?.avatar_url} />
            }

            <Overlay.UI isOpen={modalAddOpen} className={wy('modal')}>
                <header className={wy('appbars')}>
                    <nav className={wy('appbar')}>
                        <Button.UI onClick={() => toggleAddModal(false)}><Icon.UI name='close' /></Button.UI>
                        <div className={wy('appbar-text')}>Add people</div>
                    </nav>
                </header>
                <SearchUsers handleSubmit={handleAdd} buttonTitle="Add selected" />
            </Overlay.UI>

            <Overlay.UI isOpen={modalDetailsOpen} className={wy('modal')}>
                <header className={wy('appbars')}>
                    <nav className={wy('appbar')}>
                        <Button.UI onClick={() => toggleDetailsModal(false)}><Icon.UI name='close' /></Button.UI>
                        <div className={wy('appbar-text')}>Conversation details</div>
                    </nav>
                </header>
                <div>
                    {dataConversation && <div className={wy('avatar-header')}><Avatar src={dataConversation?.avatar_url} name={title} size={128} /></div>}
                    {dataConversation?.type !== ChatRoom &&
                        <h4 className={wy('avatar-display-name')}>{dataConversation?.display_name}</h4>
                    }

                    {dataConversation?.type === ChatRoom && (
                        <>
                            <div className={wy('pane-group')}>
                                <input className={wy('input')} value={title} onChange={(e) => handleUpdateTitle(e)} />
                            </div>
                            <div className={wy('pane-group')}>
                                <table className={wy('search-result-table')}>
                                    <tbody>
                                        {dataMembers?.data.map((m: MemberType) => {
                                            return (
                                                <tr key={m.id} className={wy('search-result-table-checkbox')}>
                                                    <td className={wy('search-result-table-icon')}><Avatar src={m.avatar_url} name={m.display_name} id={m.id} size={24} presence={m.presence} /></td>
                                                    <td>{m.display_name}</td>
                                                    <td></td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
            </Overlay.UI>

           
        </>
    )
}

export default React.memo(Conversation);
