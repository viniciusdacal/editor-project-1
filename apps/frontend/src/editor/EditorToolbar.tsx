import React, { MouseEventHandler } from 'react'
import { useSlate } from 'slate-react'
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { toggleBlock, toggleMark, isBlockActive, isMarkActive } from './helpers'
import { CustomElementType } from './CustomElement'
import { CustomText } from './CustomLeaf'
import { FormatBold, FormatItalic, FormatUnderlined, Code, FormatListNumbered, FormatListBulleted, FormatQuote } from '@mui/icons-material';

const iconMap: Record<string, React.FC> = {
  bold: FormatBold,
  italic: FormatItalic,
  underlined: FormatUnderlined,
  code: Code,
  list_numbered: FormatListNumbered,
  list_bulleted: FormatListBulleted,
  quote: FormatQuote,
}

const Icon: React.FC<{ name: string }> = ({ name }) => {
  const Component = iconMap[name];

  if (!Component) {
    return <span>{name}</span>;
  }

  return  <Component />
}

interface BlockButtonProps {
  format: CustomElementType
  icon: string
}

const BlockButton: React.FC<BlockButtonProps> = ({ format, icon }) => {
  const editor = useSlate()
  return (
    <Button
      variant={isBlockActive(editor, format) ? 'contained' : 'outlined'}
      onMouseDown={(event) => {
        event.preventDefault()
        toggleBlock(editor, format)
      }}
    >
      <Icon name={icon} />
    </Button>
  )
}

interface MarkButtonProps {
  format: keyof CustomText
  icon: string
}


const MarkButton: React.FC<MarkButtonProps> = ({ format, icon }) => {
  const editor = useSlate();
  return (
    <Button
      variant={isMarkActive(editor, format) ? 'contained' : 'outlined'}
      onMouseDown={(event) => {
        event.preventDefault()
        toggleMark(editor, format)
      }}
    >
      <Icon name={icon} />
    </Button>
  );
}

export const EditorToolbar: React.FC = () => {
  return (
    <div>
      <Stack spacing={3} direction="row">
        <Stack spacing={1} direction="row">
          <MarkButton format="bold" icon="bold" />
          <MarkButton format="italic" icon="italic" />
          <MarkButton format="underline" icon="underlined" />
          <MarkButton format="code" icon="code" />
        </Stack>
        <Stack spacing={1} direction="row">
          <BlockButton format={CustomElementType.headingOne} icon="h1" />
          <BlockButton format={CustomElementType.headingTwo} icon="h2" />
          <BlockButton format={CustomElementType.blockQuote} icon="quote" />
          <BlockButton format={CustomElementType.numberedList} icon="list_numbered" />
          <BlockButton format={CustomElementType.bulletedList} icon="list_bulleted" />
        </Stack>
      </Stack>
    </div>
  )
}