'use client';

import { useThemeStore} from "@/store/themeStore";
import { getColorsByIndex} from "@/components/theme/Colors";
import CookieBanner from "@/components/theme/CookieBanner";
import {ReactNode} from "react";

type Props = {
    children: ReactNode;
};
export default function ClientLayout({ children }: Props) {
    const activeIndex = useThemeStore(
        (state) => state.activeIndex ?? 0
    );

    const { background, text, primary, secondary } =
        getColorsByIndex(activeIndex);

    return (
        <div style={{ background, color: text }}>
            {children}
            <CookieBanner theme={{ background, text, primary, secondary }}/>
        </div>
    );
}