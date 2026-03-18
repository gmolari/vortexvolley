import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getGlobalEmail, setGlobalEmail } from "@/lib/services/settings.service";

export function useGlobalEmail() {
  return useQuery({
    queryKey: ["settings", "global-email"],
    queryFn: getGlobalEmail,
  });
}

export function useSetGlobalEmail() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (email: string) => setGlobalEmail(email),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["settings"] }),
  });
}
