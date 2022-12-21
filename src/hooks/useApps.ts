import { useContext } from "react";
import { useQuery } from "react-query";
import { WeavyContext } from "../contexts/WeavyContext";

/// GET a specific app
export default function useApp(uid: string, options: any) {
    const { client } = useContext(WeavyContext);

    if (!client) {
        throw new Error('useApp must be used within an WeavyProvider');
    }

    const getApp = async () => {
        const response = await client.get("/api/apps/" + uid);
        const data = await response.json();
        return data;
    };


    return useQuery<AppType>(["apps", uid], getApp, options);
}


