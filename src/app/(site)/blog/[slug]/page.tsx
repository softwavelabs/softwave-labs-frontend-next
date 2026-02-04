"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import QuoteBlock from "../../../../components/blog/QuoteBlock";
import SliderBlock from "../../../../components/blog/SlideBlock";
import MarkdownBlock from "../../../../components/blog/MarkdownBlock";
import MediaBlock from "@/components/blog/MediaBlock";
import { useLocale } from "@/app/contexts/LocaleContext";

const ArticlePage = () => {
    const { slug } = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const { locale, dictionary } = useLocale();
    const articleId = searchParams.get("id");

    const [article, setArticle] = useState<any>(null);
    const [articles, setArticles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showingFallback, setShowingFallback] = useState(false);

    const apiUrl = "/api/strapi"; // serwerowy endpoint

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                setLoading(true);
                setError(null);

                const url = `${apiUrl}/articles?slug=${slug}&locale=${locale}`;
                const res = await fetch(url);
                if (!res.ok) throw new Error("Failed to fetch article from server");
                const data = await res.json();

                if (!data || data.length === 0) {
                    setArticle(null);
                    setShowingFallback(true);
                } else {
                    setArticle(data[0]);
                    setShowingFallback(false);
                }
            } catch (err: any) {
                console.error(err);
                setError(err.message || "Failed to load article");
            } finally {
                setLoading(false);
            }
        };

        const fetchArticles = async () => {
            try {
                const res = await fetch(`${apiUrl}/articles?locale=${locale}`);
                if (!res.ok) throw new Error("Failed to fetch articles");
                const data = await res.json();
                setArticles(data || []);
            } catch (err) {
                console.error(err);
            }
        };

        fetchArticle();
        fetchArticles();
    }, [slug, locale]);

    const coverImageUrl = useMemo(
        () => (article?.cover?.url ? `${process.env.NEXT_PUBLIC_API_URL}${article.cover.url}` : null),
        [article]
    );

    const avatarImageUrl = useMemo(
        () => (article?.author?.avatar?.url ? `${process.env.NEXT_PUBLIC_API_URL}${article.author.avatar.url}` : null),
        [article]
    );

    const getComponent = (component: string) => {
        switch (component) {
            case "media.rich-text":
                return MarkdownBlock;
            case "media.quote":
                return QuoteBlock;
            case "media.slider":
                return SliderBlock;
            case "media.media":
                return MediaBlock;
            default:
                return null;
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const localeMap: { [key: string]: string } = {
            en: "en-US",
            is: "is-IS",
            nb: "nb-NO",
            pl: "pl-PL",
        };
        return date.toLocaleDateString(localeMap[locale] || "en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    if (loading)
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p style={{ fontFamily: "DotGothic16 Regular" }}>{dictionary?.loading || "Loading..."}</p>
            </div>
        );

    if (error)
        return (
            <div className="min-h-screen flex items-center justify-center flex-col gap-4">
                <p style={{ fontFamily: "DotGothic16 Regular" }}>{dictionary?.error || error}</p>
                <button onClick={() => router.push("/blog")} style={{ fontFamily: "DotGothic16 Regular" }} className="px-4 py-2 border rounded hover:bg-gray-100">
                    {dictionary?.back_to_blog || "Back to Blog"}
                </button>
            </div>
        );

    if (!article)
        return (
            <div className="min-h-screen flex items-center justify-center flex-col gap-4">
                <p style={{ fontFamily: "DotGothic16 Regular" }}>{dictionary?.article_not_found || "Article not found"}</p>
                <button onClick={() => router.push("/blog")} style={{ fontFamily: "DotGothic16 Regular" }} className="px-4 py-2 border rounded hover:bg-gray-100">
                    {dictionary?.back_to_blog || "Back to Blog"}
                </button>
            </div>
        );

    return (
        <main className="min-h-screen p-5">
            <div className="max-w-5xl mx-auto">
                <div className="article-window md:mt-16 p-4">
                    {showingFallback && (
                        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded" style={{ fontFamily: "DotGothic16 Regular" }}>
                            <p className="text-sm text-yellow-800">{dictionary?.translation_not_available || "This article is not available in your language. Showing original version."}</p>
                        </div>
                    )}

                    <header className="mb-6">
                        <div className="flex items-start gap-4 p-4">
                            {avatarImageUrl && <img src={avatarImageUrl} alt={article.author?.name || "Author"} className="w-16 h-16 rounded-full object-cover flex-shrink-0" />}
                            <div className="flex flex-col">
                                <a rel="author" className="text-base font-semibold text-gray-900 hover:underline">{article.author?.name}</a>
                                {article.author?.title && <p className="text-sm text-gray-600">{article.author?.title}</p>}
                                {article.author?.email && <p className="text-sm text-gray-500">{article.author?.email}</p>}
                                {article.author?.description && <p className="mt-2 text-sm text-gray-700 leading-relaxed">{article.author?.description}</p>}
                            </div>
                        </div>

                        <h1 className="text-3xl font-bold mb-2">{article.title}</h1>
                        {article.description && <p>{article.description}</p>}
                        {article.createdAt && <p className="text-xs text-gray-500">{formatDate(article.createdAt)}</p>}
                        {article.categories?.data?.length > 0 && <p className="text-xs uppercase mt-1">{article.categories.data.map((c: any) => c.name).filter(Boolean).join(", ")}</p>}
                    </header>

                    {coverImageUrl && (
                        <figure className="mb-6">
                            <img src={coverImageUrl} alt="Cover" className="rounded-lg w-full h-auto" />
                            {article.cover?.caption && <figcaption className="text-center text-gray-500 mt-2">{article.cover.caption}</figcaption>}
                        </figure>
                    )}

                    {article.blocks?.map((blockWrapper: any, index: number) => {
                        const block = blockWrapper;
                        const BlockComponent = getComponent(block.__component);
                        if (!BlockComponent) return null;
                        return (
                            <div key={`${block.__component}-${block.id}-${index}`} className="mb-6">
                                <BlockComponent block={block} api_url={apiUrl} />
                            </div>
                        );
                    })}

                    {articles.length > 0 && (
                        <aside className="py-8 lg:py-24">
                            <h2 className="text-2xl font-bold mb-4">{dictionary?.other_articles || "Other articles"}</h2>
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                {articles.filter((a) => a.id !== article.id && a.slug).slice(0, 4).map((a) => (
                                    <article key={a.id} className="max-w-xs cursor-pointer hover:opacity-80 transition-opacity">
                                        <a href={`/blog/${a.slug}?id=${a.id}`}>
                                            {a.cover?.url && <img src={`${process.env.NEXT_PUBLIC_API_URL}${a.cover.url}`} alt={a.title || "Cover"} className="w-full h-48 object-cover rounded-2xl" />}
                                            <h3 className="text-lg font-bold mt-2">{a.title || "Untitled"}</h3>
                                        </a>
                                    </article>
                                ))}
                            </div>
                        </aside>
                    )}
                </div>
            </div>
        </main>
    );
};

export default ArticlePage;
