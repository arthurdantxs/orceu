import { NextRequest, NextResponse } from "next/server";
import { getRadarDaObra } from "@/lib/radar-da-obra";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  try {
    const payload = await getRadarDaObra({
      uf: searchParams.get("uf") ?? undefined,
      cidade: searchParams.get("cidade") ?? undefined,
      lat: searchParams.get("lat") ?? undefined,
      lon: searchParams.get("lon") ?? undefined,
    });

    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "s-maxage=300, stale-while-revalidate=3600",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        updated_at: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Erro ao carregar Radar da Obra",
      },
      { status: 500 },
    );
  }
}
