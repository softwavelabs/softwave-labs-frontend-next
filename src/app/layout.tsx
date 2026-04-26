import { LocaleProvider } from "@/app/contexts/LocaleContext";
import { cookies } from "next/headers";
import ClientLayout from "@/app/clientLayout";

export const metadata = {
    title: 'Softwave Labs',
    description: 'Softwave Labs',
    icons: {
        icon: '/dot.svg',
    },
    openGraph: {
        title: 'Softwave Labs',
        description: 'Softwave Labs',
        url: 'https://softwave-labs.com',
        siteName: 'Softwave Labs',
        images: [
            {
                url: '/dot.svg',
                width: 1200,
                height: 630,
            },
        ],
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Softwave Labs',
        description: 'Softwave Labs – nowoczesne aplikacje webowe',
        images: ['/dot.svg'],
    },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies();
    const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en';

    return (
        <html>
        <body>
        <LocaleProvider initialLocale={locale}>
            <ClientLayout>
                {children}
            </ClientLayout>
        </LocaleProvider>
        </body>
        </html>
    );
}