import React, { useContext } from "react";
import { CloudFilesContext } from "../contexts/CloudFilesContext";

export default function useCloudFiles(callback: Function) {
    const { open} = useContext(CloudFilesContext);

    const openCloudFiles = () => {        
        open(callback);
    }

    return { openCloudFiles }
}