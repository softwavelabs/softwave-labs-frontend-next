import React, { useEffect, useRef } from "react";
import type p5 from "p5";

interface DeviceColors {
    background: string;
    text?: string;
    primary?: string;
    secondary?: string;
}

interface TixyPatternProps {
    theme: DeviceColors;
}

const TixyPattern: React.FC<TixyPatternProps> = ({ theme }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const p5Instance = useRef<p5 | null>(null);

    useEffect(() => {
        const instance = p5Instance.current;
        if (instance) {
            instance.remove();
            p5Instance.current = null;
        }

        if (containerRef.current) {
            containerRef.current.innerHTML = "";
        }

        import("p5").then((p5Module) => {
            const P5 = p5Module.default;
            const primaryColor = theme.primary ?? "#00ffaa";
            const secondaryColor = theme.secondary ?? "#000";

            const sketch = (p: p5) => {
                const rows = 40;
                const cols = 40;
                const diameter = 7;
                const padding = 10;
                let t = 0;

                const spiralPattern = (x: number, y: number, t: number) => {
                    const cx = cols / 2;
                    const cy = rows / 2;

                    const dx = x - cx;
                    const dy = y - cy;

                    const r = Math.sqrt(dx * dx + dy * dy);
                    const a = Math.atan2(dy, dx);

                    return Math.sin(r * 0.6 - t * 2 + a * 3);
                };

                const radiusFromValue = (v: number) =>
                    diameter * (0.3 + Math.abs(v));

                p.setup = () => {
                    if (!containerRef.current) return;
                    const canvas = p.createCanvas(325, 325);
                    canvas.parent(containerRef.current);
                    p.noStroke();
                };

                p.draw = () => {
                    p.background(theme.background ?? "#000");

                    const cellW = (p.width - 2 * padding) / cols;
                    const cellH = (p.height - 2 * padding) / rows;

                    for (let i = 0; i < rows; i++) {
                        for (let j = 0; j < cols; j++) {
                            const x = i * cellW + cellW / 2 + padding;
                            const y = j * cellH + cellH / 2 + padding;

                            const value = spiralPattern(i, j, t);

                            if (value > 0) p.fill(primaryColor);
                            else p.fill(secondaryColor);

                            p.ellipse(x, y, radiusFromValue(value));
                        }
                    }

                    t += 0.03;
                };
            };

            p5Instance.current = new P5(sketch);
        });

        return () => {
            p5Instance.current?.remove();
            p5Instance.current = null;
        };
    }, [theme]);

    return <div ref={containerRef} />;
};

export default TixyPattern;