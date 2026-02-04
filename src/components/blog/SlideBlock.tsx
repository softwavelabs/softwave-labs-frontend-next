import React from "react";
import Image from "next/image";
import type { FileData } from "@/components/blog/types/files";

interface SliderBlockProps {
    block: {
        files?: {
            data?: FileData[];
        };
    };
    api_url: string;
}

const SliderBlock: React.FC<SliderBlockProps> = ({ block, api_url }) => {
    if (!block.files?.data || block.files.data.length === 0) {
        return <p className="text-gray-500 italic">No images in slider</p>;
    }

    return (
        <div className="slider-container overflow-x-auto snap-x snap-mandatory flex gap-4 py-4">
            {block.files.data.map((file: FileData, index: number) => {
                const url = file.attributes?.url ? api_url + file.attributes.url : "";
                if (!url) return null;
                return (
                    <div key={index} className="flex-shrink-0 snap-center relative">
                        <Image
                            src={url}
                            alt={file.attributes?.alternativeText || `Slide ${index + 1}`}
                            width={400}
                            height={256}
                            className="h-64 object-cover rounded-lg"
                        />
                        {file.attributes?.caption && (
                            <p className="absolute bottom-2 left-2 text-white bg-black bg-opacity-50 px-2 py-1 rounded text-sm">
                                {file.attributes.caption}
                            </p>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default SliderBlock;