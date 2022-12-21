import { useContext } from "react";
import { QueryKey, useQuery } from "react-query";
import { WeavyContext } from "../contexts/WeavyContext";

/// GET versions of a file
export default function useFileVersions(filesKey: QueryKey, fileId: number, options: any) {
    const { client } = useContext(WeavyContext);

    if (!client) {
        throw new Error('useReactionList must be used within an WeavyProvider');
    }

    const getVersions = async () => {
        const response = await client.get(`/api/files/${fileId}/versions`);
        const data = await response.json();
        return data;
    };

    return useQuery<FileType[]>([...filesKey, fileId, "versions"], getVersions, options);
}
