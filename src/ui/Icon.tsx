import React, { ReactNode } from "react";
import { 
    mdiAccountMinus,
    mdiAccountPlus,
    mdiAlert,
    mdiAlertCircle,
    mdiAlertOctagon,
    mdiArrowLeft, 
    mdiArrowRight, 
    mdiAttachment, 
    mdiBackupRestore, 
    mdiBell, 
    mdiBellOff, 
    mdiBox, 
    mdiChartBox,
    mdiCheck, 
    mdiCheckboxBlankOutline,
    mdiCheckboxMarkedOutline,    
    mdiCheckCircle, 
    mdiCircleOutline, 
    mdiClose, 
    mdiCloseCircle, 
    mdiCloud, 
    mdiComment, 
    mdiCommentOutline, 
    mdiContentSave,
    mdiDelete, 
    mdiDeleteForever, 
    mdiDeleteRestore, 
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
    mdiFormTextbox, 
    mdiGoogleDrive, 
    mdiHelpCircle, 
    mdiInformationOutline,
    mdiMagnify, 
    mdiMenuDown, 
    mdiMenuUp, 
    mdiMessageBadge,
    mdiMicrosoftOnedrive, 
    mdiMinus, 
    mdiOpenInNew, 
    mdiPencil,
    mdiPin, 
    mdiPinOff,
    mdiPlus, 
    mdiPlusCircleOutline,
    mdiRestore,
    mdiSend, 
    mdiSort, 
    mdiStar,
    mdiStarOff,
    mdiSwapHorizontal,
    mdiThumbUp,
    mdiThumbUpOutline,
    mdiTrashCan,    
    mdiVideo, 
    mdiViewListOutline,
    mdiViewModuleOutline
} from "@mdi/js";
import MdiIcon from '@mdi/react';
import classNames from "classnames";

// Custom mapping to MDI instead of symbols
const iconMapping: { [index: string]: string } = {
    "account-minus": mdiAccountMinus,
    "account-plus": mdiAccountPlus,
    "alert": mdiAlert,
    "alert-circle": mdiAlertCircle,
    "alert-octagon": mdiAlertOctagon,
    "attachment": mdiAttachment,
    "back": mdiArrowLeft,
    "backup-restore": mdiBackupRestore,
    "bell": mdiBell,
    "bell-off": mdiBellOff,
    "check": mdiCheck,
    "checkbox-blank": mdiCheckboxBlankOutline,
    "checkbox-marked": mdiCheckboxMarkedOutline,
    "circle-outline": mdiCircleOutline,
    "check-circle": mdiCheckCircle,
    "close": mdiClose,
    "close-circle": mdiCloseCircle,
    "comment": mdiComment,
    "comment-outline": mdiCommentOutline,
    "content-save": mdiContentSave,
    "delete": mdiDelete,
    "delete-restore": mdiDeleteRestore,
    "delete-forever": mdiDeleteForever,
    "dots-vertical": mdiDotsVertical,
    "download": mdiDownload,
    "emoticon-plus": "M 19 0 L 19 3 L 16 3 L 16 5 L 19 5 L 19 8 L 21 8 L 21 5 L 24 5 L 24 3 L 21 3 L 21 0 L 19 0 z M 12 2 C 6.5 2 2 6.5 2 12 C 2 17.5 6.5 22 12 22 C 17.5 22 22 17.5 22 12 L 20 12 C 20 16.4 16.4 20 12 20 C 7.6 20 4 16.4 4 12 C 4 7.6 7.6 4 12 4 L 12 2 z M 8.5 8 C 7.7 8 7 8.7 7 9.5 C 7 10.3 7.7 11 8.5 11 C 9.3 11 10 10.3 10 9.5 C 10 8.7 9.3 8 8.5 8 z M 15.5 8 C 14.7 8 14 8.7 14 9.5 C 14 10.3 14.7 11 15.5 11 C 16.3 11 17 10.3 17 9.5 C 17 8.7 16.3 8 15.5 8 z M 6.9 14 C 7.7 16 9.7 17.5 12 17.5 C 14.3 17.5 16.3 16 17.1 14 L 6.9 14 z",
    "fit-screen": mdiFitToScreen,
    "fit-width": mdiFitToPage,
    "help-circle": mdiHelpCircle,
    "information": mdiInformationOutline,    
    "magnify": mdiMagnify,
    "menu-down": mdiMenuDown,
    "menu-up":mdiMenuUp,
    "minus": mdiMinus,
    "next": mdiArrowRight,
    "open-in-new": mdiOpenInNew,
    "pencil": mdiPencil,
    "pin": mdiPin,
    "unpin": mdiPinOff,
    "plus": mdiPlus,
    "plus-circle-outline": mdiPlusCircleOutline,
    "poll": mdiChartBox,
    "previous": mdiArrowLeft,
    "read": mdiMessageBadge,
    "restore": mdiRestore,
    "unread": mdiCheck,
    "send": mdiSend,
    "sort": mdiSort,
    "star": mdiStar,
    "unstar": mdiStarOff,
    "swap-horizontal": mdiSwapHorizontal,
    "textbox": mdiFormTextbox,
    "thumb-up": mdiThumbUp,
    "thumb-up-outline": mdiThumbUpOutline,
    "trashcan": mdiTrashCan,
    "video": mdiVideo,
    "view-list-outline": mdiViewListOutline,
    "view-module-outline": mdiViewModuleOutline,
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
    "onedrive": mdiMicrosoftOnedrive,
    "box": mdiBox,
    "google-drive": mdiGoogleDrive,
    "zoom": "m12 2c-5.6 0-10 4.5-10 10 0 5.6 4.5 10 10 10 5.5 0 9.9-4.5 9.9-10 .1-5.6-4.4-10-9.9-10zm2.6 13.1c0 .2-.1.3-.3.3h-6.9c-1.1 0-1.9-.8-1.9-1.9v-4.6c0-.2.1-.3.3-.3h6.9c1 0 1.9.8 1.9 1.9zm3.8.1c0 .4-.2.4-.5.2l-2.8-2.1v-2.6l2.8-2.1c.2-.2.5-.1.5.2z",
    "cloud": mdiCloud
}

const nativeColors: { [index: string]: string } = {
    "dropbox": "#0061fe",
    "onedrive": "#0078d4",
    "box": "#0161d5",
    "google-drive": "#1a73e8",
    "zoom": "#4a8cff"
}


type Props = {
    name: string,
    color?: string,
    size?: number,
    title?: string,
    className?: string
}

function getIconName(name: string) {
    return name.split("+");
}

function getIconMapping(name: string) {
    return name in iconMapping ? iconMapping[name] : "";
}

const Icon = ({ name, color = "", size, className, title = "", ...props }: Props) => {
    let [iconName, overlayName] = getIconName(name);
    let iconPath = getIconMapping(iconName);
    let overlayPath = getIconMapping(overlayName);

    let nativeIconColor = color === "native" && nativeColors[iconName] || "";
    let nativeOverlayColor = overlayName && nativeColors[overlayName] || "";  

    title ??= name.split("+").join(" ");

    let remSize = size ? size / 16 : undefined;
    let mdiSize = remSize ? remSize / 1.5 : undefined;

    if (iconPath) {
        if (overlayPath) {
            return (
                <span className={'wy-icon-stack'} style={{width: remSize && (remSize + "rem"), height: remSize && (remSize + "rem")}} title={title}>
                    <MdiIcon className={classNames('wy-icon', (color ? 'wy-icon-' + color : ''), className)} color={nativeIconColor} path={iconPath} size={mdiSize || ""} data-icon={iconName} { ...props } />
                    <MdiIcon color={nativeOverlayColor} path={overlayPath} className={classNames("wy-icon", "wy-icon-overlay", `wy-icon-${overlayName}`)} size={(mdiSize || 1) / 2} data-icon={overlayName}  />
                </span>
            );
        } else {
            return <MdiIcon className={classNames('wy-icon', (color ? 'wy-icon-' + color : ''), className)} color={nativeIconColor} path={iconPath} size={mdiSize || ""} title={title} data-icon={iconName} { ...props } />;
        }
    } else {
        // Fallback
        return <>{name}</>;
    }

}

type IconActiveStackProps = {
    className?: string,
    children: ReactNode  
}

const IconActiveStack = ({ className, children }: IconActiveStackProps) => {
    return <div className={classNames("wy-icon-active-stack", className)}>{children}</div>
}

// Export as replaceable UI component

const UIIcon = { UI: Icon, ActiveStack: IconActiveStack };
export default UIIcon;