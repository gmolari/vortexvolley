import { Trophy, Dumbbell, Heart } from "lucide-react";
import { SectionWrapper } from "../section-wrapper";

const features = [
  {
    icon: Dumbbell,
    title: "Treinos",
    description: "Escolinha de treino para todos os níveis, do iniciante ao competitivo.",
  },
  {
    icon: Trophy,
    title: "Campeonatos",
    description: "Participação ativa em campeonatos amadores em Londrina e região.",
  },
  {
    icon: Heart,
    title: "Comunidade",
    description: "Integração entre atletas e equipes, fortalecendo laços pelo esporte.",
  },
];

export function AboutSection() {
  return (
    <SectionWrapper id="sobre" title="Sobre o Vortex">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <div className="space-y-4">
          <p className="text-lg text-muted-foreground leading-relaxed">
            O <strong className="text-foreground">Vórtex Londrina</strong> foi criado em 2023,
            surgiu de uma ideia entre três amigos que começaram a jogar juntos com a finalidade
            de competir em campeonatos amadores em Londrina e região.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            À medida que o projeto cresceu, surgiu a necessidade de criar uma escolinha de treino.
            Hoje são <strong className="text-foreground">mais de 120 atletas</strong> e um
            projeto consolidado, com foco na prática do voleibol amador e na integração entre
            atletas e equipes.
          </p>
        </div>
        <div className="flex items-center justify-center">
          <div className="relative h-72 w-72 rounded-2xl border border-border/50 bg-linear-to-br from-primary/10 to-primary/5 p-8 flex items-center justify-center">
            <span className="text-7xl font-extrabold text-primary/20">V</span>
            <div className="absolute -bottom-3 -right-3 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">
              120+ Atletas
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 grid gap-6 sm:grid-cols-3">
        {features.map((f) => (
          <div
            key={f.title}
            className="rounded-xl border border-border/50 bg-card p-6 transition-colors hover:border-primary/30"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <f.icon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">{f.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{f.description}</p>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
