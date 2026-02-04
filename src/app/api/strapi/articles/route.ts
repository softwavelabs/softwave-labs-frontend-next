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
        const res = await axios.get(`${apiUrl}/api/articles?populate=*&locale=${locale}`, {
            headers: { Authorization: `Bearer ${apiToken}` },
        });

        if (!res.data.data || res.data.data.length === 0) {
            const resAll = await axios.get(`${apiUrl}/api/articles?populate=*&locale=all`, {
                headers: { Authorization: `Bearer ${apiToken}` },
            });
            return NextResponse.json(resAll.data.data);
        }

        return NextResponse.json(res.data.data);
    } catch (err: any) {
        console.error("Error fetching articles:", err.message);
        return NextResponse.json({ error: err.message || "Strapi fetch failed" }, { status: 500 });
    }
}
