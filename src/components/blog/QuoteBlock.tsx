import React from "react";

interface QuoteBlockProps {
    block: {
        title: Array<{
            type: string;
            children: Array<{
                type: string;
                text: string;
            }>;
        }>;
    };
}

const QuoteBlock: React.FC<QuoteBlockProps> = ({ block }) => {
    const extractText = (content: any[]) => {
        if (!Array.isArray(content)) return '';
        return content
            .map(node =>
                node.children?.map((child: any) => child.text).join('') || ''
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