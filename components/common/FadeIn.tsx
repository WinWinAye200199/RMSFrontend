import { cn } from "@/lib/utils";

export function FadeIn({ children, className, ...props }: { children: React.ReactNode, className?: string }) {
    return (
        <section
            {...props}
            className={cn(className, "animate-fade-in")}
        >
            {children}
        </section>
    )
}