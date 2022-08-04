import React from "react";
import { 
    mdiArrowLeft, 
    mdiArrowRight, 
    mdiAttachment, 
    mdiBox, 
    mdiClose, 
    mdiCloseCircle, 
    mdiCloud, 
    mdiDotsVertical, 
    mdiDownload, 
    mdiDropbox, 
    mdiEmail, 
    mdiFile, 
    mdiFileCode, 
    mdiFileDocument, 
    mdiFileExcel, 
    mdiFileImage, 
    mdiFileMusic, 
    mdiFilePowerpoint, 
    mdiFileVideo, 
    mdiFileWord, 
    mdiFitToPage, 
    mdiFitToScreen, 
    mdiFolderZip, 
    mdiGoogleDrive, 
    mdiMagnify, 
    mdiMicrosoftOnedrive, 
    mdiMinus, 
    mdiOpenInNew, 
    mdiPin, 
    mdiPlus, 
    mdiPlusCircleOutline, 
    mdiSend, 
    mdiVideo 
} from "@mdi/js";
import MdiIcon from '@mdi/react/Icon';

type Props = {
    name: string,
    color?: string,
    size?: number,
}

// Custom mapping to MDI instead of symbols
const iconMapping: { [index: string]: string } = {
    "attachment": mdiAttachment,
    "back": mdiArrowLeft,
    "close": mdiClose,
    "close-circle": mdiCloseCircle,
    "dots-vertical": mdiDotsVertical,
    "download": mdiDownload,
    "emoticon-plus": "M 19 0 L 19 3 L 16 3 L 16 5 L 19 5 L 19 8 L 21 8 L 21 5 L 24 5 L 24 3 L 21 3 L 21 0 L 19 0 z M 12 2 C 6.5 2 2 6.5 2 12 C 2 17.5 6.5 22 12 22 C 17.5 22 22 17.5 22 12 L 20 12 C 20 16.4 16.4 20 12 20 C 7.6 20 4 16.4 4 12 C 4 7.6 7.6 4 12 4 L 12 2 z M 8.5 8 C 7.7 8 7 8.7 7 9.5 C 7 10.3 7.7 11 8.5 11 C 9.3 11 10 10.3 10 9.5 C 10 8.7 9.3 8 8.5 8 z M 15.5 8 C 14.7 8 14 8.7 14 9.5 C 14 10.3 14.7 11 15.5 11 C 16.3 11 17 10.3 17 9.5 C 17 8.7 16.3 8 15.5 8 z M 6.9 14 C 7.7 16 9.7 17.5 12 17.5 C 14.3 17.5 16.3 16 17.1 14 L 6.9 14 z",
    "fit-screen": mdiFitToScreen,
    "fit-width": mdiFitToPage,
    "magnify": mdiMagnify,
    "minus": mdiMinus,
    "next": mdiArrowRight,
    "open-in-new": mdiOpenInNew,
    "pin": mdiPin,
    "plus": mdiPlus,
    "plus-circle-outline": mdiPlusCircleOutline,
    "previous": mdiArrowLeft,
    "send": mdiSend,
    "video": mdiVideo,
    // Files
    "email": mdiEmail,
    "file": mdiFile,
    "file-music": mdiFileMusic,
    "file-image": mdiFileImage,
    "file-video": mdiFileVideo,
    "file-code": mdiFileCode,
    "file-xml": mdiFileCode,
    "file-document": mdiFileDocument,
    "file-word": mdiFileWord,
    "file-excel": mdiFileExcel,
    "file-pdf": mdiFileDocument,
    "file-powerpoint": mdiFilePowerpoint,
    "file-compressed": mdiFolderZip,
    // Providers
    "dropbox": mdiDropbox,
    "ondedrive": mdiMicrosoftOnedrive,
    "box": mdiBox,
    "google-drive": mdiGoogleDrive,
    "zoom": "m12 2c-5.6 0-10 4.5-10 10 0 5.6 4.5 10 10 10 5.5 0 9.9-4.5 9.9-10 .1-5.6-4.4-10-9.9-10zm2.6 13.1c0 .2-.1.3-.3.3h-6.9c-1.1 0-1.9-.8-1.9-1.9v-4.6c0-.2.1-.3.3-.3h6.9c1 0 1.9.8 1.9 1.9zm3.8.1c0 .4-.2.4-.5.2l-2.8-2.1v-2.6l2.8-2.1c.2-.2.5-.1.5.2z",
    "cloud": mdiCloud
}


function getIconMapping(name: string) {
    let [iconName] = name.split("+");
    return iconName in iconMapping ? iconMapping[iconName] : "";
}


function getIconOverlay(name: string) {
    let [, overlay] = name.split("+");
    return overlay in iconMapping ? iconMapping[overlay] : "";
}

const Icon = ({ name, color = "", size, ...props }: Props) => {
    let iconPath = getIconMapping(name);
    let overlayPath = getIconOverlay(name);

    return (
        <span className={'wy-icon ' + color} style={{width: size && (size * 1.5 + "rem"), height: size && (size * 1.5 + "rem")}} { ...props }>
            {iconPath ? <MdiIcon.Icon color={color} path={iconPath} size={size} /> : name }
            {overlayPath && <MdiIcon.Icon color={color} path={overlayPath} className="wy-icon-overlay" size={(size || 1) / 2} /> }
        </span>
    );
}

// Export as replacable UI component
const UIIcon = { UI: Icon };
export default UIIcon;