"use client";

import React, {
    useState,
    useEffect,
    ReactNode,
    JSX,
    useRef,
} from "react";
import { useSpring, animated } from "react-spring";
import { useDrag } from "react-use-gesture";
import styled from "styled-components";
import {useThemeStore} from "@/store/themeStore";

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  box-shadow: 0 0 25px -8px rgba(53, 53, 53, 0.82);
  overflow: hidden;
  touch-action: none;
  overscroll-behavior: none;

  @media only screen and (max-width: 500px) {
    width: 100%;
  }
`;

const getInitialIndex = () => {
    if (typeof window === "undefined") {
        return 0;
    }

    const saved = localStorage.getItem("liquidSwipeIndex");
    const parsed = saved ? Number(saved) : 0;

    if (isNaN(parsed) || parsed === 3) {
        return 0;
    }

    return parsed;
};

const PageDiv = styled.div.withConfig({
    shouldForwardProp: (prop) => prop !== "theme" && prop !== "isGone",
})<{ theme: string; isGone: boolean }>`
  width: 100%;
  height: 100%;
  position: absolute;
  text-align: center;
  font-size: 37px;
  flex-direction: column;
  display: flex;
  justify-content: space-between;
  background-color: ${(props) => props.theme};
  transition: background-color 0.3s ease;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  touch-action: none;
`;

const StyledSVG = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  background-color: transparent;
  width: 20%;
  height: 100%;
  pointer-events: none;
`;

const getPath = (y: number, x: number, width: number, height: number): string => {
    const yAdjusted = y - 120;
    const anchorDistance = 200 + x * 0.5;
    const curviness = anchorDistance - 60;
    return `M0,${height}H0V0h${width}v${yAdjusted - anchorDistance}c0,${curviness},${x},${curviness},${x},${anchorDistance}S${width},${yAdjusted},${width},${yAdjusted + anchorDistance * 2}V${height}z`;
};

interface PageProps {
    children: ReactNode;
    theme: string;
    index: number;
    setActive: (index: number) => void;
    gone?: boolean;
}

const Page: React.FC<PageProps> = ({
                                       children,
                                       theme,
                                       index,
                                       setActive,
                                       gone = false,
                                   }) => {
    const [isGone, setGone] = useState<boolean>(gone);
    const [isSettled, setSettled] = useState<boolean>(gone);

    const initializedRef = useRef(false);

    const [dimensions, setDimensions] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    useEffect(() => {
        const updateDimensions = () => {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener("resize", updateDimensions);
        return () => {
            window.removeEventListener("resize", updateDimensions);
        };
    }, []);

    const { width, height } = dimensions;

    const [, setPosApi] = useSpring(() => ({
        posX: -50,
        posY: height * 0.72 - 20,
        config: { mass: 3 },
    }));

    const [{ d }, setDvalueApi] = useSpring(() => ({
        d: gone ? getPath(0, 0, width, height) : getPath(height * 0.72, 0, 0, height),
        config: { mass: 3 },
    }));

    useEffect(() => {
        if (!gone && !initializedRef.current) {
            initializedRef.current = true;
            setDvalueApi.start({ d: getPath(height * 0.72, 48, 5, height) });
            setTimeout(() => {
                setPosApi.start({ posX: 7 });
            }, 100);
        }
    }, [gone, setDvalueApi, setPosApi, height]);

    useEffect(() => {
        setDvalueApi.start({
            d: isGone
                ? getPath(0, 0, width, height)
                : getPath(height * 0.72, 48, 5, height),
            immediate: true
        });

        setPosApi.start({
            posX: isGone ? -50 : 7,
            posY: isGone ? height : height * 0.72 - 20,
            immediate: true
        });
    }, [width, height, isGone, setDvalueApi, setPosApi]);

    const START_Y = height * 0.72;

    const bind = useDrag(
        (state) => {
            const { down, movement, xy, vxvy } = state;

            if (isGone) {
                return;
            }

            const mx = movement[0];
            const my = xy[1];
            const vx = vxvy[0];

            const shouldSwipe = mx > width / 2 || vx > 3;

            if (down) {
                setDvalueApi.start({
                    d: getPath(my, mx + 60, 10, height),
                    immediate: true,
                });

                setPosApi.start({
                    posX: mx + 20,
                    posY: my - 20,
                    immediate: true,
                });
            } else {
                if (shouldSwipe) {
                    setDvalueApi.start({
                        d: getPath(START_Y, -50, width, height),
                    });

                    setGone(true);

                    setTimeout(() => {
                        setDvalueApi.start({
                            d: getPath(START_Y, 0, width, height),
                        });
                        setActive(index);
                        setSettled(true);
                    }, 240);
                } else {
                    setDvalueApi.start({
                        d: getPath(START_Y, 48, 5, height),
                    });

                    setPosApi.start({
                        posX: 7,
                        posY: START_Y - 20,
                    });
                }
            }
        },
        {
            filterTaps: true,
            pointer: { touch: true },
            eventOptions: { passive: false },
        }
    );

    return (
        <div id={`pageContainer${index}`}>
            <StyledSVG width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
                <clipPath id={`clipping${index}`}>
                    <animated.path
                        id={`blob-path${index}`}
                        d={d as unknown as string}
                    />
                </clipPath>
            </StyledSVG>

            <PageDiv
                theme={theme}
                {...bind()}
                isGone={isGone}
                style={
                    isSettled
                        ? undefined
                        : {
                            clipPath: `url(#clipping${index})`,
                            WebkitClipPath: `url(#clipping${index})`,
                        }
                }
            >
                {children}
            </PageDiv>
        </div>
    );
};

interface LiquidSwipeProps {
    components: ReactNode[];
    colors: string[];
}

export const LiquidSwipe: React.FC<LiquidSwipeProps> = ({
                                                            components,
                                                            colors,
                                                        }) => {
    const size = components.length;
    const initialIndex = getInitialIndex();
    const validInitialIndex = initialIndex >= 0 && initialIndex < size ? initialIndex : 0;

    const [activeIndex, setActive] = useState(validInitialIndex);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const store = useThemeStore.getState?.();
        store?.setActiveIndex?.(activeIndex);
    }, [activeIndex]);

    const [pages, setPages] = useState<JSX.Element[]>([]);

    const cycleCountRef = useRef(0);
    const lastAddedRef = useRef<string>(`${validInitialIndex}-0`);

    useEffect(() => {
        if (!isInitialized) {
            setPages([
                <Page
                    key={`${validInitialIndex}-0`}
                    index={validInitialIndex}
                    setActive={setActive}
                    gone={true}
                    theme={colors[validInitialIndex]}
                >
                    {components[validInitialIndex]}
                </Page>,
            ]);
            setIsInitialized(true);
        }
    }, [isInitialized, validInitialIndex, colors, components]);

    useEffect(() => {
        if (!isInitialized) {
            return;
        }

        localStorage.setItem("liquidSwipeIndex", activeIndex.toString());

        const nextIndex = (activeIndex + 1) % size;

        if (nextIndex === 0) {
            cycleCountRef.current += 1;
        }

        const pageKey = `${nextIndex}-${cycleCountRef.current}`;

        if (lastAddedRef.current === pageKey) {
            return;
        }

        lastAddedRef.current = pageKey;

        if (pages.length === size - 1) {
            setTimeout(() => {
                setPages((prev) => {
                    return [
                        ...prev.slice(1),
                        <Page
                            key={pageKey}
                            index={nextIndex}
                            setActive={setActive}
                            theme={colors[nextIndex]}
                        >
                            {components[nextIndex]}
                        </Page>,
                    ];
                });
            }, 600);
        } else {
            setPages((prev) => {
                return [
                    ...prev,
                    <Page
                        key={pageKey}
                        index={nextIndex}
                        setActive={setActive}
                        theme={colors[nextIndex]}
                    >
                        {components[nextIndex]}
                    </Page>,
                ];
            });
        }
    }, [activeIndex, colors, components, size, pages.length, isInitialized]);

    if (pages.length === 0) {
        return <Container style={{ backgroundColor: colors[validInitialIndex] }} />;
    }

    return <Container>{pages}</Container>;
};

export default LiquidSwipe;