import { NextRequest } from "next/server";
import { getSwaggerSpec } from "@/swagger";

export async function GET(req: NextRequest) {
  const spec = getSwaggerSpec();
  return new Response(JSON.stringify(spec), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
