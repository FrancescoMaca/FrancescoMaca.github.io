'use client'

import { useSelector } from "react-redux";
import { RootState } from "../redux";
import { getResizeHandleElement, Panel, PanelResizeHandle } from "react-resizable-panels";
import FileExplorerTab from "./file-explorer";
import SourceControlTab from "./source-control";
import ExtensionTab from "./extensions";
import RunAndDebugTab from "./run-and-debug";
import { useEffect } from "react";

export function ActiveTabComponent() {
  const activeTab = useSelector((state: RootState) => state.toolbox.activeTab);

  useEffect(() => {

    const handle = getResizeHandleElement('resize-handle')
    const observer = new MutationObserver((_) => {
      const handleState = handle.getAttribute('data-resize-handle-state')
      if (handleState === 'inactive') {
        handle.classList.remove('!border-x-accent')
      }
      else {
        handle.classList.add('!border-x-accent')
      }
    })
    observer.observe(handle, { attributeFilter: ['data-resize-handle-state']});


    return () => {
      observer.disconnect()
    }
  }, [])
  const renderComponent = () => {
    switch (activeTab.text) {
      case 'Folders':
        return <FileExplorerTab />;
      case 'Source Control':
        return <SourceControlTab />;
      case 'Extensions':
        return <ExtensionTab />;
      case 'Run and Debug':
        return <RunAndDebugTab />;
        
      default:
        return <FileExplorerTab />;
    }
  }

  return (
    <>
      <Panel id="active-tab" minSize={0} maxSize={80} collapsedSize={0} className="">
        {
          renderComponent()
        }
      </Panel>
      <PanelResizeHandle id="resize-handle" className="hover:h-full !hover:cursor-col-resize border-x-2 border-l-dark border-r-border-panel transition-colors duration-300" />
    </>
  )
}