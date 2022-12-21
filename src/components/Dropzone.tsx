import React from "react";
import { useDropzone, FileRejection, DropEvent, Accept } from "react-dropzone";

type Props = {
    onDrop: <T extends File>(acceptedFiles: T[], fileRejections: FileRejection[], event: DropEvent) => void,
    accept?: Accept,
    dragClass: string,
    children?: React.ReactNode
}

const Dropzone = ({ onDrop, accept, dragClass, children }: Props) => {
    const { getRootProps, isDragActive } = useDropzone({
        onDrop,
        accept,
        noClick: true,
        noKeyboard: true
    });

    return (
        <div className={isDragActive ? dragClass: ""} {...getRootProps()} >
            {children}            
        </div>
    )
}

export default Dropzone;