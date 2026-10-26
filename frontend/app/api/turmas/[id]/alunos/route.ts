import { withApiResponse } from "@/lib/server/api-response";
import { getClassStudents } from "@/lib/server/portal-service";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  return withApiResponse(() => getClassStudents(id));
}
