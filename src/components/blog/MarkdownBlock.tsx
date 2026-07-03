import React, { JSX } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import type {
    MarkdownNode,
    MarkdownChild,
    ListItemNode,
} from "./types/markdown";

interface MarkdownBlockProps {
    block: {
        body: MarkdownNode[];
    };
    codeBlockColors?: {
        background: string;
        text: string;
    };
}

const getPlainText = (children: MarkdownChild[]): string => {
    return children
        .map((child) => {
            if (child.type === "text") return child.text || "";
            if (child.type === "link") return getPlainText(child.children || []);
            return "";
        })
        .join("");
};

const MarkdownBlock: React.FC<MarkdownBlockProps> = ({ block, codeBlockColors }) => {
    const renderChildren = (children: MarkdownChild[]) => {
        return children.map((child: MarkdownChild, index: number) => {
            if (child.type === "text") {
                let text: JSX.Element | string = child.text || "";


                if (child.bold) text = <strong key={index}>{text}</strong>;
                if (child.italic) text = <em key={index}>{text}</em>;
                if (child.underline) text = <u key={index}>{text}</u>;
                if (child.strikethrough) text = <s key={index}>{text}</s>;
                if (child.code) {
                    text = (
                        <code
                            key={index}
                            className="px-1 rounded"
                            style={codeBlockColors ? { backgroundColor: codeBlockColors.background, color: codeBlockColors.text } : undefined}
                        >
                            {text}
                        </code>
                    );
                }

                return <React.Fragment key={index}>{text}</React.Fragment>;
            } else if (child.type === "link") {
                const linkText = renderChildren(child.children || []);
                return (
                    <a key={index} href={child.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                        {linkText}
                    </a>
                );
            }
            return null;
        });
    };

    const renderNode = (node: MarkdownNode, index: number) => {
        switch (node.type) {
            case "paragraph":
                return <p key={index} className="mb-4 text-sm">{renderChildren(node.children || [])}</p>;

            case "heading": {
                const level = Math.min(Math.max(node.level || 2, 1), 6);
                const Tag = `h${level}` as keyof JSX.IntrinsicElements;
                const sizeByLevel: Record<number, string> = {
                    1: "text-4xl",
                    2: "text-3xl",
                    3: "text-2xl",
                    4: "text-xl",
                    5: "text-lg",
                    6: "text-base",
                };
                return <Tag key={index} className={`font-bold mb-2 mt-4 ${sizeByLevel[level]}`}>{renderChildren(node.children || [])}</Tag>;
            }

            case "list":
                const ListTag = node.format === "ordered" ? "ol" : "ul";
                return (
                    <ListTag key={index} className={node.format === "ordered" ? "list-decimal ml-6 mb-4 text-sm" : "list-disc ml-6 mb-4 text-sm"}>
                        {node.children?.map((item: ListItemNode, i: number) => (
                            <li key={i}>{renderChildren(item.children || [])}</li>
                        ))}
                    </ListTag>
                );

            case "code":
                return (
                    <SyntaxHighlighter
                        key={index}
                        language={node.language || "text"}
                        style={oneDark}
                        customStyle={{
                            marginBottom: "1rem",
                            borderRadius: "0.375rem",
                            ...(codeBlockColors && {
                                backgroundColor: codeBlockColors.background,
                                color: codeBlockColors.text,
                            }),
                        }}
                        codeTagProps={codeBlockColors ? { style: { color: codeBlockColors.text } } : undefined}
                        className="text-sm"
                    >
                        {getPlainText(node.children || [])}
                    </SyntaxHighlighter>
                );

            default:
                return null;
        }
    };

    return <div className="max-w-none">{block.body?.map(renderNode)}</div>;
};

export default MarkdownBlock;