import React, { useEffect, useState } from "react"
import useDebounce from "../hooks/useDebounce";
import useSearchUsers from "../hooks/useSearchUsers";
import Avatar from './Avatar';
import Button from '../ui/Button';
import Icon from '../ui/Icon';

type SearchUsersProps = {
    existingMembers?: MemberType[],
    handleSubmit: any,
    buttonTitle: string
}

const SearchUsers = ({ existingMembers, handleSubmit, buttonTitle }: SearchUsersProps) => {

    const [text, setText] = useState("");
    const [selected, setSelected] = useState<MemberType[]>([]);

    const { data, refetch } = useSearchUsers(text || "*", {
        enabled: false
    });

    const throttledCb = useDebounce(() => refetch(), 250);
    useEffect(throttledCb, [text])

    const isChecked = (memberId: number): boolean => {
        return selected.find((m) => { return m.id === memberId }) != null;
    }

    const handleSelected = (member: MemberType, checked: boolean) => {
        if (checked) {
            setSelected([...selected, member]);
        } else {
            setSelected(selected.filter((m) => { return m.id !== member.id }));
        }
    }
    const clear = () => {
        setText("");
    }

    return (
        <div className="wy-search wy-scroll-y">
            <div className="wy-pane-group">
                <div className="wy-search-form wy-input-group">
                    <input className="wy-search-input wy-input wy-input-filled" value={text} onChange={(e) => setText(e.target.value)} name="text" placeholder='Search...' />
                    <Button.UI type="reset" onClick={() => clear()}><Icon.UI name="close-circle" /></Button.UI>
                    <Button.UI><Icon.UI name="magnify" /></Button.UI>
                </div>
            </div>

            <div className="wy-pane-group">
                {data && (!data.data || data.data.filter(m => existingMembers?.find(e => e.id === m.id) === undefined).length === 0) &&
                    <div className="wy-table-no-result">Your search did not match any people.</div>
                }
                {selected && selected.length > 0 &&
                    <div className="wy-pane-group">
                        <label className="wy-input-label">Selected</label>
                        {selected.map((member: MemberType) => {
                            return (
                                <div className='wy-item' key={member.id} >
                                    <Avatar src={member.avatar_url} size={32} id={member.id} presence={member.presence} name={member.display_name} />
                                    <div className="wy-item-body">
                                        {member.display_name}
                                    </div>
                                    <Button.UI onClick={() => handleSelected(member, !isChecked(member.id))} title="Remove">
                                        <Icon.UI name="account-minus" />
                                    </Button.UI>
                                </div>
                            )
                        })}


                        <hr />
                        {/* <div style={{ display: "flex", columnGap: "1.5rem", flexWrap: "wrap" }}>

                            {selected.map((member: MemberType) => {
                                return (
                                    <div style={{ display: "flex", flexDirection: "column" }} title="Click to remove" onClick={() => handleSelected(member, false)}>
                                        <div style={{alignSelf: 'center'}}>
                                            <Avatar src={member.avatar_url} size={32} id={member.id} presence={member.presence} name={member.display_name} />
                                        </div>
                                        <div className="">{member.display_name}</div>
                                    </div>
                                )
                            })}
                        </div> */}
                    </div>
                }

                <div className="wy-pane-group">
                    {data && data.data && data.data.filter(m => existingMembers?.find(e => e.id === m.id) === undefined && selected.find(s => s.id === m.id) === undefined).map((member: MemberType) => {
                        return (
                            <div className='wy-item' key={member.id} >
                                <Avatar src={member.avatar_url} size={32} id={member.id} presence={member.presence} name={member.display_name} />
                                <div className="wy-item-body">
                                    {member.display_name}
                                </div>
                                <Button.UI onClick={() => handleSelected(member, !isChecked(member.id))} title="Add">
                                    <Icon.UI name="account-plus" />
                                </Button.UI>
                            </div>
                        )
                    })}
                </div>

                {/* <table className="wy-table wy-table-hover wy-search-result-table">
                    <tbody>                       
                        {data && data.data && data.data.filter(m => existingMembers?.find(e => e.id === m.id) === undefined && selected.find(s => s.id === m.id) === undefined).map((member: MemberType) => {
                            return (
                                <tr key={member.id} onClick={() => handleSelected(member, !isChecked(member.id))}>
                                    <td className="wy-table-cell-icon">
                                        <Avatar src={member.avatar_url} size={32} id={member.id} presence={member.presence} name={member.display_name} />
                                    </td>
                                    <td className="wy-table-cell-text">{member.display_name}</td>
                                    <td className="wy-table-cell-icon">
                                        <input type="checkbox" className="wy-button-check" checked={isChecked(member.id)} onChange={(() => { })} />
                                        <Button.UI className='wy-button-icon'>
                                            <Icon.Raw name="checkbox-blank" />
                                            <Icon.Raw name="checkbox-marked" />
                                        </Button.UI>                                        
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table> */}
            </div>
            <div className="wy-footerbars">
                <div className="wy-footerbar">
                    <div className="wy-pane-group">
                        <div className="wy-buttons">
                            <button className="wy-button wy-button-primary" type="button" onClick={() => { handleSubmit(selected); clear(); }} disabled={selected.length === 0}>{buttonTitle}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default SearchUsers;