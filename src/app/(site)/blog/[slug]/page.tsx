"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

import QuoteBlock from "@/components/blog/QuoteBlock";
import SliderBlock from "@/components/blog/SlideBlock";
import MarkdownBlock from "@/components/blog/MarkdownBlock";
import MediaBlock from "@/components/blog/MediaBlock";

import { useLocale } from "@/app/contexts/LocaleContext";
import { useDictionary } from "@/app/hooks/useDictionary";

interface Author {
    name: string;
    title?: string;
    email?: string;
    avatar?: { url: string };
    description?: string;
}

interface Cover {
    url: string;
    caption?: string;
}

interface Category {
    id: number;
    name: string;
}

type BlockComponentType = "media.rich-text" | "media.quote" | "media.slider" | "media.media";

interface BaseBlock {
    id: number;
    __component: BlockComponentType;
}

interface RichTextBlock extends BaseBlock {
    __component: "media.rich-text";
    body: any[];
}

interface QuoteBlockType extends BaseBlock {
    __component: "media.quote";
    title: any[];
}

interface SliderBlockType extends BaseBlock {
    __component: "media.slider";
    files?: { data?: any[] };
}

interface MediaBlockType extends BaseBlock {
    __component: "media.media";
    file?: any[];
}

type Block = RichTextBlock | QuoteBlockType | SliderBlockType | MediaBlockType;

interface Article {
    id: number;
    slug: string;
    title: string;
    description?: string;
    createdAt?: string;
    author?: Author;
    cover?: Cover;
    categories?: { data: Category[] };
    blocks?: Block[];
}

const ArticlePage: React.FC = () => {
    const params = useParams();
    const slug = params?.slug as string | undefined;
    const router = useRouter();
    const { locale } = useLocale();
    const { dictionary, loading: dictionaryLoading } = useDictionary(locale, "blog");

    const [article, setArticle] = useState<Article | null>(null);
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showingFallback, setShowingFallback] = useState(false);

    useEffect(() => {
        if (!slug) return;

        const fetchArticle = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await fetch(`/api/strapi/articles?slug=${slug}&locale=${locale}`);
                if (!res.ok) throw new Error("Failed to fetch article");
                const data: Article[] = await res.json();
                if (!data || data.length === 0) {
                    setArticle(null);
                    setShowingFallback(true);
                } else {
                    setArticle(data[0]);
                    setShowingFallback(false);
                }
            } catch (err) {
                console.error(err);
                setError(err instanceof Error ? err.message : "Failed to load article");
            } finally {
                setLoading(false);
            }
        };

        const fetchArticles = async () => {
            try {
                const res = await fetch(`/api/strapi/articles?locale=${locale}`);
                if (!res.ok) throw new Error("Failed to fetch articles");
                const data: Article[] = await res.json();
                setArticles(data || []);
            } catch (err) {
                console.error(err);
            }
        };

        fetchArticle();
        fetchArticles();
    }, [slug, locale]);

    const isLoading = loading || dictionaryLoading;

    const coverImageUrl = useMemo(
        () => (article?.cover?.url ? `${process.env.NEXT_PUBLIC_API_URL}${article.cover.url}` : null),
        [article]
    );

    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString();

    if (isLoading)
        return (
            <div className="min-h-screen flex items-center justify-center"></div>
        );

    if (error || !article)
        return (
            <div className="min-h-screen flex items-center justify-center flex-col gap-4">
                <p>{error || dictionary?.article_not_found || "Article not found"}</p>
                <button onClick={() => router.push("/blog")} className="px-4 py-2 border rounded">
                    {dictionary?.back_to_blog || "Back to Blog"}
                </button>
            </div>
        );

    return (
        <main className="min-h-screen p-5 pt-20">
            <div className="max-w-5xl mx-auto">
                {showingFallback && (
                    <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
                        <p className="text-sm text-yellow-800">
                            {dictionary?.translation_not_available ||
                                "This article is not available in your language. Showing original version."}
                        </p>
                    </div>
                )}

                <header className="mb-6 mt-4">
                    <h1 className="text-3xl font-bold mb-2">{article.title}</h1>

                    <h1 className="text-3xl font-bold mb-2">{article.author?.avatar?.url}</h1>
                    <div className="flex items-center gap-3 text-sm">
                        {article.author?.avatar?.url && (
                            <Image
                                src={`${process.env.NEXT_PUBLIC_API_URL}${article.author.avatar.url}`}
                                alt={article.author.name}
                                width={32}
                                height={32}
                                className="rounded-full"
                            />
                        )}

                        <div>
                            {article.author?.name && (
                                <p className="font-medium">{article.author.name}</p>
                            )}

                            <div className="flex gap-2 text-xs text-gray-500">
                                {article.author?.title && <span>{article.author.title}</span>}
                                {article.createdAt && <span>{formatDate(article.createdAt)}</span>}
                            </div>
                        </div>
                    </div>
                </header>


                {coverImageUrl && (
                    <figure className="mb-6">
                        <div className="relative w-full aspect-[2/1]">
                            <Image
                                src={coverImageUrl}
                                alt="Cover"
                                fill
                                className="rounded-lg object-cover"
                            />
                        </div>

                        {article.cover?.caption && (
                            <figcaption className="text-center text-gray-500 mt-2">
                                {article.cover.caption}
                            </figcaption>
                        )}
                    </figure>
                )}

                {/* Render blocks */}
                {article.blocks?.map((block, index) => {
                    switch (block.__component) {
                        case "media.rich-text":
                            return <MarkdownBlock key={`rt-${block.id}-${index}`} block={block} />;
                        case "media.quote":
                            return <QuoteBlock key={`q-${block.id}-${index}`} block={block} />;
                        case "media.slider":
                            return <SliderBlock key={`s-${block.id}-${index}`} block={block} api_url={process.env.NEXT_PUBLIC_API_URL ?? ""} />;
                        case "media.media":
                            return <MediaBlock key={`m-${block.id}-${index}`} block={block} api_url={process.env.NEXT_PUBLIC_API_URL ?? ""} />;
                        default:
                            return null;
                    }
                })}

                {/*/!* Other articles *!/*/}
                {/*{articles.length > 0 && (*/}
                {/*    <aside className="py-16">*/}
                {/*        <h2 className="text-2xl font-bold mb-4">{dictionary?.other_articles || "Other articles"}</h2>*/}
                {/*        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">*/}
                {/*            {articles*/}
                {/*                .filter((a) => a.id !== article.id && a.slug)*/}
                {/*                .slice(0, 4)*/}
                {/*                .map((a) => (*/}
                {/*                    <article key={a.id}>*/}
                {/*                        <a href={`/blog/${a.slug}`}>*/}
                {/*                            {a.cover?.url && (*/}
                {/*                                <Image*/}
                {/*                                    src={`${process.env.NEXT_PUBLIC_API_URL}${a.cover.url}`}*/}
                {/*                                    alt={a.title}*/}
                {/*                                    width={400}*/}
                {/*                                    height={200}*/}
                {/*                                    className="rounded-xl object-cover"*/}
                {/*                                />*/}
                {/*                            )}*/}
                {/*                            <h3 className="font-bold mt-2">{a.title}</h3>*/}
                {/*                        </a>*/}
                {/*                    </article>*/}
                {/*                ))}*/}
                {/*        </div>*/}
                {/*    </aside>*/}
                {/*)}*/}
            </div>
        </main>
    );
};

export default ArticlePage;