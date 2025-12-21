import heroesData from "../assets/heroes.json";
import HomeClient from "./HomeClient";
import type { Hero } from "./components/HeroSearch";
import { headers } from "next/headers";

type HeroRaw = Omit<Hero, "year" | "intellect" | "health"> & {
  year: string;
  intellect: string;
  health: string;
};

function toHeroes(data: unknown): Hero[] {
  return (data as HeroRaw[]).map((h) => ({
    ...h,
    year: Number(h.year),
    intellect: Number(h.intellect),
    health: Number(h.health),
  }));
}

export default async function Page() {
  const heroes = toHeroes(heroesData);

  const h = await headers();
  const host = h.get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

  if (!host) throw new Error("Host header missing");

  const res = await fetch(`${protocol}://${host}/api/today-hero`, {
    cache: "no-store",
  });

  const { heroId } = (await res.json()) as { heroId: string };

  const todayHero = heroes.find((h) => h.id === heroId);
  if (!todayHero) throw new Error("Today hero not found");

  return <HomeClient heroes={heroes} todayHero={todayHero} />;
}