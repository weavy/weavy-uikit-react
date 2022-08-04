import React, { useEffect, useState, useCallback } from "react";
import Icon from "../ui/Icon";
import classNames from "classnames";
import PdfViewer from "./PdfViewer";
import { checkImageLoad, imageLoaded } from "./Image";

const getStream = (response: Response) => {
    if (response && response.ok && response.body) {
        const reader = response.body.getReader();
        return new ReadableStream({
            start(controller) {
                let pump: any = () => {
                    return reader.read().then(({ done, value }) => {
                        // When no more data needs to be consumed, close the stream
                        if (done) {
                            controller.close();
                            return;
                        }
                        // Enqueue the next data chunk into our target stream
                        controller.enqueue(value);
                        return pump();
                    });
                }

                return pump();
            }
        })
    }
};

type ImageProps = {
    src: string,
    width?: number,
    height?: number
}

export const PreviewImage = ({ src, width, height }: ImageProps) => {
    const imageRef = useCallback((element: HTMLImageElement) => {
        if (element) {
            checkImageLoad(element);
        }
    }, [])

    return (
        <>
            {width && height ?
                <div className="wy-content-image wy-responsive-image" style={{ ["--width" as any]: width, ["--height" as any]: height }}>
                    <img ref={imageRef} src={src} onLoad={imageLoaded} width={width} height={height} decoding="async" />
                    {/* TODO: spinner here */}
                </div>
                :
                <div className="wy-content-image wy-responsive-image wy-intrinsic-image">
                    <img ref={imageRef} src={src} onLoad={imageLoaded} decoding="async" />
                </div>
            }
        </>
    );
}

type DocumentProps = {
    src: string
}

export const PreviewDocument = ({ src }: DocumentProps) => {
    return (
        <PdfViewer src={src} />
    );
}

function mediaFallback(media: HTMLVideoElement | HTMLAudioElement) {
    if (media.classList.contains("wy-loading")) {
        media.classList.add("wy-loaded");
    }
    media.classList.add("wy-error");
    // TODO: replace with react way
    media.outerHTML = media.outerHTML.replace(/<(video|audio)/, "<div").replace(/(video|audio)>/, "div>");
}

function mediaLoaded(event: any) {
    var src = event.target;
    if (src.tagName === 'VIDEO' || src.tagName === 'AUDIO') {
        if (src.classList.contains("wy-loading")) {
            console.log("loaded")
            src.classList.add("wy-loaded");
        }
    }
}

function mediaError(event: any) {
    var src = event.target;
    var media;
    if (src.tagName === 'SOURCE') {
        media = src.parentNode;
        media.dataset.errors = (media.dataset.errors || 0) + 1;

        if (media.querySelectorAll("source").length >= media.dataset.errors) {
            console.warn(media.tagName.toLowerCase() + " source error, switching to fallback");
            mediaFallback(media);
        }
    }
}

function codecError(event: any) {
    var src = event.target;
    if (src.tagName === 'VIDEO' || src.tagName === 'AUDIO') {
        // Capture codec-error for video in firefox
        if (src.tagName === 'VIDEO' && !src.videoWidth || src.tagName === 'AUDIO' && !src.duration) {
            console.warn(src.tagName.toLowerCase() + " track not available, switching to fallback");
            mediaFallback(src);
        }
    }
}

type VideoProps = {
    src: string,
    name: string,
    mediaType?: string
}

export const PreviewVideo = ({ src, name, mediaType }: VideoProps) => {
    /* TODO: loading, error handling and stopping */

    return (
        <>
            <video className="wy-content-video" controls crossOrigin="use-credentials" autoPlay>
                <source src={src} type={mediaType} />
                <PreviewIcon src={src} name={name} icon="file-video" download />
            </video>
            {/* TODO: spinner here */}
        </>
    );
}

type AudioProps = {
    src: string,
    name: string,
    mediaType?: string
}

export const PreviewAudio = ({ src, name, mediaType }: AudioProps) => {
    /* TODO: loading, error handling and stopping */
    return (
        <>
            <PreviewIcon src={src} name={name} icon="file-music" download>
                <audio className="wy-content-audio" controls crossOrigin="use-credentials" autoPlay>
                    <source src={src} type={mediaType} />
                </audio>
            </PreviewIcon>
        </>
    );
}

type TextProps = {
    src: string,
    html?: boolean,
    code?: boolean
}

export const PreviewText = ({ src, html = false, code = false }: TextProps) => {
    const [textContent, setTextContent] = useState("");

    useEffect(() => {
        fetch(src)
            .then(getStream)
            // Create a new response out of the stream
            .then(stream => new Response(stream))
            // Create an object URL for the response
            .then(response => response.text())
            .then(text => {
                setTextContent(text)
            })
    }, [src]);

    return (
        <>
            {html ?
                code ?
                    <div className="wy-content-code" dangerouslySetInnerHTML={{ __html: textContent }}></div>
                    :
                    <div className="wy-content-text">
                        <pre className="wy-document" dangerouslySetInnerHTML={{ __html: textContent }}></pre>
                    </div>
                :
                code ?
                    <div className="wy-content-code">{textContent}</div>
                    :
                    <div className="wy-content-text">
                        <pre className="wy-document">{textContent}</pre>
                    </div>
            }
        </>
    );
}

type EmbedProps = {
    src: string,
    name: string,
    icon: string,
    provider?: string
}

export const PreviewEmbed = ({ src, name, icon, provider }: EmbedProps) => {
    /* TODO: add loading and error handling */
    return (
        <>
            {/* iframe needs to be object to not render error pages when content is blocked */}
            <object className="wy-content-iframe" data={src}></object>

            {/* TODO: add spinner here */}

            <PreviewIcon src={src} name={name} icon={icon} provider={provider} className="wy-content-iframe-fallback" />
        </>
    );
}

type IconProps = {
    children?: React.ReactNode,
    src: string,
    icon: string,
    name: string,
    provider?: string,
    download?: boolean,
    className?: string
}

export const PreviewIcon = ({ children, src, icon, name, provider, download = false, className }: IconProps) => {
    return (
        <div className={classNames("wy-content-media", className)}>
            <div className="wy-content-icon">
                <Icon.UI name={icon} />
            </div>
            <div className="wy-content-name">
                {provider ?
                    <a href={src} target="_blank" title={`Open in ${provider}`}>{name} <Icon.UI name="open-in-new" size={1} /></a>
                    : download ?
                        <a href={src} target="_top" download>{name}</a>
                        :
                        <a href={src} target="_blank">{name} <Icon.UI name="open-in-new" size={1} /></a>
                }
            </div>
            {children}
        </div>
    );
}

type PreviewProps = {
    src: string,
    format: PreviewFormatType,
    name: string,
    icon: string,
    width?: number,
    height?: number,
    mediaType?: string,
    provider?: string
}

export const Preview = ({ src, format, name, icon, width, height, mediaType, provider }: PreviewProps) => {
    return (
        <>
            {format === "image" &&
                <PreviewImage src={src} width={width} height={height} />
            }
            {format === "document" &&
                <PreviewDocument src={src} />
            }
            {format === "video" &&
                <PreviewVideo src={src} name={name} mediaType={mediaType} />
            }
            {format === "audio" &&
                <PreviewAudio src={src} name={name} mediaType={mediaType} />
            }
            {format === "text" &&
                <PreviewText src={src} />
            }
            {format === "code" &&
                <PreviewText src={src} html code />
            }
            {format === "markup" &&
                <PreviewText src={src} html />
            }
            {format === "embed" &&
                <PreviewEmbed src={src} name={name} icon={icon} provider={provider} />
            }
            {format === "link" &&
                <PreviewIcon src={src} name={name} icon={icon} provider={provider} />
            }
            {format === "download" &&
                <PreviewIcon src={src} name={name} icon={icon} download />
            }
        </>
    )
}

export default Preview;