import React, { JSX } from "react";

interface MarkdownBlockProps {
    block: {
        body: Array<any>;
    };
}

const MarkdownBlock: React.FC<MarkdownBlockProps> = ({ block }) => {
    const renderChildren = (children: any[]) => {
        return children.map((child: any, index: number) => {
            if (child.type === "text") {
                let text: JSX.Element | string = child.text;

                if (child.bold) text = <strong key={index}>{text}</strong>;
                if (child.italic) text = <em key={index}>{text}</em>;
                if (child.underline) text = <u key={index}>{text}</u>;
                if (child.strikethrough) text = <s key={index}>{text}</s>;
                if (child.code) text = <code key={index} className="bg-gray-100 px-1 rounded">{text}</code>;

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

    const renderNode = (node: any, index: number) => {
        switch (node.type) {
            case "paragraph":
                return <p key={index} className="mb-4">{renderChildren(node.children || [])}</p>;

            case "heading":
                const level = Math.min(Math.max(node.level || 2, 1), 6);
                const Tag = `h${level}` as keyof JSX.IntrinsicElements;
                console.log(level)
                console.log(Tag)
                return <Tag key={index} className={`font-bold mb-2 mt-4 text-4xl`}>{renderChildren(node.children || [])}</Tag>;

            case "list":
                const ListTag = node.format === "ordered" ? "ol" : "ul";
                return (
                    <ListTag key={index} className={node.format === "ordered" ? "list-decimal ml-6 mb-4" : "list-disc ml-6 mb-4"}>
                        {node.children?.map((item: any, i: number) => (
                            <li key={i}>{renderChildren(item.children || [])}</li>
                        ))}
                    </ListTag>
                );

            default:
                return null;
        }
    };

    return <div className="max-w-none">{block.body?.map(renderNode)}</div>;
};

export default MarkdownBlock;
