// src/types/markdown.ts

export interface TextChild {
    type: "text";
    text?: string;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    strikethrough?: boolean;
    code?: boolean;
}

export interface LinkChild {
    type: "link";
    url?: string;
    children?: MarkdownChild[];
}

export type MarkdownChild = TextChild | LinkChild;

export interface ParagraphNode {
    type: "paragraph";
    children?: MarkdownChild[];
}

export interface HeadingNode {
    type: "heading";
    level?: number;
    children?: MarkdownChild[];
}

export interface ListItemNode {
    children?: MarkdownChild[];
}

export interface ListNode {
    type: "list";
    format?: "ordered" | "unordered";
    children?: ListItemNode[];
}

export type MarkdownNode =
    | ParagraphNode
    | HeadingNode
    | ListNode;
