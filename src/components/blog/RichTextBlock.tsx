import React, { useMemo } from "react";

interface RichTextBlockProps {
    block: {
        body: Array<any>;
    };
}

const RichTextBlock: React.FC<RichTextBlockProps> = ({ block }) => {

    const convertChildrenToHtml = (children: Array<any>): string => {
        return children
            .map((child) => {
                if (child.type === "text") {
                    let text = child.text || "";
                    if (child.bold) text = `<strong>${text}</strong>`;
                    if (child.italic) text = `<em>${text}</em>`;
                    if (child.underline) text = `<u>${text}</u>`;
                    if (child.strikethrough) text = `<s>${text}</s>`;
                    return text;
                } else if (child.type === "link") {
                    const url = child.url || "#";
                    const linkText = convertChildrenToHtml(child.children || []);
                    return `<a href="${url}" target="_blank" rel="noopener noreferrer">${linkText}</a>`;
                } else {
                    return "";
                }
            })
            .join("");
    };

    const renderedHtml = useMemo(() => {
        if (!block.body || !Array.isArray(block.body)) return "<p>No content</p>";

        return block.body
            .map((b) => {
                switch (b.type) {
                    case "paragraph":
                        return `<p>${convertChildrenToHtml(b.children || [])}</p>`;
                    case "heading":
                        const level = Math.min(Math.max(b.level || 1, 1), 6);
                        return `<h${level}>${convertChildrenToHtml(b.children || [])}</h${level}>`;
                    case "list":
                        const tag = b.format === "ordered" ? "ol" : "ul";
                        const items = (b.children || [])
                            .map((item: any) => `<li>${convertChildrenToHtml(item.children || [])}</li>`)
                            .join("");
                        return `<${tag}>${items}</${tag}>`;
                    default:
                        return "";
                }
            })
            .join("");
    }, [block]);

    return <div dangerouslySetInnerHTML={{ __html: renderedHtml }} />;
};

export default RichTextBlock;
