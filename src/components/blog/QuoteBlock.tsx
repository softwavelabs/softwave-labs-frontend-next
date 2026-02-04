import React from "react";
import type { QuoteNode } from "@/components/blog/types/quote";
interface QuoteChild {
    type: string;
    text: string;
}
interface QuoteBlockProps {
    block: {
        title: QuoteNode[];
    };
}

const QuoteBlock: React.FC<QuoteBlockProps> = ({ block }) => {
    const extractText = (content: QuoteNode[]) => {
        if (!Array.isArray(content)) return '';
        return content
            .map(node =>
                node.children?.map((child: QuoteChild) => child.text).join('') || ''
            )
            .join(' ');
    };

    return (
        <blockquote className="border-l-4 border-gray-400 pl-4 py-2 italic text-gray-700 my-4">
            {extractText(block.title)}
        </blockquote>
    );
};

export default QuoteBlock;