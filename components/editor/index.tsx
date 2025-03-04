'use client'
import React, { MouseEvent, useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Panel } from "react-resizable-panels";
import { getRandomFunnyFileName } from './page-content/new-tab-names';
import Tab from './tab';
import DefaultPage from './page-content/default-page';
import HighlightHandler from '../utils/highlight-panel-handler';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { RootState } from '../redux';
import { addTab, closeTab, setActiveTab } from '../redux/slices/editor-tab-slice';
import ContextMenu from '../context-menu';
import { showNotification } from '../redux/slices/notification-slice';
import { generateUUID } from '../utils/helpers';
import { bake_cookie, read_cookie } from 'sfcookies';
import { EditorLoadingState } from './text-editor-loading';

const DynamicTextEditor = dynamic(() => import('./text-editor'), { loading: () => <EditorLoadingState />, ssr: false });
const ImageViewer = dynamic(() => import('./page-content/image-viewer'), { loading: () => <EditorLoadingState />, ssr: false });
const MarkdownEditor = dynamic(() => import('./page-content/md-viewer'), { loading: () => <EditorLoadingState />, ssr: false });
const PdfViewer = dynamic(() => import('./page-content/pdf-viewer'), { loading: () => <EditorLoadingState />, ssr: false });

export default function Editor() {
  const dispatch = useDispatch()
  const { tabs, activeTabIndex } = useSelector((state: RootState) => state.tabs)
  const [clickTimeout, setClickTimeout] = useState<NodeJS.Timeout | null>(null);
  const [contextMenu, setContextMenu] = useState<{x: number, y: number} | null>(null);

  useEffect(() => {
    const handleOutsideClick = () => setContextMenu(null);
    if (contextMenu) {
      document.addEventListener('click', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [contextMenu]);
  
  useEffect(() => {
    if (read_cookie('help-tooltip')) {
      bake_cookie('help-tooltip', '')

      dispatch(showNotification({
        id: generateUUID(),
        title: 'Some useful tips',
        body: 'You can interact with some lines of code by hovering and clicking on them! Feel free to also navigate as if it was your IDE :0',
        type: 'info',
        actionButton: 'Thanks',
        actionButtonCb: '',
        secondaryButton: 'I don\'t care',
        secondaryButtonCb: 'openSorryDialog'
      }))
    }
  }, [dispatch])

  const handleDoubleClick = () => {
    dispatch(addTab(getRandomFunnyFileName()))
  };

  const handleCloseTab = (name: string) => {
    dispatch(closeTab(name))
  };

  const handleClick = (e: MouseEvent) => {
    if (e.target instanceof HTMLDivElement) {
      if (clickTimeout) {
        clearTimeout(clickTimeout);
        setClickTimeout(null);
        handleDoubleClick();
      } else {
        setClickTimeout(
          setTimeout(() => {
            setClickTimeout(null);
          }, 200)
        );
      }
    }
  };

  const handleContextMenu = useCallback((e: MouseEvent) => {
    e.preventDefault();
    setContextMenu(
      contextMenu === null ? { x: e.pageX, y: e.pageY } : null,
    );
  }, [contextMenu]);
  
  return (
    <>
      <Panel className="flex flex-col" minSize={30} defaultSize={80}>
        {
          tabs.length > 0 ?
          <div className="flex items-center pr-10 text-text-unfocused overflow-y-hidden overflow-x-auto"
            onClick={handleClick}
            onContextMenu={handleContextMenu}
          >
            {tabs.map((tab, i) => (
              <Tab
                key={i}
                name={tab}
                isActive={i === activeTabIndex}
                onClick={() => dispatch(setActiveTab(i))}
                onClose={handleCloseTab}
              />
            ))}
            {
              contextMenu && (
                <ContextMenu
                  x={contextMenu.x}
                  y={contextMenu.y}
                  onClose={() => setContextMenu(null)}
                  tabName={tabs[activeTabIndex]}
                />
              )
            }
          </div> : <></>
        }
        {
          displayFile(tabs[activeTabIndex])
        }
      </Panel>
      <HighlightHandler horizontal />
    </>
  );
}

function displayFile(file?: string) {

  if (!file) {
    return <DefaultPage />
  }

  const editor: { [key: string]: any } = {
    'png': <ImageViewer name={file} />,
    'md': <MarkdownEditor name={file}/>,
    'pdf': <PdfViewer name={file} />
  }

  const ext: string = file.split('.').pop() || ''

  return (
    <div className='h-full overflow-y-auto'>
      { editor[ext] ?? <DynamicTextEditor currentPage={file} /> }
    </div>
  )
}