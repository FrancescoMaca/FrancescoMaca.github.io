'use client'

import SyntaxHighlighter from "react-syntax-highlighter/dist/esm/light-async";
import { contentHasPrettyOption, getEditorContent, PageContent } from "./page-content/content-handler";
import { CSSProperties, useCallback, useEffect, useRef, useState } from "react";
import { ToggleButton } from "../utils/toggle-button";
import React from 'react'
import { useDispatch } from "react-redux";
import { showNotification } from "../redux/slices/notification-slice";
import { extToIcon, generateUUID, getPageLanguage } from "../utils/helpers";
import { setPendingCommand } from "../redux/slices/console-commands-slice";
import { specificCmd } from "../console/commands/command-handler";
import { addTab } from "../redux/slices/editor-tab-slice";
import { finishLoading } from "../redux/slices/webpage-loading-slice";
import TextWithIcon from "../utils/icon-hover";
import UrlRenderer from "../utils/url-renderer";
import { getFilePath } from "../tabs/file-explorer/file-structure";
import { bake_cookie, read_cookie } from "sfcookies";
import { useSelector } from "react-redux";
import { RootState } from "../redux";
import Image from "next/image";
import { useWindowWidth } from "@react-hook/window-size";
import { setConsoleCollpased } from "../redux/slices/console-tab-slice";
import { InputRenderer } from "../utils/input-renderer";
import { sendEmail } from "../utils/emailer";

type ActionType = 'HOVER' | 'URL' | 'ACTION' | 'ERROR' | 'INPUT'
type ActionHandler = (args: string[]) => React.ReactNode

const actionHandlers: Record<ActionType, ActionHandler> = {
  ACTION: (args) => renderAction(args),
  URL: (args) => renderUrl(args),
  HOVER: (args) => renderHover(args),
  ERROR: (args) => renderError(args),
  INPUT: (args) => renderInput(args)
}

const actions: { [key: string]: () => Promise<void | undefined> } = { }

export default function TextEditor({ currentPage }: { currentPage: string }) {
  const [isPretty, setPretty] = useState<boolean>(false)
  const content: PageContent = getEditorContent(currentPage, isPretty)
  const duckRef = useRef<HTMLImageElement>(null)
  const theme = useSelector((state: RootState) => state.ideControls.theme)
  const dispatch = useDispatch()
  const width = useWindowWidth()

  const handleCommandClick = useCallback(async () => {
    // The duck is unavailable so just execute command
    if (!duckRef.current) {
      dispatch(setConsoleCollpased(false))
      dispatch(setPendingCommand(specificCmd[1].command))
      return
    }

    // Was the animation already ran??
    if (!read_cookie('duck-played')) {
      dispatch(setPendingCommand(specificCmd[1].command))
    }
    else {
      duckRef.current.classList.remove('hidden')
      duckRef.current.classList.add('animate-fly-duck')

      bake_cookie('duck-played', '')
      // If the duck exist tho, its different,  Make it fly
      dispatch(showNotification({
        id: generateUUID(),
        title: 'U.F.O Detected',
        body: 'A duck process keeps running in the background burning valuable processing power. Do you want to kill the process?',
        actionButton: 'No, I got 64gb RAM',
        actionButtonCb: 'spareDuck',
        secondaryButton: 'Kill Duck',
        secondaryButtonCb: 'killDuck',
        type: 'warning',
      }))
    }
  }, [dispatch, duckRef])

  const handleOpenImage = useCallback(async () => {
    dispatch(addTab('francesco-macaluso.png'))
  }, [dispatch])

  const handleSeeMore = useCallback(async () => {
    dispatch(addTab('project-page.tsx'))
  }, [dispatch])

  const handleSendMessage = useCallback(async () => {
    const email = document.getElementById('email_autogen') as HTMLInputElement
    const title = document.getElementById('title_autogen') as HTMLInputElement
    const msg = document.getElementById('message_autogen') as HTMLInputElement

    if (!email || !title || !msg) {
      return
    }

    let notificationTitle = ''
    let notificationMessage = ''

    if (!RegExp(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/).test(email.value)) {
      notificationTitle = 'Email not valid :('
      notificationMessage = 'The given email is not valid, make sure it test positive for this:\n`/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/`'
    }
    else {
      notificationTitle = 'Message Sent'
      notificationMessage = 'The message was sent to Franky! Thank you :)'
      
      await sendEmail(title.value, email.value, msg.value)
      
      title.value = ''
      title.size = title.placeholder.length
      email.value = ''
      email.size = email.placeholder.length
      msg.value = ''
      msg.size = msg.placeholder.length
    }

    dispatch(showNotification({
      id: generateUUID(),
      title: notificationTitle,
      body: notificationMessage,
      actionButton: 'Good to know',
      actionButtonCb: '',
      secondaryButton: '',
      secondaryButtonCb: '',
      type: notificationTitle.startsWith('Email') ? 'error' : 'info',
      timeout: notificationTitle.startsWith('Email') ? undefined : 3000
    }))
  }, [dispatch])
  
  useEffect(() => {
    actions['openProfileImage'] = handleOpenImage
    actions['runSecretCommand'] = handleCommandClick
    actions['seeMore'] = handleSeeMore
    actions['sendMessage'] = handleSendMessage
  }, [handleOpenImage, handleCommandClick, handleSeeMore, handleSendMessage])

  // Removes the loading screen once everything is gone
  useEffect(() => {
    dispatch(finishLoading());
  }, [dispatch]);

  return (
    <div className="relative flex w-full h-full flex-col bg-editor text-white font-mono text-xs md:text-sm overflow-hidden">
      {
        currentPage === 'page.tsx' &&
        <Image ref={duckRef} src="/pictures/duck.png" alt="A duck?" title="Duck" width={350} height={350}
          className="absolute bottom-0 -right-[50%] scale-50 select-disable rotate-[30deg] z-40 hidden"
        />
      }
      {
        contentHasPrettyOption(currentPage) &&
        <div className="absolute top-4 right-3 p-2 z-10 bg-editor rounded-md border-editor border">
          <ToggleButton onChange={() => setPretty(!isPretty)} label={`${width > 768 ? 'Fellow Developer Mode' : 'F.D.M'}`} />
        </div>
      }
      <div className="flex-grow overflow-auto px-[10px]">
        <div className='h-full'>
          <div className="flex pl-3 pt-1 pb-0.5 select-disable">
            {
              getFilePath(currentPage).map(dir => (
                <span className="flex" key={Math.random()}>
                  <span className="rounded-md px-1 text-text-unfocused hover:text-text-normal">{dir}</span>
                  <Image src="/svg/ide/chevron-right.svg" alt=">" title="" width={20} height={20} />
                </span>
              ))
            }
            <span className="flex gap-1">
              <Image src={`svg/files/file_type_${extToIcon(currentPage)}.svg`} alt="File Icon" width={16} height={16} title=""
                style={{ width: 'auto', height: '16px' }}
              />
              <span className="rounded-md px-1 text-text-unfocused hover:text-text-normal">{currentPage}</span>
            </span>
          </div>
          {
            (!isPretty || !contentHasPrettyOption(currentPage)) &&
            <SyntaxHighlighter
              customStyle={editorStyle}
              lineNumberStyle={lineNumberStyle}
              language={content.content.includes('404') ? 'typescript' : getPageLanguage(currentPage)}
              style={theme}
              showLineNumbers={true}
              PreTag={CustomPreComponent}
            >
              {content.content}
            </SyntaxHighlighter>
          }
          {
            isPretty &&
            <SyntaxHighlighter
              customStyle={editorStyle}
              lineNumberStyle={lineNumberStyle}
              language={content.content.includes('404') ? 'typescript' : getPageLanguage(currentPage)}
              style={theme}
              showLineNumbers={true}
              PreTag={CustomPreComponent}
            >
              {/* This content must exist otherwise the other contentHasPrettyOption condition is going to catch it */}
              {content.prettyContent!}
            </SyntaxHighlighter>
          }
        </div>
      </div>
    </div>
  );
}


const editorStyle: CSSProperties = {
  width: '100%',
  height: '100%',
  backgroundColor: '#1E1E1E',
  color: '#cccccc',
  WebkitUserSelect: 'none',
  MozUserSelect: 'none',
  userSelect: 'none',
}

const lineNumberStyle: CSSProperties = {
  textAlign: 'right',
  color: '#717680'
}

function CustomPreComponent({ children }: { children: React.ReactNode }) {
  if (!(children as any).props) {
    return <span>Cannot load editor</span>
  }
  
  const content: any[] = (children as any).props.children[1];
  
  const updatedContent = content.map((code) => {
    if (!code.props || typeof code.props.children[0] !== 'string') {
      return code;
    }

    const newChildren = code.props.children[0].split(/(\[\[.*?\]\])/g).map((part: string) => {
      const actionMatch = part.match(/\[\[([\w]+):(.+?)\]\]/);
      
      if (actionMatch) {
        const actionType = actionMatch[1] as ActionType
        let actionArgs: string[] = []
        // If the action is an error, there are no arguments, just a big string
        if (actionType === 'ERROR') {
          actionArgs = [ actionMatch[2] ]
        }
        else {
          actionArgs = actionMatch[2].split(',').map(s => s.trim())
        }
                
        if (actionType in actionHandlers) {
          return actionHandlers[actionType](actionArgs)
        }
      }
      return part;
    });

    return {
      ...code,
      props: {
        ...code.props,
        children: newChildren
      }
    };
  });
  
  return (
    <span className="select-disable">
      {updateObject(children, updatedContent)}
    </span>
  )
}

function updateObject(originalObject: any, newChildContent: any) {
  return {
    ...originalObject,
    props: {
      ...originalObject.props,
      children: [
        originalObject.props.children[0],
        newChildContent,
        ...(originalObject.props.children.slice(2) || [])
      ]
    }
  };
}

function renderAction(args: string[]) {
  return (
    <span key={Math.random()}
      onClick={actions[args[1]]}
      className="hover:underline hover:text-accent cursor-pointer"
    >
      {args[0]}
    </span>
  )
}

function renderHover(args: string[]) {
  return <TextWithIcon key={Math.random()} label={args[0]} icon={!!args[1] ? `/svg/other/${args[1]}.svg` : undefined}/>
}

function renderUrl(args: string[]) {
  return <UrlRenderer key={Math.random()} label={args[0]} url={args[1]}/>
}

function renderError(args: string[]) {
  return (
    <span className="relative overflow-hidden border-b-[1px] border-dashed border-text-error" key={Math.random()}>
      { args[0] }
    </span>
  )
}

function renderInput(args: string[]) {
  return <InputRenderer key={Math.random()} placeholder={args[0]} id={args[1]} />
}