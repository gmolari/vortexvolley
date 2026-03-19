import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Trophy, Users, Swords } from "lucide-react";
import { getTournamentDetailData } from "@/lib/services/copafacil.service";
import { TournamentDetail } from "./tournament-detail";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function CampeonatoDetailPage({ params }: Props) {
  const { id } = await params;
  const data = await getTournamentDetailData(id).catch(() => null);

  if (!data) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      {/* Breadcrumb */}
      <Link
        href="/campeonatos"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar aos Campeonatos
      </Link>

      {/* Header */}
      <div className="mb-8 flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <Trophy className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">
            {data.tournament.name}
          </h1>
          <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
            {data.teamsCount > 0 && (
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                {data.teamsCount} equipes
              </span>
            )}
            {data.stagesData.length > 0 && (
              <span className="flex items-center gap-1.5">
                <Swords className="h-4 w-4" />
                {data.stagesData.length} fase{data.stagesData.length > 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Client-side tabs for stages */}
      <TournamentDetail data={data} />
    </div>
  );
}
