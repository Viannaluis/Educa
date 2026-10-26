import { withApiResponse } from "@/lib/server/api-response";
import { getClasses } from "@/lib/server/portal-service";

export function GET() {
  return withApiResponse(getClasses);
}
