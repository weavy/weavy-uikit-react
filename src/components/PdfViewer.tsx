import React, { useEffect, useRef, useCallback, useState } from "react";
import pdfjsLib from 'pdfjs-dist';
import pdfjsViewer from 'pdfjs-dist/web/pdf_viewer';
import Icon from "../ui/Icon";

type Props = {
    src: string
}

const PdfViewer = ({ src }: Props) => {
    //const viewerRef = useRef(null);
    const pageNumberRef = useRef<HTMLInputElement>(null);
    const totalPagesRef = useRef<HTMLSpanElement>(null);
    const zoomLevelRef = useRef<HTMLInputElement>(null);

    const [pdfEventBus, setPdfEventBus] = useState<pdfjsViewer.EventBus>();

    const [pdfViewer, setPdfViewer] = useState<pdfjsViewer.PDFViewer>();
    const [pdfLinkService, setPdfLinkService] = useState<pdfjsViewer.PDFLinkService>();
    const [pdfFindController, setPdfFindController] = useState<pdfjsViewer.PDFFindController>();

    const DEFAULT_SCALE_DELTA = 1.1;
    const MAX_SCALE = 3.0;
    const MIN_SCALE = 0.2;

    const SEARCH_FOR = "";
    const ENABLE_XFA = true;

    // Some PDFs need external cmaps.
    const CMAP_URL = "/cmaps/";
    const CMAP_PACKED = true;

    // Setting worker path to worker bundle.
    pdfjsLib.GlobalWorkerOptions.workerSrc = "/js/pdf.worker.min.js";

    const viewerRef = useCallback((container: any) => {
        if (container !== null) {

            let linkService = pdfLinkService;
            let findController = pdfFindController;
            let viewer = pdfViewer;
            let eventBus = pdfEventBus;

            if (!pdfEventBus) {
                eventBus = new pdfjsViewer.EventBus();
                setPdfEventBus(eventBus);
            }

            // (Optionally) enable hyperlinks within PDF files.
            if (!pdfLinkService) {
                linkService = new pdfjsViewer.PDFLinkService({
                    eventBus: eventBus!,
                })
                setPdfLinkService(linkService);
            }

            // (Optionally) enable find controller.
            if (!pdfFindController) {
                findController = new pdfjsViewer.PDFFindController({
                    eventBus: eventBus!,
                    linkService: linkService!,
                })
                setPdfFindController(findController);
            }

            if (!pdfViewer && eventBus) {
                // @ts-ignore due to incorrect type def
                viewer = new pdfjsViewer.PDFViewer({
                    container: container,
                    eventBus: eventBus,
                    linkService: linkService!,
                    findController: findController,
                    //defaultZoomValue: 1.0,
                    //scriptingManager: pdfScriptingManager,
                    //enableScripting: true, // Only necessary in PDF.js version 2.10.377 and below.
                })
                //pdfViewer!.MAX_AUTO_SCALE = 1.0;
                linkService!.setViewer(viewer);
                setPdfViewer(viewer);

                eventBus.on("scalechanging", function () {
                    console.debug("scalechanging")
                    zoomLevelRef.current!.value = (Math.round(viewer!.currentScale * 100)).toFixed(0) + "%";
                });

                eventBus.on("pagechanging", function () {
                    console.debug("pagechanging")
                    if (pageNumberRef.current) {
                        pageNumberRef.current.value = viewer!.currentPageNumber.toFixed(0);
                    }
                });

                eventBus.on("pagesinit", function () {
                    // We can use pdfViewer now, e.g. let's change default scale.
                    viewer!.currentScaleValue = "auto";
                    pageNumberRef.current!.value = "1";
                    totalPagesRef.current!.innerText = viewer!.pagesCount.toFixed(0);

                    // We can try searching for things.
                    if (SEARCH_FOR) {
                        if (findController && !("_onFind" in findController)) {
                            // @ts-ignore due to missing type def
                            findController.executeCommand("find", { query: SEARCH_FOR });
                        } else {
                            eventBus!.dispatch("find", { type: "", query: SEARCH_FOR });
                        }
                    }
                });
            }

        } else {
            console.warn("pdf viewer dismounted")
        }
    }, []);

    useEffect(() => {
        if (src && pdfViewer && pdfLinkService) {
            let loadingTask: pdfjsLib.PDFDocumentLoadingTask;
            let loadedDoc: pdfjsLib.PDFDocumentProxy;

            loadingTask = pdfjsLib.getDocument({
                url: src,
                enableXfa: ENABLE_XFA,
                cMapUrl: CMAP_URL,
                cMapPacked: CMAP_PACKED,
            });

            // Re-use the worker?
            //pdfjsLib.GlobalWorkerOptions.workerPort = loadingTask._worker.port

            loadingTask.promise.then(function (doc) {
                loadedDoc = doc;
                //console.log("LOADED PDF");
                pdfViewer.setDocument(doc);
                pdfLinkService.setDocument(doc, null);
            });

            return () => {
                if (loadingTask) {
                    console.log("resetting pdf viewer");
                    if(loadingTask._transport){
                        loadingTask._transport.destroy();
                    }
                    
                    if (loadedDoc) {
                        loadedDoc.destroy();
                    }

                    //loadingTask.destroy();
                    pdfViewer.cleanup();
                }
            }
        }
    }, [src, pdfViewer])

    function setScale(scale: number | string) {
        console.debug("setScale:", scale)
        if (pdfViewer) {
            pdfViewer.currentScaleValue = typeof scale === "number" ? scale.toFixed(2) : scale;
        }
    }

    function setPage(pageNumber: number) {
        console.debug("setPage:", pageNumber)
        if (pdfViewer) {
            pdfViewer.currentPageNumber = pageNumber;
        }
    }

    function updatePage() {
        console.debug("updatePage");
        if (pdfViewer && pageNumberRef.current) {
            let pageNumber = parseInt(pageNumberRef.current.value);

            if (isNaN(pageNumber)) {
                setPage(pdfViewer.currentPageNumber);
            } else if (pageNumber > pdfViewer.pagesCount) {
                setPage(pdfViewer.pagesCount);
            } else if (pageNumber <= 0) {
                setPage(1);
            } else {
                setPage(pageNumber);
            }

        }
    }

    function select(e: any) {
        console.debug("select");
        e.target.setSelectionRange(0, e.target.value.length);
    }

    function fitToPage() {
        setScale("page-fit");
    }

    function fitToWidth() {
        setScale("page-width");
    }

    function zoomIn() {
        console.debug("zoomIn");

        if (pdfViewer) {
            let newScale = pdfViewer.currentScale;
            let steps = 1;
            do {
                newScale = newScale * DEFAULT_SCALE_DELTA;
                newScale = Math.floor(newScale * 10) / 10;
                newScale = Math.min(MAX_SCALE, newScale);
            } while (--steps > 0 && newScale < MAX_SCALE);

            setScale(newScale);
        }
    }

    function zoomOut() {
        console.debug("zoomOut");
        if (pdfViewer) {
            let newScale = pdfViewer.currentScale;
            let steps = 1;
            do {
                newScale = newScale / DEFAULT_SCALE_DELTA;
                newScale = Math.floor(newScale * 10) / 10;
                newScale = Math.max(MIN_SCALE, newScale);
            } while (--steps > 0 && newScale > MIN_SCALE);

            setScale(newScale);
        }
    }

    function updateZoom() {
        console.debug("updateZoom");
        if (pdfViewer && zoomLevelRef.current) {
            let zoomValue = parseFloat(zoomLevelRef.current.value.replace("%", ""));
            if (isNaN(zoomValue)) {
                setScale(pdfViewer.currentScale + 0.0001);
            } else {
                setScale(zoomValue / 100);
            }
        }
    }

    return (
        <div className="wy-content-pdf" data-controller="pdf" data-pdf-url-value="">
            <div className="wy-toolbar">
                <nav className="wy-tools">
                    <div className="wy-tool">
                        <input type="text" className="wy-input" ref={pageNumberRef} onChange={updatePage} onClick={select} data-pdf-target="pageNumber"/>
                        <span>/</span>
                        <span ref={totalPagesRef}>1</span>
                    </div>
                    <div className="wy-tool">
                        <button className="wy-button wy-button-icon btn-zoom-out" onClick={zoomOut} title="Zoom out"><Icon.UI name="minus" /></button>
                        <input type="text" className="wy-input" ref={zoomLevelRef} onChange={updateZoom} onClick={select} value="100%" data-pdf-target="zoomLevel"/>
                        <button className="wy-button wy-button-icon btn-zoom-in" onClick={zoomIn} title="Zoom in"><Icon.UI name="plus" /></button>
                    </div>
                    <div className="wy-tool">
                        <button className="wy-button wy-button-icon btn-fit-page" onClick={fitToWidth} title="Fit to width"><Icon.UI name="fit-width" /></button>
                        <button className="wy-button wy-button-icon" onClick={fitToPage} title="Fit to screen"><Icon.UI name="fit-screen" /></button>
                    </div>
                </nav>
            </div>
            <div ref={viewerRef} className="wy-pdf-container">
                <div id="viewer" className="pdfViewer"></div>
            </div>
        </div>
    )
}

export default PdfViewer;   