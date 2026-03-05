import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest) {
    const locale = req.nextUrl.searchParams.get("locale") || "en";
    const slug = req.nextUrl.searchParams.get("slug");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const apiToken = process.env.STRAPI_API_TOKEN;

    if (!apiToken) {
        return NextResponse.json({ error: "API token missing" }, { status: 500 });
    }

    try {
        let url = `${apiUrl}/api/articles?populate=deep,3&locale=${locale}`;
        if (slug) {
            // w produkcji Strapi wymaga filters
            url += `&filters[slug][$eq]=${slug}`;
        }

        const res = await axios.get(url, {
            headers: { Authorization: `Bearer ${apiToken}` },
        });

        if (!res.data.data || res.data.data.length === 0) {
            const fallback = await axios.get(`${apiUrl}/api/articles?populate=deep,3&locale=all`, {
                headers: { Authorization: `Bearer ${apiToken}` },
            });
            return NextResponse.json(fallback.data.data);
        }

        return NextResponse.json(res.data.data);
    } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error("Error fetching articles from Strapi:", errorMessage);
        return NextResponse.json({ error: errorMessage || "Strapi fetch failed" }, { status: 500 });
    }
}