import React, { ReactNode } from "react";
import "./layout.css";

interface DeviceColors {
    background: string;
    text?: string;
    primary?: string;
    secondary?: string;
}

interface LayoutProps {
    children: ReactNode;
    theme: DeviceColors;
}

const Layout: React.FC<LayoutProps> = ({ children, theme }) => {
    return (
        <div
            style={{
                paddingLeft: "1rem",
                paddingRight: "1rem",
                paddingTop: "1rem",
                display: "flex",
                flexDirection: "column",
                height: "100%",
                width: "100%",
                backgroundColor: theme.background,
            }}
        >
            {children}
        </div>
    );
};

export default Layout;
