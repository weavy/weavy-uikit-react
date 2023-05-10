import React, { useContext, useEffect, useState } from 'react';
import useFileList from '../hooks/useFileList';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import FileItem from './FileItem';
import Button from '../ui/Button';
import useMutateFileRename from '../hooks/useMutateFileRename';
import { useMutateFileDeleteForever, useMutateFileRestore, useMutateFileTrash } from '../hooks/useMutateFileTrash';
import { useMutateFileSubscribe, useMutateFileUnsubscribe } from '../hooks/useMutateFileSubscribe';
import Spinner from '../ui/Spinner';
import Icon from '../ui/Icon';
import PreviewFiles from './PreviewFiles';
import { AppFeatures, FileOrder, FileOrderBy, FileType, FileView } from '../types/types';

type Props = {
    appId: number,
    view?: FileView,
    order?: FileOrder,
    trashed?: boolean,
    features: string[],
    appFeatures: AppFeatures | undefined,
    onSorting?: (order: FileOrder) => void,
    onHandleError?: (file: FileType) => void
}

const FileList = ({ appId, view = "list", order, trashed = false, features, appFeatures, onSorting, onHandleError }: Props) => {
    
    const infiniteFiles = useFileList(appId, { meta: { order: order, trashed: trashed }});
    const { isLoading, data, fetchNextPage, hasNextPage, isFetchingNextPage, remove: resetInfiniteFiles } = infiniteFiles;

    const [currentPreview, setCurrentPreview] = useState<number>();

    const openPreview = (previewId: number) => {
        setCurrentPreview(previewId);
    }

    const onClosePreview = () => {
        setCurrentPreview(undefined);
    }

    // Reset query when unmounted
    useEffect(() => () => resetInfiniteFiles(), []);

    const loadMoreRef = useInfiniteScroll(infiniteFiles, [view])

    const mutateFileRename = useMutateFileRename(["files", appId]);
    const mutateFileTrash = useMutateFileTrash(["files", appId]);
    const mutateFileDeleteForever = useMutateFileDeleteForever(["files", appId]);
    const mutateFileRestore = useMutateFileRestore(["files", appId]);
    const mutateFileSubscribe = useMutateFileSubscribe(["files", appId])
    const mutateFileUnsubscribe = useMutateFileUnsubscribe(["files", appId])

    if (isLoading) {
        return (
            <Spinner.UI spin={true} overlay={true} />
        )
    }

    let loadMoreButton = <Button.UI onClick={() => fetchNextPage()} disabled={!hasNextPage || isFetchingNextPage} className="wy-message-readmore">Load more</Button.UI>;

    if (view == "grid") {
        return (
            <>

            <div className="wy-grid wy-pane-group">
                {data && data.pages && data.pages.map((group: any, i: number) => {
                    return <React.Fragment key={i}>
                        {
                            group.data?.map((file: FileType) => {

                                return <FileItem.Card
                                    key={'file-card' + file.id}
                                    file={file}
                                    onClick={(e: any) => !file.is_trashed && openPreview(file.id)}
                                    onRename={(name: string) => mutateFileRename.mutateAsync({ file: file, name: name})}
                                    onSubscribe={(file: FileType) => mutateFileSubscribe.mutateAsync({ file: file })}
                                    onUnsubscribe={(file: FileType) => mutateFileUnsubscribe.mutateAsync({ file: file })}
                                    onTrash={(file: FileType) => mutateFileTrash.mutateAsync({ file: file })}
                                    onRestore={(file: FileType) => mutateFileRestore.mutateAsync({ file: file })}
                                    onDeleteForever={(file: FileType) => mutateFileDeleteForever.mutateAsync({ file: file })}
                                    onHandleError={onHandleError}
                                    features={features}
                                    appFeatures={appFeatures}
                                />
                            })
                        }
                    </React.Fragment>
               })}

                <div className="wy-pager" ref={loadMoreRef}>
                        {isFetchingNextPage
                            ? 'Loading more...'
                            : hasNextPage
                                ? loadMoreButton
                                : ""}
                </div>
            </div>
            <PreviewFiles appId={appId} infiniteFiles={infiniteFiles} previewId={currentPreview} onClose={onClosePreview} features={features} appFeatures={appFeatures}/>
            </>
        );
    }

    const headers: ({ by: FileOrderBy | undefined, title: string  })[] = [
        { by: "name", title: "Name" },
        { by: "modified_at", title: "Modified" },
        { by: undefined, title: "Kind" },
        { by: "size", title: "Size" }
    ]

    return (
        <>
        <table className="wy-table wy-table-hover wy-table-files">
                <thead>
                <tr>
                    <th className="wy-table-cell-icon"></th>
                    {headers.map((header) => {
                        let active = header.by === order?.by;
                        let onHeaderClick = (e: any) => {
                            e.preventDefault();
                            header.by && onSorting && onSorting({ by: header.by, descending: active && !order?.descending });
                        }
                        return <th key={"files-header" + header.title}>{header.by ?
                            <div className={"wy-table-sort-link"} onClick={onHeaderClick}>{header.title} {active && <Icon.UI name={order?.descending ? "menu-down" : "menu-up"} />}</div>
                        :
                            <>{header.title}</>
                        }</th>
                    })}
                    <th className="wy-table-cell-icon"></th>
                </tr>
                </thead>
            <tbody>
                {data && data.pages && data.pages.map((group: any, i: number) => {
                    return <React.Fragment key={i}>
                        {
                            group.data?.map((file: FileType) => {

                                return <FileItem.Row
                                    key={'file-row' + file.id}
                                    file={file}
                                    onClick={(e: any) => !file.is_trashed && openPreview(file.id)}
                                    onRename={(name: string) => mutateFileRename.mutateAsync({ file: file, name: name})}
                                    onSubscribe={(file: FileType) => mutateFileSubscribe.mutateAsync({ file: file })}
                                    onUnsubscribe={(file: FileType) => mutateFileUnsubscribe.mutateAsync({ file: file })}
                                    onTrash={(file: FileType) => mutateFileTrash.mutateAsync({ file: file })}
                                    onRestore={(file: FileType) => mutateFileRestore.mutateAsync({ file: file })}
                                    onDeleteForever={(file: FileType) => mutateFileDeleteForever.mutateAsync({ file: file })}
                                    onHandleError={onHandleError}
                                    features={features}
                                    appFeatures={appFeatures}
                                />
                            })
                        }
                    </React.Fragment>
               })}


                <tr className="wy-pager" ref={loadMoreRef}>
                    <td colSpan={6}>
                        {isFetchingNextPage
                            ? 'Loading more...'
                            : hasNextPage
                                ? loadMoreButton
                                : ""}
                    </td>
                </tr>
    
            </tbody>
        </table>
        <PreviewFiles appId={appId} infiniteFiles={infiniteFiles} previewId={currentPreview} onClose={onClosePreview} features={features} appFeatures={appFeatures}/>
        </>
     )
}

export default FileList;