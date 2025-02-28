'use client';

import { usePathname, useSearchParams } from "next/navigation";
import nProgress from "nprogress";
import { useEffect } from "react";

nProgress.configure({ showSpinner: true, speed: 500, trickleSpeed: 300, });

export function NProgressBar() {

    const pathname = usePathname();
    const searchParams = useSearchParams();

    const url = pathname + '?' + searchParams;

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = (e.target as HTMLElement).closest('a');
            if (target && isSameOrigin(target.origin)) {
                if (
                    target.target === "_blank" ||
                    target.rel === "noopener noreferrer" ||
                    e.ctrlKey ||
                    e.metaKey
                ) {
                    return;
                }

                const targetPathname = target.pathname;
                if (targetPathname !== pathname) {
                    nProgress.start();
                }
            }
        }

        document.addEventListener('click', handleClick);

        return () => {
            document.removeEventListener('click', handleClick);
        }
    }, [pathname])

    useEffect(() => {
        nProgress.done();
    }, [url])

    return null;
}

const isSameOrigin = (origin: string) =>
    window && window.location.origin.includes(origin);