import { useContext } from "react";
import { useQuery } from "react-query";
import { WeavyContext } from "../contexts/WeavyContext";

/// GET a specific app features
export default function useFeatures(type: string, options: any) {
    const { client } = useContext(WeavyContext);

    if (!client) {
        throw new Error('useFeatures must be used within an WeavyProvider');
    }

    const getFeatures = async () => {
        const response = await client.get("/api/features/" + type);
        const data = await response.json();
        return data;
    };


    return useQuery<string[]>(["features", type], getFeatures, options);
}


