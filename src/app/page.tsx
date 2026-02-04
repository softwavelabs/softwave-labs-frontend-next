"use client";

import dynamic from "next/dynamic";
import { LiquidSwipeLayout } from "@/components/ui/LiquidSwipeLayout";
import { Colors } from "@/components/theme/Colors";
import { useEffect, useState } from "react";
import { useLocale } from "@/app/contexts/LocaleContext";

const LiquidSwipe = dynamic(() => import("@/components/ui/LiquidSwipe"), { ssr: false });

export default function Home() {
    const { locale } = useLocale();
    const [pages, setPages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPages = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/strapi/pages?locale=${locale}`);
                if (!res.ok) throw new Error("Failed to fetch pages from server");
                const data = await res.json();

                if (!data || data.length === 0) {
                    setPages([]);
                    setLoading(false);
                    return;
                }

                const mappedPages = data
                    .map((item: any) => ({
                        id: item.id,
                        documentId: item.documentId,
                        title: item.title || "",
                        subtitle: item.subtitle || "",
                        description: item.description || "",
                        order: item.order || 999,
                        ...item,
                    }))
                    .sort((a, b) => a.order - b.order);

                setPages(mappedPages);
            } catch (err: any) {
                console.error(err);
                setError(err.message || "Failed to load pages");
            } finally {
                setLoading(false);
            }
        };

        fetchPages();
    }, [locale]);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading pages...</div>;
    if (error) return <div className="min-h-screen flex items-center justify-center">{error}</div>;
    if (pages.length === 0) return <div className="min-h-screen flex items-center justify-center">No pages available.</div>;

    const colors = pages.map((page, i) => Colors[page.order || i + 1] || { background: "#000000", text: "#FFFFFF" });
    const componentsToRender = pages.map((page, i) => <LiquidSwipeLayout key={`${page.id}-${locale}`} data={page} color={colors[i]} />);

    return <LiquidSwipe components={componentsToRender} colors={colors.map(c => c.background)} />;
}
