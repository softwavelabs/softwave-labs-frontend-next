import axios, { AxiosInstance } from "axios";

class StrapiClient {
    private client: AxiosInstance;

    constructor() {
        const apiUrl = process.env.API_URL;
        const apiToken = process.env.API_TOKEN;

        if (!apiUrl || !apiToken) {
            throw new Error("API_URL or API_TOKEN not configured in env");
        }

        this.client = axios.create({
            baseURL: apiUrl,
            headers: {
                Authorization: `Bearer ${apiToken}`,
            },
        });
    }

    async fetch(endpoint: string, params?: Record<string, string | number | boolean | string[]>) {
        try {
            const res = await this.client.get(`/api/${endpoint}`, { params });
            return res.data.data;
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            console.error(`[StrapiClient] Error fetching ${endpoint}:`, errorMessage);
            throw err;
        }
    }
    //
    // fetchPages(locale: string) {
    //     return this.fetch("pages", { locale, populate: "*" });
    // }
    //
    // fetchProducts(locale: string) {
    //     return this.fetch("products", { locale, populate: "*" });
    // }
}

export const strapiClient = new StrapiClient();