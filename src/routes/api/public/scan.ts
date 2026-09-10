import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const Input = z.object({ url: z.string().min(4).max(4000) });

const CORS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "POST, OPTIONS",
  "access-control-allow-headers": "content-type",
  "content-type": "application/json",
};

export const Route = createFileRoute("/api/public/scan")({
  server: {
    handlers: {
      OPTIONS: () => new Response(null, { status: 204, headers: CORS }),
      POST: async ({ request }) => {
        try {
          const parsed = Input.safeParse(await request.json());
          if (!parsed.success)
            return new Response(
              JSON.stringify({ error: "Please paste a link or product details." }),
              { status: 400, headers: CORS },
            );
          const { runScan } = await import("@/lib/scan.server");
          const report = await runScan(parsed.data.url);
          return new Response(JSON.stringify(report), { status: 200, headers: CORS });
        } catch (err) {
          const message =
            err instanceof Error ? err.message : "That link couldn't be scanned.";
          return new Response(JSON.stringify({ error: message }), {
            status: 500,
            headers: CORS,
          });
        }
      },
    },
  },
});
