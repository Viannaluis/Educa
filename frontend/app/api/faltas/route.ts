import { withApiResponse } from "@/lib/server/api-response";
import { getAbsences, parseRole } from "@/lib/server/portal-service";

export function GET(request: Request) {
  const role = parseRole(new URL(request.url).searchParams.get("perfil"));
  return withApiResponse(() => getAbsences(role));
}
