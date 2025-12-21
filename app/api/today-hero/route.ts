import { kv } from "@vercel/kv";
import heroesData from "@/assets/heroes.json";
import { NextResponse } from "next/server";

type HeroRaw = { id: string };

function heroIdsSorted() {
    return (heroesData as HeroRaw[]).map((h) => h.id).sort();
}

function utcDayKey(d = new Date()) {
    return d.toISOString().slice(0, 10); // "YYYY-MM-DD"
}

function pickHeroIdForDay(dayKey: string, ids: string[]) {
    // simple string hash -> index
    let h = 0;
    for (let i = 0; i < dayKey.length; i++) h = (h * 31 + dayKey.charCodeAt(i)) >>> 0;
    return ids[h % ids.length];
}

export async function GET() {
    const dayKey = utcDayKey();
    const key = `todayHero:${dayKey}`;

    const existing = await kv.get<string>(key);
    if (existing) {
        return NextResponse.json({ dayKey, heroId: existing });
    }
    const ids = heroIdsSorted();
    const heroId = pickHeroIdForDay(dayKey, ids);

    await kv.set(key, heroId, { ex: 60 * 60 * 24 * 365 });

    return NextResponse.json({ dayKey, heroId });
}
