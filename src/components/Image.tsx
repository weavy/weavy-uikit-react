import React, { useState } from "react";
import { prefix as wy } from "../utils/styles";

type ImageProps = {
    src: string,
    previewSrc: string,
    width: number
    height: number,
    more?: number,
    onClick: (e: any) => void
}

export const Image = ({src, previewSrc, width, height, more, onClick}: ImageProps) => {
    let ratio = width / height;
    let baseSize = 64;
    let maxScale = 2;
    let flexRatio = ratio.toPrecision(5);
    let flexBasis = (ratio * baseSize).toPrecision(5) + "px";
    let padding = (100 / ratio).toPrecision(5) + "%"
    let intrinsicWidth = width + "px"
    let maxWidth = (maxScale * width) + "px";

    return (
        <a href={src} className={wy('image')} onClick={(e) => onClick(e)} style={{
            flexBasis: flexBasis,
            flexGrow: flexRatio,
            flexShrink: flexRatio,
            width: intrinsicWidth,
            maxWidth: maxWidth
        }}>
            <div className={wy('image-area')} style={{ paddingBottom: padding}}>
                <img src={previewSrc} alt="" loading="lazy" decoding="async" />
                {!!more && <span className={wy('more')}>+{more}</span>}
            </div>
        </a>
    );
}

type ImageGridProps = {
    children: React.ReactNode,
    limit?: number
}

export const ImageGrid = ({ children, limit = 3}: ImageGridProps) => {

    let allImages = React.Children.toArray(children);

    let more = allImages.length > limit ? allImages.length - limit : 0;

    let firstImages = allImages.slice(0, limit);

    let lastChild = firstImages[firstImages.length - 1];

    if (React.isValidElement(lastChild)) {
        // Set more property on last image    
        firstImages[firstImages.length - 1] = React.cloneElement(lastChild, { more });
    }

    return (        
        <div className={wy('image-grid')}>
            {firstImages}
        </div>        
    );
}

export default Image;