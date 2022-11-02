import React, { useEffect, useState } from "react"
import useDebounce from "../hooks/useDebounce";
import useSearchUsers from "../hooks/useSearchUsers";
import Avatar from './Avatar';
import Button from '../ui/Button';
import Icon from '../ui/Icon';

type SearchUsersProps = {
    handleSubmit: any,
    buttonTitle: string
}

const SearchUsers = ({handleSubmit, buttonTitle}: SearchUsersProps) => {

    const [text, setText] = useState("");
    const [selected, setSelected] = useState<MemberType[]>([]);

    const { isLoading, isError, data, error, isFetching, refetch } = useSearchUsers(text, {
        enabled: false
    });

    const throttledCb = useDebounce(() => refetch(), 250);
    useEffect(throttledCb, [text])

    const toggleChecked = (e: any) => {
        let checkbox = e.currentTarget.querySelector("input[type=checkbox]");
        if (checkbox !== e.target && !e.target.matches("label, input[type=checkbox]")) {
            checkbox?.click();
        }
    };

    const isChecked = (id: number): boolean => {
        return selected.find((u) => { return u.id === id }) != null;
    }

    const handleSelected = (e: any, member: MemberType) => {
        if (e.target.checked) {
            setSelected([...selected, member]);
        } else {
            setSelected(selected.filter((u) => { return u.id !== member.id }));
        }

    }

    const clear = () => {
        setSelected([]);
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
                {data && (!data.data || data.data.length === 0) &&
                    <div className="wy-table-no-result">Your search did not match any people.</div>
                }
                <table className="wy-table wy-table-hover wy-search-result-table">
                    <tbody>
                        {data && data.data && data.data.length > 0 && data.data.map((user: MemberType) => {
                            return (
                                <tr key={user.id} onClick={toggleChecked}>
                                    <td className="wy-table-cell-icon">
                                        <Avatar src={user.avatar_url} size={24} id={user.id} presence={user.presence} name={user.display_name} />
                                    </td>
                                    <td className="wy-table-cell-text"><label htmlFor={'chk' + user.id}>{user.display_name}</label></td>
                                    <td className="wy-table-cell-icon"><input type="checkbox" id={'chk' + user.id} checked={isChecked(user.id)} onChange={(e) => handleSelected(e, user)} /></td>
                                </tr>
                            )
                        })}
                    </tbody> 
                </table>
            </div>
            {/*<div className="wy-search-group">
                <h2>Selected people</h2>
                <ul>
                    {selected && selected.length > 0 && selected.map((user: UserType) => {
                        return <li key={user.id}> {user.title} {user.email && ` - ${user.email}`}</li>
                    })}
                </ul>
                </div>*/}
            <div className="wy-footerbars">
                <div className="wy-footerbar">
                    <div className="wy-pane-group">
                        <div className="wy-buttons">
                            <button className="wy-button wy-button-primary" type="button" onClick={() => {handleSubmit(selected); clear();}} disabled={selected.length === 0}>{buttonTitle}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SearchUsers;