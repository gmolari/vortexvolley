import type { Championship } from "@/types/copafacil";

// TODO: Connect to real CopFacil API when Professional plan is available.
// The CopFacil JSON API requires a Professional plan subscription.
// Base URL: https://copafacil.com
// Endpoint examples:
//   GET /json/championships - List championships
//   GET /json/championships/:id/events - List events for a championship

const COPAFACIL_BASE_URL = "https://copafacil.com";

const mockChampionships: Championship[] = [
  {
    id: "1",
    name: "Copa Londrina de Volei 2025",
    status: "active",
    sport: "Voleibol",
    startDate: "2025-06-15",
    endDate: "2025-08-20",
    teamsCount: 12,
  },
  {
    id: "2",
    name: "Torneio Regional Norte do Parana",
    status: "upcoming",
    sport: "Voleibol",
    startDate: "2025-09-10",
    teamsCount: 8,
  },
  {
    id: "3",
    name: "Liga Amadora de Volei - 1o Semestre",
    status: "finished",
    sport: "Voleibol",
    startDate: "2025-02-01",
    endDate: "2025-05-30",
    teamsCount: 16,
  },
  {
    id: "4",
    name: "Copa Integracao Voleibol",
    status: "upcoming",
    sport: "Voleibol",
    startDate: "2025-10-05",
    teamsCount: 10,
  },
];

interface UpcomingEvent {
  id: string;
  championshipId: string;
  championshipName: string;
  date: string;
  time: string;
  location: string;
  teamA: string;
  teamB: string;
}

const mockUpcomingEvents: UpcomingEvent[] = [
  {
    id: "e1",
    championshipId: "1",
    championshipName: "Copa Londrina de Volei 2025",
    date: "2025-07-12",
    time: "19:00",
    location: "Ginasio Moringao",
    teamA: "Vortex Volley",
    teamB: "Londrina Volei Clube",
  },
  {
    id: "e2",
    championshipId: "1",
    championshipName: "Copa Londrina de Volei 2025",
    date: "2025-07-19",
    time: "15:00",
    location: "Ginasio Moringao",
    teamA: "Cambe Volei",
    teamB: "Vortex Volley",
  },
  {
    id: "e3",
    championshipId: "2",
    championshipName: "Torneio Regional Norte do Parana",
    date: "2025-09-10",
    time: "18:00",
    location: "Ginasio Municipal de Maringa",
    teamA: "Vortex Volley",
    teamB: "Maringa Volei",
  },
];

export async function getChampionships(): Promise<Championship[]> {
  // TODO: Replace with real CopFacil API when Professional plan is available
  // const res = await fetch(`${COPAFACIL_BASE_URL}/json/championships`, {
  //   next: { revalidate: 600 },
  // });
  // if (!res.ok) throw new Error("CopFacil API error");
  // return res.json();
  try {
    return mockChampionships;
  } catch {
    return mockChampionships;
  }
}

export async function getUpcomingEvents(): Promise<UpcomingEvent[]> {
  // TODO: Replace with real CopFacil API
  // const res = await fetch(`${COPAFACIL_BASE_URL}/json/events?upcoming=true`, {
  //   next: { revalidate: 300 },
  // });
  // if (!res.ok) throw new Error("CopFacil API error");
  // return res.json();
  try {
    return mockUpcomingEvents;
  } catch {
    return mockUpcomingEvents;
  }
}

export async function getActiveChampionships(): Promise<Championship[]> {
  const all = await getChampionships();
  return all.filter((c) => c.status === "active");
}

export async function getUpcomingChampionships(): Promise<Championship[]> {
  const all = await getChampionships();
  return all.filter((c) => c.status === "upcoming");
}
