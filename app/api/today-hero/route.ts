export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createClient, type RedisClientType } from "redis";
import heroesData from "@/assets/heroes.json";

declare global {
    // eslint-disable-next-line no-var
    var __redisClient: RedisClientType | undefined;
}

async function getRedis() {
    if (!global.__redisClient) {
        const url = process.env.REDIS_URL;
        if (!url) throw new Error("Missing REDIS_URL");
        global.__redisClient = createClient({ url });
        await global.__redisClient.connect();
    }
    return global.__redisClient;
}

function utcDayKey(d = new Date()) {
    return d.toISOString().slice(0, 10); // "YYYY-MM-DD"
}

// stable pick that won’t change if you reorder heroes.json
function pickId(dayKey: string, ids: string[]) {
    let h = 2166136261; // FNV-1a-ish
    for (let i = 0; i < dayKey.length; i++) {
        h ^= dayKey.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return ids[(h >>> 0) % ids.length];
}

export async function GET() {
    const redis = await getRedis();

    const dayKey = utcDayKey();
    const key = `todayHero:${dayKey}`;

    const existing = await redis.get(key);
    if (existing) return NextResponse.json({ heroId: existing });

    const ids = (heroesData as { id: string }[]).map((h) => h.id).sort();
    if (ids.length === 0) throw new Error("No heroes found");

    const heroId = pickId(dayKey, ids);

    // freeze for a year (optional, but nice)
    await redis.set(key, heroId, { EX: 60 * 60 * 24 * 365 });

    return NextResponse.json({ heroId });
}
