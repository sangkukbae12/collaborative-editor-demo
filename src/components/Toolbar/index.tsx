import { FC, SetStateAction, useEffect, useRef, useState } from 'react';
import { Checkbox, Container, createStyles, Kbd, NumberInput, Select, Tooltip } from '@mantine/core';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { EditorVimMode, initVimMode } from 'monaco-vim';
import { useHotkeys } from '@mantine/hooks';

const themeList = [
  { value: 'vs-dark', label: 'VS Dark' },
  { value: 'dracula', label: 'Dracula' },
  { value: 'monokai', label: 'Monokai' },
  { value: 'nightOwl', label: 'Night Owl' },
  { value: 'oceanicNext', label: 'Oceanic Next' },
  { value: 'pastelsOnDark', label: 'Pastel On Dark' },
  { value: 'spaceCadet', label: 'Space Cadet' },
  { value: 'tomorrowNightBlue', label: 'Tomorrow Night Blue' },
];

const useStyles = createStyles(() => ({
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
}));

type props = {
  editor: monaco.editor.IStandaloneCodeEditor | null,
  statusbarRef: React.MutableRefObject<HTMLDivElement | null>;
};

const Toolbar: FC<props> = ({ editor, statusbarRef }) => {
  const [theme, setTheme] = useState('vs-dark');
  const [miniMapOn, setMiniMapOn] = useState(true);
  const [vimModeOn, setVimModeOn] = useState(false);
  const [fontSize, setFontSize] = useState(18);
  const { classes } = useStyles();
  let vimMode = useRef<EditorVimMode>(null);

  useHotkeys([
    ['ctrl+m', () => setMiniMapOn(prev => !prev)],
    ['ctrl+shift+v', () => setVimModeOn(prev => !prev)]
  ]);

  useEffect(() => {
    return () => vimMode.current?.dispose();
  });

  useEffect(() => {
    if (theme === 'vs-dark') {
      monaco.editor.setTheme(theme);
    } else {
      let temp;
      switch (theme) {
        case 'dracula':
          temp = import('monaco-themes/themes/Dracula.json');
          break;
        case 'monokai':
          temp = import('monaco-themes/themes/Monokai.json');
          break;
        case 'nightOwl':
          temp = import('monaco-themes/themes/Night Owl.json');
          break;
        case 'oceanicNext':
          temp = import('monaco-themes/themes/Oceanic Next.json');
          break;
        case 'tomorrowNightBlue':
          temp = import('monaco-themes/themes/Tomorrow-Night-Blue.json');
          break;
        case 'spaceCadet':
          temp = import('monaco-themes/themes/SpaceCadet.json');
          break;
        case 'pastelsOnDark':
          temp = import('monaco-themes/themes/Pastels on Dark.json');
          break;
        default:
          break;
      }
      temp?.then(themeData => {
        monaco.editor.defineTheme(theme, themeData as monaco.editor.IStandaloneThemeData);
        monaco.editor.setTheme(theme);
      });
    }
  }, [theme]);

  useEffect(() => {
    editor?.updateOptions({
      minimap: {
        enabled: miniMapOn
      }
    });
  }, [miniMapOn]);

  useEffect(() => {
    if (vimModeOn) {
      // @ts-ignore
      vimMode.current = initVimMode(editor!, statusbarRef.current!);
    } else {
      vimMode.current?.dispose();
    }

    editor?.focus();
  }, [vimModeOn]);

  useEffect(() => {
    editor?.updateOptions({ fontSize });
  }, [fontSize]);

  return (
    <>
      <Container size='md' m='md' className={ classes.toolbar }>
        <Tooltip label='Theme' withArrow >
          <Select value={ theme } data={ themeList } onChange={ val => setTheme(val as SetStateAction<string>) } placeholder='Select theme' />
        </Tooltip>
        <Tooltip label='Font Size' withArrow >
          <NumberInput value={ fontSize } onChange={ val => setFontSize(val as SetStateAction<number>) } placeholder='font size' />
        </Tooltip>
        <Tooltip label='Ctrl+m' withArrow >
          <Checkbox label='Minimap' checked={ miniMapOn } onChange={ e => setMiniMapOn(e.currentTarget.checked) } />
        </Tooltip>
        <Tooltip label='Ctrl+Shift+v' withArrow>
          <Checkbox label='Vim' checked={ vimModeOn } onChange={ e => setVimModeOn(e.currentTarget.checked) } />
        </Tooltip>
      </Container>
    </>
  );
};

export default Toolbar;