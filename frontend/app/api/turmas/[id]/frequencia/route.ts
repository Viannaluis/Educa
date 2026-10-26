import { withApiResponse, readJson } from "@/lib/server/api-response";
import { saveAttendance } from "@/lib/server/portal-service";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params;
  return withApiResponse(async () => saveAttendance(id, await readJson(request)));
}
