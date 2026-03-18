"use server";

import { getAllTournamentsData } from "@/lib/services/copafacil.service";

export async function getAllTournamentsDataAction() {
  return getAllTournamentsData();
}
