import { sseBroadcaster } from "@/lib/adapters/sse-broadcaster";
import { getLeaderboardData } from "@/lib/use-cases/get-leaderboard";

export const dynamic = "force-dynamic";

export async function GET() {
  const encoder = new TextEncoder();

  let cleanupBroadcaster: (() => void) | null = null;
  let heartbeatInterval: NodeJS.Timeout | null = null;

  const stream = new ReadableStream({
    async start(controller) {
      // 1. Register client with SSE broadcaster
      cleanupBroadcaster = sseBroadcaster.addClient(controller);

      // 2. Push initial snapshot to this client
      try {
        const initial = await getLeaderboardData(50, 0);
        controller.enqueue(
          encoder.encode(`event: leaderboard_init\ndata: ${JSON.stringify(initial.data)}\n\n`)
        );
      } catch (err) {
        console.error("[SSE_INIT_ERROR] Failed to send initial snapshot:", err);
      }

      // 3. Heartbeat ping every 15s to keep connection alive through ngrok/proxies
      heartbeatInterval = setInterval(() => {
        const alive = sseBroadcaster.sendHeartbeat(controller);
        if (!alive && heartbeatInterval) {
          clearInterval(heartbeatInterval);
        }
      }, 15000);
    },
    cancel() {
      if (heartbeatInterval) clearInterval(heartbeatInterval);
      if (cleanupBroadcaster) cleanupBroadcaster();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
