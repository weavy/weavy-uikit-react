import React, { useState, useEffect } from 'react';
import useMutateVote from '../hooks/useMutateVote';
import PollOption from './PollOption';

type Props = {
    appId: number,
    parentId: number,
    options: PollOptionType[]
}

const Poll = ({ appId, parentId, options }: Props) => {

    const [pollOptions, setPollOptions] = useState<PollOptionType[]>(options)
    const [totalVotes, setTotalVotes] = useState<number>(0);
    const vote = useMutateVote();
    
    useEffect(() => {
        let total = pollOptions.reduce((prev, curr) => prev + (curr.vote_count || 0), 0);
        setTotalVotes(total);
    }, [pollOptions]);

    useEffect(() => {
        setPollOptions(options);
    }, [options]);


    const handleVote = async (optionId: number) => {
        if (optionId) {
            await vote.mutateAsync({ id: optionId, appId: appId, parentId: parentId });            
        }
    }

    return (
        <div className='wy-poll'>
            {pollOptions.map((o: PollOptionType) => {
                let ratio = totalVotes > 0 ? Math.round((((o.vote_count || 0) / totalVotes) * 100)) : 0;
                return (
                    <PollOption key={'option' + o.id} id={o.id || -1} text={o.text} has_voted={o.has_voted} ratio={ratio} onVote={handleVote} />
                )
            })}
        </div>
    )
}

export default Poll;