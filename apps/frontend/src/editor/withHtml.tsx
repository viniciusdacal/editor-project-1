import { Descendant, Editor, Transforms } from 'slate';
import { jsx } from 'slate-hyperscript';
import { CustomElement, CustomElementType } from './CustomElement';

const ELEMENT_TAGS: Record<
  string,
  (el?: HTMLElement) => Partial<CustomElement>
> = {
  A: (el) => ({ type: CustomElementType.link, url: el?.getAttribute('href') }),
  BLOCKQUOTE: () => ({ type: CustomElementType.blockQuote, children: [] }),
  H1: () => ({ type: CustomElementType.headingOne }),
  H2: () => ({ type: CustomElementType.headingTwo }),
  H3: () => ({ type: CustomElementType.headingThree }),
  H4: () => ({ type: CustomElementType.headingFour }),
  H5: () => ({ type: CustomElementType.headingFive }),
  H6: () => ({ type: CustomElementType.headingSix }),
  IMG: (el) => ({
    type: CustomElementType.image,
    url: el?.getAttribute('src'),
  }),
  LI: () => ({ type: CustomElementType.listItem }),
  OL: () => ({ type: CustomElementType.numberedList }),
  P: () => ({ type: CustomElementType.paragraph }),
  PRE: () => ({ type: CustomElementType.code }),
  UL: () => ({ type: CustomElementType.bulletedList }),
} as const;

const TEXT_TAGS = {
  CODE: () => ({ code: true }),
  DEL: () => ({ strikethrough: true }),
  EM: () => ({ italic: true }),
  I: () => ({ italic: true }),
  S: () => ({ strikethrough: true }),
  STRONG: () => ({ bold: true }),
  U: () => ({ underline: true }),
};

type ElementTagsNames = keyof typeof ELEMENT_TAGS;
type TextTagsNames = keyof typeof TEXT_TAGS;

export const deserialize = (el: ChildNode): any => {
  if (el.nodeType === 3) {
    return el.textContent;
  } else if (el.nodeType !== 1) {
    return null;
  } else if (el.nodeName === 'BR') {
    return '\n';
  }

  const { nodeName } = el;
  let parent: ChildNode = el;

  if (nodeName === 'PRE' && el.childNodes[0]?.nodeName === 'CODE') {
    parent = el.childNodes[0];
  }

  let children = Array.from(parent.childNodes).map(deserialize).flat();

  if (children.length === 0) {
    children = [{ text: '' }];
  }

  if (nodeName === 'BODY') {
    return jsx('fragment', {}, children);
  }

  if (nodeName === 'SPAN') {
    // google uses span to first title in some cases
    if (Number.parseInt((el as HTMLElement)?.style?.fontSize) >= 26) {
      return jsx('element', { type: CustomElementType.headingOne }, children);
    }
  }

  if (nodeName in ELEMENT_TAGS) {
    const attrs = ELEMENT_TAGS[nodeName as ElementTagsNames](el as HTMLElement);

    return jsx('element', attrs, children);
  }

  if (nodeName in TEXT_TAGS) {
    const attrs = TEXT_TAGS[nodeName as TextTagsNames]();
    return children.map((child) => jsx('text', attrs, child));
  }

  return children;
};

const withHtml = (editor: Editor): Editor => {
  const { insertData, isInline, isVoid } = editor;

  editor.isInline = (element: CustomElement) => {
    return element.type === 'link' ? true : isInline(element);
  };

  editor.isVoid = (element: CustomElement) => {
    return element.type === 'image' ? true : isVoid(element);
  };

  editor.insertData = (data) => {
    const html = data.getData('text/html');

    if (!html) {
      insertData(data);
      return;
    }
    const parsed = new DOMParser().parseFromString(html, 'text/html');
    const fragment = deserialize(parsed.body);
    try {
      Transforms.insertFragment(editor, fragment, { voids: false });
    } catch (error) {
      console.log('inserFragment error', error);
    }
  };

  return editor;
};

export default withHtml;
