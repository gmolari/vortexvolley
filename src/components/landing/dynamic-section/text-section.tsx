import type { LandingItem } from "@/types";

interface TextSectionProps {
  items: LandingItem[];
}

export function TextSection({ items }: TextSectionProps) {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {items.map((item) => (
        <div key={item.id} className="text-center">
          <h3 className="text-xl font-semibold text-foreground">{item.title}</h3>
          {item.description && (
            <div className="mt-3 text-muted-foreground leading-relaxed [&_p]:m-0 [&_h1]:text-xl [&_h2]:text-lg [&_h3]:text-base [&_a]:text-primary [&_a]:underline [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6" dangerouslySetInnerHTML={{ __html: item.description }} />
          )}
        </div>
      ))}
    </div>
  );
}
