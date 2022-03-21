import React from 'react';
import { BaseElement } from 'slate';
import { RenderElementProps } from 'slate-react';
import Image from 'next/image';

export enum CustomElementType {
  blockQuote = 'block-quote',
  bulletedList = 'bulleted-list',
  headingOne = 'heading-one',
  headingTwo = 'heading-two',
  headingThree = 'heading-three',
  headingFour = 'heading-four',
  headingFive = 'heading-five',
  headingSix = 'heading-six',
  listItem = 'list-item',
  numberedList = 'numbered-list',
  paragraph = 'paragraph',
  image = 'image',
  link = 'link',
  code = 'code',
}

export interface CustomElement extends BaseElement {
  type: CustomElementType;
  [x: string]: unknown;
}

export const CustomElement: React.FC<RenderElementProps> = ({
  attributes,
  children,
  element,
}) => {
  switch (element.type) {
    case CustomElementType.blockQuote:
      return <blockquote {...attributes}>{children}</blockquote>;
    case CustomElementType.bulletedList:
      return <ul {...attributes}>{children}</ul>;
    case CustomElementType.code:
      return (
        <pre>
          <code {...attributes}>{children}</code>
        </pre>
      );
    case CustomElementType.headingOne:
      return <h1 {...attributes}>{children}</h1>;
    case CustomElementType.headingTwo:
      return <h2 {...attributes}>{children}</h2>;
    case CustomElementType.headingThree:
      return <h3 {...attributes}>{children}</h3>;
    case CustomElementType.headingFour:
      return <h4 {...attributes}>{children}</h4>;
    case CustomElementType.headingFive:
      return <h5 {...attributes}>{children}</h5>;
    case CustomElementType.headingSix:
      return <h6 {...attributes}>{children}</h6>;
    case CustomElementType.link:
      return (
        <a href={element.url as string} {...attributes}>
          {children}
        </a>
      );
    case CustomElementType.image:
      return <Image src={element.url as string} {...attributes} />;
    case CustomElementType.listItem:
      return <li {...attributes}>{children}</li>;
    case CustomElementType.numberedList:
      return <ol {...attributes}>{children}</ol>;
    default:
      return <p {...attributes}>{children}</p>;
  }
};
