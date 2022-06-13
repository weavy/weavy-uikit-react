export const fileSizeAsString = (size: number) => {
    var s = size;
    var format = [" B", " KB", " MB", " GB", " TB", " PB", " EB", " ZB", " YB"];
    var i = 0;
    while (i < format.length - 1 && s >= 1024) {
        s = (100 * s / 1024) / 100.0;
        i++;
    }
    return s.toLocaleString() + format[i];
}

const isAudio = (ext: string) => {
    switch (ext) {
        case ".aac":
        case ".aif":
        case ".aiff":
        case ".au":
        case ".gsm":
        case ".m4a":
        case ".mid":
        case ".midi":
        case ".mka":
        case ".mp3":
        case ".oga":
        case ".ogg":
        case ".ra":
        case ".ram":
        case ".snd":
        case ".spx":
        case ".wav":
        case ".wma":
            return true;
        default:
            return false;
    }
}

const isImage = (ext: string) => {
    switch (ext) {
        case ".ai":
        case ".apng":
        case ".bmp":
        case ".emf":
        case ".eps":
        case ".gif":
        case ".heic":
        case ".ico":
        case ".jpg":
        case ".jpeg":
        case ".png":
        case ".psd":
        case ".svg":
        case ".tif":
        case ".tiff":
        case ".webp":
        case ".wmf":
            return true;
        default:
            return false;
    }
}

const isVideo = (ext: string) => {
    switch (ext) {
        case ".3g2":
        case ".asx":
        case ".asf":
        case ".avi":
        case ".flv":
        case ".mk3d":
        case ".mkv":
        case ".mov":
        case ".mp4":
        case ".mpeg":
        case ".mpg":
        case ".ogm":
        case ".ogv":
        case ".ogx":
        case ".qt":
        case ".rm":
        case ".rv":
        case ".smi":
        case ".smil":
        case ".swf":
        case ".webm":
        case ".wmv":
        case ".xaml":
            return true;
        default:
            return false;
    }
}

const isMarkup = (ext: string) => {
    switch (ext) {
        case ".htm":
        case ".html":
        case ".xhtml":
        case ".xml":
            return true;
        default:
            return false;
    }
}

const isText = (ext: string) => {
    switch (ext) {
        case ".as":
            case ".as3":
            case ".asm":
            case ".aspx":
            case ".bat":
            case ".c":
            case ".cc":
            case ".cmake":
            case ".coffee":
            case ".cpp":
            case ".cs":
            case ".css":
            case ".cxx":
            case ".diff":
            case ".erb":
            case ".erl":
            case ".groovy":
            case ".gvy":
            case ".h":
            case ".haml":
            case ".hh":
            case ".hpp":
            case ".html":
            case ".hxx":
            case ".java":
            case ".js":
            case ".json":
            case ".jsx":
            case ".less":
            case ".lst":
            case ".m":
            case ".make":
            case ".markdown":
            case ".md":
            case ".mdown":
            case ".mkdn":
            case ".ml":
            case ".mm":
            case ".out":
            case ".patch":
            case ".php":
            case ".pl":
            case ".plist":
            case ".properties":
            case ".py":
            case ".rb":
            case ".sass":
            case ".scala":
            case ".scm":
            case ".script":
            case ".scss":
            case ".sh":
            case ".sml":
            case ".sql":
            case ".txt":
            case ".vb":
            case ".vi":
            case ".vim":
            case ".xhtml":
            case ".xml":
            case ".xsd":
            case ".xsl":
            case ".yaml":
            case ".yml":
            return true;
        default:
            return false;
    }
}

export const getIcon = (name: string, mediaType?: string): { icon: string, color?: string } => {
    var ext = name.substring(name.lastIndexOf('.') , name.length) || name;

    if (ext === "") return { icon: "file" };

    if (isAudio(ext)) {
        return { icon: "file", color: "indigo" };
    } else if (isImage(ext)) {
        return { icon: "file-image", color: "cyan" };
    } else if (isVideo(ext)) {
        return { icon: "file-image", color: "pink" };
    } else if (isMarkup(ext)) {
        return { icon: "file-xml", color: "purple" };
    } else if (isText(ext)) {
        return { icon: "file-document" };
    } else{
        switch (ext) {
            case ".7z":
            case ".zip":
                return { icon: "file-compressed", color: "orange"};                
            case ".doc":
            case ".docm":
            case ".docx":
            case ".dotm":
            case ".dotx":
                return { icon: "file-word", color: "native"};                                                
            case ".eml":
            case ".msg":
                return { icon: "email", color: ""};                                                
            case ".xls":
            case ".xlsm":
            case ".xlsx":
            case ".xltx":
                return { icon: "file-excel", color: "native"};
            case ".pdf":
                return { icon: "file-pdf", color: "native"};                                                
            case ".ppt":
            case ".pptm":
            case ".pptx":
            case ".potx":
                return { icon: "file-powerpoint", color: "native"};                                                                
            case ".pages":
                return { icon: "file", color: "orange"};                                                                                
            case ".numbers":
                return { icon: "file", color: "green"};                                                                
            case ".keynote":
                return { icon: "file", color: "blue"};                                                                
        }
    }

    // fallback
    return { icon: "file" };
}