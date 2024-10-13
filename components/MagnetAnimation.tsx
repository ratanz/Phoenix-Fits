import React, { useEffect, useRef } from 'react'
import gsap from 'gsap';

export default function Magnetic({children}: {children: React.ReactNode}) {
    const magnetic = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const xTo = gsap.quickTo(magnetic.current, "x", {duration: 1, ease: "elastic.out(1, 0.3)"});
        const yTo = gsap.quickTo(magnetic.current, "y", {duration: 1, ease: "elastic.out(1, 0.3)"});

        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const { height, width, left, top } = magnetic.current?.getBoundingClientRect() || {};
            const x = clientX - ((left ?? 0) + (width ?? 0) / 2);
            const y = clientY - ((top ?? 0) + (height ?? 0) / 2);
            xTo(x * 0.5);
            yTo(y * 0.5);
        };

        const handleMouseLeave = () => {
            xTo(0);
            yTo(0);
        };

        const element = magnetic.current;
        if (element) {
            element.addEventListener("mousemove", handleMouseMove);
            element.addEventListener("mouseleave", handleMouseLeave);
        }

        return () => {
            if (element) {
                element.removeEventListener("mousemove", handleMouseMove);
                element.removeEventListener("mouseleave", handleMouseLeave);
            }
        };
    }, []);

    return (
        React.cloneElement(children as React.ReactElement, { ref: magnetic })
    );
}