import { withApiResponse, readJson } from "@/lib/server/api-response";
import { saveGrades } from "@/lib/server/portal-service";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params;
  return withApiResponse(async () => saveGrades(id, await readJson(request)));
}
