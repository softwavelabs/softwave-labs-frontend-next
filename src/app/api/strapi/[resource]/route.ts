import { NextRequest, NextResponse } from "next/server";
import { strapiClient} from "@/app/lib/strapiClient";

export async function GET(req: NextRequest, { params }: { params: { resource: string } }) {
    const resource = params.resource;
    const locale = req.nextUrl.searchParams.get("locale") || "en";

    try {
        const data = await strapiClient.fetch(resource, { locale, populate: "*" });
        return NextResponse.json(data);
    } catch (err: any) {
        return NextResponse.json({ error: err.message || "Failed to fetch data" }, { status: 500 });
    }
}
