import React from "react";

interface MediaItem {
    id: number;
    url: string;
    alternativeText?: string;
    mime?: string;
    caption?: string;
}

interface MediaBlockProps {
    block: {
        file?: MediaItem[];
    };
    api_url: string;
}

const MediaBlock: React.FC<MediaBlockProps> = ({ block, api_url }) => {
    const mediaItems = block.file || [];

    if (mediaItems.length === 0) {
        return <p className="text-gray-500 italic">No media available</p>;
    }

    return (
        <div className="grid gap-4 my-4">
            {mediaItems.map((item) => {
                const fullUrl = api_url + item.url;

                if (item.mime?.startsWith("image/")) {
                    return (
                        <figure key={item.id}>
                            <img
                                src={fullUrl}
                                alt={item.alternativeText || "Media"}
                                className="w-full h-auto rounded-lg"
                            />
                            {item.caption && (
                                <figcaption className="text-gray-500 text-sm mt-1 text-center">
                                    {item.caption}
                                </figcaption>
                            )}
                        </figure>
                    );
                }

                if (item.mime?.startsWith("video/")) {
                    return (
                        <video key={item.id} controls className="w-full rounded-lg">
                            <source src={fullUrl} type={item.mime} />
                            Your browser does not support the video tag.
                        </video>
                    );
                }

                return (
                    <p key={item.id} className="text-gray-500 italic">
                        Unsupported media type
                    </p>
                );
            })}
        </div>
    );
};

export default MediaBlock;
