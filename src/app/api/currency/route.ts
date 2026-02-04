import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest) {
    const locale = req.nextUrl.searchParams.get("locale") || "en";
    const apiUrl = process.env.API_URL;
    const apiToken = process.env.API_TOKEN;

    if (!apiToken) {
        return NextResponse.json({ error: "API token missing" }, { status: 500 });
    }

    try {
        const res = await axios.get(`${apiUrl}/api/currency?locale=${locale}`, {
            headers: { Authorization: `Bearer ${apiToken}` },
        });

        const currency = res.data?.data || null;

        if (!currency) {
            return NextResponse.json({ error: "Currency not found" }, { status: 404 });
        }

        return NextResponse.json(currency);
    } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error("Error fetching bundles from Strapi:", errorMessage);
        return NextResponse.json({ error: errorMessage || "Strapi fetch failed" }, { status: 500 });
    }
}
