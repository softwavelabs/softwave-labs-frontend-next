"use client";

import dynamic from "next/dynamic";
import { LiquidSwipeLayout } from "@/components/ui/LiquidSwipeLayout";
import { Colors } from "@/components/theme/Colors";
import { useEffect, useState } from "react";
import { useLocale } from "@/app/contexts/LocaleContext";
import {DeviceColors} from "@/app/types/colors";

const LiquidSwipe = dynamic(() => import("@/components/ui/LiquidSwipe"), { ssr: false });


interface Page {
    id: number;
    documentId: string;
    title: string;
    subtitle: string;
    description: string;
    order: number;
    [key: string]: unknown; // Allow additional properties from Strapi
}

interface StrapiPageResponse {
    id: number;
    documentId: string;
    title?: string;
    subtitle?: string;
    description?: string;
    order?: number;
    [key: string]: unknown;
}

export default function Home() {
    const { locale } = useLocale();
    const [pages, setPages] = useState<Page[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPages = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/strapi/pages?locale=${locale}`);
                if (!res.ok) throw new Error("Failed to fetch pages from server");
                const data: StrapiPageResponse[] = await res.json();

                if (!data || data.length === 0) {
                    setPages([]);
                    setLoading(false);
                    return;
                }

                const mappedPages: Page[] = data
                    .map((item: StrapiPageResponse) => ({
                        ...item,
                        id: item.id,
                        documentId: item.documentId,
                        title: item.title || "",
                        subtitle: item.subtitle || "",
                        description: item.description || "",
                        order: item.order || 999,
                    }))
                    .sort((a, b) => a.order - b.order);

                setPages(mappedPages);
            } catch (err: unknown) {
                console.error(err);
                const errorMessage = err instanceof Error ? err.message : "Failed to load pages";
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchPages();
    }, [locale]);

    if (loading) return <div className="min-h-screen flex items-center justify-center"></div>;
    if (error) return <div className="min-h-screen flex items-center justify-center">{error}</div>;
    if (pages.length === 0) return <div className="min-h-screen flex items-center justify-center"></div>;
    const colors: DeviceColors[] = pages.map((page, i) => {
        const color = Colors[page.order || i + 1];
        return {
            background: color?.background ?? "#000000",
            text: color?.text ?? "#FFFFFF",
            primary: color?.primary,
            secondary: color?.secondary,
        };
    });

    const componentsToRender = pages.map((page, i) => <LiquidSwipeLayout key={`${page.id}-${locale}`} data={page} color={colors[i]} />);

    return <LiquidSwipe key={locale}  components={componentsToRender} colors={colors.map(c => c.background)} />;
}