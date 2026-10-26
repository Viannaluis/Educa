import { withApiResponse } from "@/lib/server/api-response";
import { getCalendarEvents } from "@/lib/server/portal-service";

export function GET(request: Request) {
  return withApiResponse(() => getCalendarEvents(new URL(request.url).searchParams));
}
