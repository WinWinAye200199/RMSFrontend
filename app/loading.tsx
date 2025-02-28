'use client'

import { Loader2 } from "lucide-react"

export default function Loading() {
    return (
        <section
            className="bg-swamp-foreground flex min-h-screen w-full items-center justify-center"
        >
            <Loader2
                className="text-swamp-light !text-4xl animate-spin"
            />
        </section>
    )
}
