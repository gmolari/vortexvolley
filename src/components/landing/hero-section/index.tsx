import Link from "next/link";
import { ArrowRight, Users, MapPin, Calendar } from "lucide-react";

export function HeroSection() {
  return (
    <section
      id="inicio"
      className="relative flex min-h-[90vh] items-center overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/10"
    >
      {/* Decorative volleyball pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
        backgroundSize: '40px 40px',
      }} />

      <div className="relative mx-auto max-w-7xl px-4 py-20 text-center">
        <div className="animate-fade-in">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            Voleibol amador em Londrina
          </div>

          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-8xl">
            <span className="text-foreground">VORTEX</span>
            <br />
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              VOLLEY
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Projeto consolidado de voleibol amador em Londrina e região.
            Unindo atletas pela paixão pelo esporte desde 2023.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#sobre"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105"
            >
              Conheça nosso projeto
              <ArrowRight className="h-4 w-4" />
            </a>
            <Link
              href="/loja"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
            >
              Nossa Loja
            </Link>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {[
            { icon: Users, label: "120+ Atletas", desc: "Equipe em crescimento" },
            { icon: Calendar, label: "Desde 2023", desc: "Projeto consolidado" },
            { icon: MapPin, label: "Londrina, PR", desc: "Norte do Paraná" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-4 rounded-xl border border-border/50 bg-card/50 p-5 backdrop-blur-sm"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-bold text-foreground">{stat.label}</p>
                <p className="text-sm text-muted-foreground">{stat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
