import React, { useState } from 'react';
import useMutateConversation from '../hooks/useMutateConversation';
import Icon from '../ui/Icon';
import Overlay from '../ui/Overlay';
import Button from '../ui/Button';
import SearchUsers from './SearchUsers';

const NewConversation = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const addConversationMutation = useMutateConversation();
    
    const handleCreate = async (selected: UserType[]) => {
        
        const membersList = selected.map((m) => m.id);
        await addConversationMutation.mutateAsync({ members: membersList });
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
                <header className="wy-appbars">
                    <nav className="wy-appbar">
                        <Button.UI onClick={handleClose}><Icon.UI name='close' /></Button.UI>
                        <div className="wy-appbar-text">Create conversation</div>
                    </nav>
                </header>

                <SearchUsers handleSubmit={handleCreate} buttonTitle="Create conversation"/>
            </Overlay.UI>
        </>



    )
}

export default React.memo(NewConversation);