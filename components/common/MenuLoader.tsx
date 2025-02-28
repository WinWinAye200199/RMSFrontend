'use client';


export default function MenuLoader() {
    return (
        <nav
            className="p-2 space-y-2"
        >
            {
                Array.from({ length: 5 }).map((_, index) => (
                    <div
                        key={index}
                        className="w-full h-14 bg-neutral-400 animate-pulse rounded-md"
                    />
                ))
            }
        </nav>
    )
}
