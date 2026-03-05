"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useThemeStore } from "@/store/themeStore";
import { getColorsByIndex } from "@/components/theme/Colors";
import { useLocale } from "@/app/contexts/LocaleContext";
const apiUrl = "/api/strapi";
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

interface Article {
    id: number;
    slug: string;
    title: string;
    description?: string;
    createdAt?: string;
    author?: Author;
    cover?: Cover;
    categories?: { data: Category[] };
}
const Articles = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [search, setSearch] = useState("");
    const router = useRouter();
    const activeIndex = useThemeStore((state) => state.activeIndex);
    const { background, primary } = getColorsByIndex(activeIndex);
    const { locale } = useLocale();

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const res = await fetch(`${apiUrl}/articles?locale=${locale}`);
                if (!res.ok) throw new Error("Failed to fetch articles");
                const data: Article[] = await res.json();
                setArticles(data || []);
            } catch (err) {
                console.error("Error fetching articles", err);
            }
        };

        fetchArticles();
    }, [locale]);

    const navigateToArticle = (slug: string, id: number) => {
        router.push(`/blog/${slug}?id=${id}`);
    };

    const filteredArticles = articles.filter((article) => {
        const query = search.toLowerCase();
        return (
            article.title.toLowerCase().includes(query) ||
            article.slug.toLowerCase().includes(query)
        );
    });

    return (
        <div id="articles" className="min-h-screen p-5">
            <div className="flex justify-center mt-6">
                <input
                    style={{ fontFamily: "DotGothic16 Regular" }}
                    type="text"
                    placeholder=""
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="mb-6 p-3 w-56 border rounded"
                />
            </div>

            <div className="article-grid">
                {filteredArticles.map((article) => (
                    <div
                        key={article.id}
                        className="article-tile cursor-pointer"
                        onClick={() => navigateToArticle(article.slug, article.id)}
                    >
                        <div
                            style={{
                                fontFamily: "DotGothic16 Regular",
                                backgroundColor: primary,
                                color: background,
                            }}
                            className="w-full h-full flex justify-center items-center relative"
                        >
                            <p className="z-10 text-lg text-center px-2">{article.title}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Articles;
