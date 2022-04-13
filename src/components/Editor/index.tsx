import { useEffect, useRef, useState, VFC } from 'react';
import { createStyles } from '@mantine/core';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
// @ts-ignore
import { MonacoBinding } from 'y-monaco';
import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';
import { EDITOR_OPTIONS, WEBSOCKET } from '../../utils/constants';
import Toolbar from '../Toolbar';


const useStyles = createStyles(() => ({
  editor: {
    minHeight: '80vh'
  },
}));

const Editor: VFC = () => {
  const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor | null>(null);
  const editorRef = useRef(null);
  const statusbarRef = useRef(null);
  const { classes } = useStyles();

  useEffect(() => {
    const editor = monaco.editor.create(editorRef.current!, {
      value: EDITOR_OPTIONS.VALUE,
      language: EDITOR_OPTIONS.LANGUAGE,
      theme: EDITOR_OPTIONS.THEME,
      fontSize: EDITOR_OPTIONS.FONT_SIZE,
      automaticLayout: true
    });

    setEditor(editor);

    const ydoc = new Y.Doc();
    const provider = new WebsocketProvider(WEBSOCKET.URL, WEBSOCKET.ROOM, ydoc);
    const ytext = ydoc.getText('monaco');

    const monacoBinding = new MonacoBinding(ytext, editor.getModel(), new Set([editor]), provider.awareness);

    editor.focus();

    return () => {
      editor.dispose();
    };
  }, []);

  return (
    <>
      <Toolbar editor={ editor } statusbarRef={ statusbarRef } />
      <div className={ classes.editor } ref={ editorRef } />
      <div ref={ statusbarRef } />
    </>
  );
};

export default Editor;
