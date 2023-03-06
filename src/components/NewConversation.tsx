import React, { useState, useContext } from 'react';
import useMutateConversation from '../hooks/useMutateConversation';
import Icon from '../ui/Icon';
import Overlay from '../ui/Overlay';
import Button from '../ui/Button';
import SearchUsers from './SearchUsers';
import { MessengerContext } from '../contexts/MessengerContext';
import { MemberType } from '../types/types';

const NewConversation = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const addConversationMutation = useMutateConversation();
    const { setSelectedConversationId } = useContext(MessengerContext);
    const handleCreate = async (selected: MemberType[]) => {
        const membersList = selected.map((m) => m.id);
        const conversation = await addConversationMutation.mutateAsync({ members: membersList });
        
        setSelectedConversationId(conversation.id);
        setModalOpen(false);
    }

    const handleOpen = () => {
        setModalOpen(true);
    }

    const handleClose = () => {
        setModalOpen(false);
    }

    return (
        <>
            <Button.UI onClick={handleOpen}><Icon.UI name="plus" /></Button.UI>

            <Overlay.UI isOpen={modalOpen} className="wy-modal">
                <header className="wy-appbars" data-adjust-scrollbar-top>
                    <nav className="wy-appbar">
                        <Button.UI onClick={handleClose}><Icon.UI name='close' /></Button.UI>
                        <div className="wy-appbar-text">New message</div>
                    </nav>
                </header>

                <SearchUsers handleSubmit={handleCreate} buttonTitle="Next"/>
            </Overlay.UI>
        </>



    )
}

export default React.memo(NewConversation);