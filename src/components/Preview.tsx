import React, { useEffect, useState, useCallback } from "react";
import Icon from "../ui/Icon";
import Spinner from "../ui/Spinner";
import classNames from "classnames";
import PdfViewer from "./PdfViewer";
import { checkImageLoad, imageLoaded } from "./Image";
import { PreviewFormatType } from "../types/types";

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
                    <img className="wy-loading-transition" ref={imageRef} src={src} onLoad={imageLoaded} width={width} height={height} decoding="async" />
                    <Spinner.UI />
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
    src: string,
    client: any 
}

export const PreviewDocument = ({ src, client }: DocumentProps) => {
    let pdfWorkerUrl = (new URL("/js/pdf.worker.min.js", client.url)).toString();
    let pdfCMapsUrl = (new URL("/cmaps/", client.url)).toString();
    
    return (
        <PdfViewer src={src} pdfWorkerUrl={pdfWorkerUrl} pdfCMapsUrl={pdfCMapsUrl} />
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
            //console.log("loaded")
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

type MediaProps = {
    format: string,
    src: string,
    name: string,
    mediaType?: string
}

export const PreviewMedia = ({ format, src, name, mediaType }: MediaProps) => {

    const [mediaElement, setMediaElement] = useState<HTMLVideoElement|HTMLAudioElement>();
    const mediaRef = useCallback((element: any) => {
        if (element) {
            element.classList.add("wy-loading");
            setMediaElement(element);
        }
    }, [])

    useEffect(() => {
        if (mediaElement) {

            mediaElement.addEventListener('error', mediaError, true); // needs capturing
            mediaElement.addEventListener('loadedmetadata', mediaLoaded, true); // needs capturing
            mediaElement.addEventListener('loadedmetadata', codecError, true); // needs capturing
            
            return () => {
                // cleanup
                mediaElement.pause();
                mediaElement.removeAttribute("autoplay");
                mediaElement.setAttribute("preload", "none");

                mediaElement.removeEventListener('error', mediaError, true); // needs capturing
                mediaElement.removeEventListener('loadedmetadata', mediaLoaded, true); // needs capturing
                mediaElement.removeEventListener('loadedmetadata', codecError, true); // needs capturing    
            }
        }

    }, [mediaElement])

    return (format === "video" ?
        <>
            <video ref={mediaRef} className="wy-content-video" controls crossOrigin="use-credentials" autoPlay>
                <source src={src} type={mediaType} />
                <PreviewIcon src={src} icon="file-video" />
            </video>
            <Spinner.UI />
        </>
        :
        <>
            <audio ref={mediaRef} className="wy-content-audio" controls crossOrigin="use-credentials" autoPlay>
                <source src={src} type={mediaType} />
            </audio>
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
                    <div className="wy-content-code wy-code" dangerouslySetInnerHTML={{ __html: textContent }}></div>
                    :
                    <div className="wy-document wy-light">
                        <div className="wy-content-html" dangerouslySetInnerHTML={{ __html: textContent }}></div>
                    </div>
                :
                code ?
                    <div className="wy-content-code">{textContent}</div>
                    :
                    <div className="wy-document wy-light">
                        <pre className="wy-content-text">{textContent}</pre>
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
    const [embedElement, setEmbedElement] = useState<HTMLObjectElement>();
    const embedRef = useCallback((element: any) => {
        if (element) {
            element.classList.add("wy-loading");
            setEmbedElement(element);
        }
    }, [])

    useEffect(() => {
        if (embedElement) {
            let embedFallbackTimeout = setTimeout(function () {
                //console.log("fallback");
                embedElement.classList.add("wy-fallback");
              }, 2500)

            let embedLoaded = (event: any) => {
                var obj = event.target;
                if (obj.tagName === 'OBJECT' && obj.classList.contains("wy-loading") && !obj.classList.contains("wy-loaded")) {
                  //console.log("loaded");
                  obj.classList.add("wy-loaded");
                  clearTimeout(embedFallbackTimeout);
                }
            }

            embedElement.addEventListener('load', embedLoaded, true); // needs capturing
            
            return () => {
                // cleanup
                embedElement.removeEventListener('load', embedLoaded, true); // needs capturing
                clearTimeout(embedFallbackTimeout);
            }
        }

    }, [embedElement])

    return (
        <>
            {/* iframe needs to be object to not render error pages when content is blocked */}
            <object ref={embedRef} className="wy-content-iframe" data={src}></object>

            <Spinner.UI />

            <PreviewIcon src={src} icon={icon} provider={provider} className="wy-content-iframe-fallback" />
        </>
    );
}

type IconProps = {
    children?: React.ReactNode,
    src: string,
    icon: string,
    provider?: string,
    className?: string
}

export const PreviewIcon = ({ children, src, icon, provider, className }: IconProps) => {
    return (
        <div className={classNames("wy-content-icon", className)}>
            <div className="wy-content-icon">
                <Icon.UI name={icon} />
            </div>
            <div className="wy-content-name">
                {provider ?
                    <>
                        <span>No preview available. </span> 
                        <a href={src} target="_blank">{`Open in ${provider}?`}</a>
                    </>                    
                    : <span>No preview available :(</span> 
                }
            </div>
            {children}
        </div>
    );
}

type PreviewProps = {
    client: any,
    src: string,
    link?: string,
    format: PreviewFormatType,
    name: string,
    icon: string,
    width?: number,
    height?: number,
    mediaType?: string,
    provider?: string
}

export const Preview = ({ client, src, link, format, name, icon, width, height, mediaType, provider }: PreviewProps) => {
    return (
        <>
            {format === "image" &&
                <PreviewImage key={src} src={src} width={width} height={height} />
            }
            {format === "pdf" &&
                /* Key not needed since component is reused and handles cleanup */
                <PreviewDocument src={src} client={client} />
            }
            {(format === "video" || format === "audio") &&
                <PreviewMedia key={src} format={format} src={src} name={name} mediaType={mediaType} />
            }
            {format === "text" &&
                <PreviewText key={src} src={src} />
            }
            {format === "code" &&
                <PreviewText key={src} src={src} html={!/^(?:blob:|data:)/.test(src)} code />
            }
            {format === "html" &&
                <PreviewText key={src} src={src} html />
            }
            {format === "embed" &&
                <PreviewEmbed key={src} src={src} name={name} icon={icon} provider={provider} />
            }
            {format === "none" && (
                link ?
                    <PreviewIcon src={link} icon={icon} provider={provider} />
                :
                    <PreviewIcon src={src} icon={icon} />
            )}
        </>
    )
}

export default Preview;