import React, { useState } from 'react';
import useVotes from '../hooks/useVotes';
import Icon from '../ui/Icon';
import Sheet from '../ui/Sheet';
import Avatar from './Avatar';
import Spinner from '../ui/Spinner';
import { UserType } from '../types/types';

type Props = {
    id: number,
    text: string,
    has_voted: boolean | undefined
    ratio: number,
    onVote: (id: number) => Promise<void>
}

const PollOption = ({ id, text, has_voted, ratio, onVote }: Props) => {

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const { data, isLoading, refetch } = useVotes(id, { enabled: false });

    const openSheet = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsOpen(true);
        refetch();
    }

    return (
        <>
            <div className='wy-item wy-poll-option' onClick={() => onVote(id)}>
                <div className='wy-progress' style={{ width: ratio + '%' }}></div>

                {has_voted &&
                    <Icon.UI name="check-circle" />
                }
                {!has_voted &&
                    <Icon.UI name="circle-outline" />
                }

                <div className='wy-item-body'>{text}</div>

                {ratio > 0 &&
                    <a className='wy-facepile' onClick={openSheet}> {ratio + '%'} </a>
                }

            </div>

            <Sheet.UI title={text} isOpen={isOpen} onClose={() => setIsOpen(false)}>
                {isLoading &&
                    <Spinner.UI />
                }
                {!isLoading && data && data.map((user: UserType, index: number) => {
                    return (
                        <div className="wy-item" key={'vote' + index}>
                            <Avatar size={32} src={user.avatar_url} name={user.display_name} />
                            <div className="wy-item-body">{user.display_name}</div>
                        </div>
                    )
                })}
            </Sheet.UI>
        </>
    )
}

export default PollOption;