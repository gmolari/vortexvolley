"use server";

import {
  getCopafacilLogs,
  getCopafacilLogStats,
  clearCopafacilLogs,
} from "@/lib/services/copafacil-log.service";

export async function getCopafacilLogsAction(limit = 100, offset = 0) {
  return getCopafacilLogs(limit, offset);
}

export async function getCopafacilLogStatsAction() {
  return getCopafacilLogStats();
}

export async function clearCopafacilLogsAction() {
  return clearCopafacilLogs();
}
