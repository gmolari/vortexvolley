import { cn } from "@/lib/utils";

interface SectionWrapperProps {
  id?: string;
  title?: string;
  className?: string;
  children: React.ReactNode;
}

export function SectionWrapper({ id, title, className, children }: SectionWrapperProps) {
  return (
    <section id={id} className={cn("scroll-mt-20 py-16 md:py-24", className)}>
      <div className="mx-auto max-w-7xl px-4">
        {title && (
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">{title}</h2>
            <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-primary" />
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
