import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

declare module "monaco-vim" {
  export interface EditorVimMode {
    dispose: () => void;
  }

  type initVimMode = (
    editor: monaco.editor.IStandaloneCodeEditor,
    statusElm: HTMLElement
  ) => EditorVimMode;

  const initVimMode: initVimMode;

  const VimMode: {
    Vim: {
      noremap: (from: string, to: string) => void;
      map: (from: string, to: string, mode: string) => void;
    };
  };
}