// import "./globals.css";

// app/layout.tsx
import { LocaleProvider} from "@/app/contexts/LocaleContext";
import { cookies } from "next/headers";

export default async function RootLayout({
                                             children,
                                         }: {
    children: React.ReactNode;
}) {
    const cookieStore = await cookies();
    const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en';

    return (
        <html lang={locale}>
        <body>
        <LocaleProvider initialLocale={locale}>

                {children}
        </LocaleProvider>
        </body>
        </html>
    );
}
