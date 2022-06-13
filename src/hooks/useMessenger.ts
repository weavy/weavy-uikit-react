// import { useContext, useEffect, useState } from "react";
// import { WeavyContext } from "../contexts/WeavyContext";


// export const useMessenger = (id: number) => {
//     //const { client, state, dispatch } = useContext<WeavyContextProps>(WeavyContext);
//     const [loading, setLoading] = useState<boolean>(true);

//     // if (!client) {
//     //     throw new Error('useMessenger must be used within an WeavyProvider');
//     // }


//     useEffect(() => {
//         let mocked = [
//             { id: 11, title: "Chat 1", text: "Quisque cursus, metus vitae pharetra" },
//             { id: 22, title: "Chat 2", text: "Quisque cursus, metus vitae pharetra" }
//         ];

//         setTimeout(() => {
//             init(mocked);
//             setLoading(false);
//         }, 2000);


//     }, [])

//     const init = (data: Conversation[]) => {
//         //dispatch({ app: "messenger", type: "init", payload: data })
//     }

//     const insert = ({ title, text }: InsertConversationProps) => {

//         //dispatch({ app: "messenger", type: "insert", payload: { id: Math.random(), title, text } })
//     }

//     const select = (id: number) => {
//         //dispatch({ app: "messenger", type: "select", payload: id })
//     }


//     return {
//         //data: state.messenger.conversations,
//         //selected: state.messenger.selected,
//         loading,
//         init,
//         select,
//         insert
//     };

// }