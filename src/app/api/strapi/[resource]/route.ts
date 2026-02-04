import { NextRequest, NextResponse } from "next/server";
import { strapiClient } from "@/app/lib/strapiClient";

export async function GET(req: NextRequest, { params }: { params: Promise<{ resource: string }> }) {
    const { resource } = await params;
    const locale = req.nextUrl.searchParams.get("locale") || "en";

    try {
        const data = await strapiClient.fetch(resource, { locale, populate: "*" });
        return NextResponse.json(data);
    } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch data";
        console.error(`[API] Error fetching ${resource}:`, errorMessage);
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}