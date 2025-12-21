import heroesData from "../assets/heroes.json";
import HomeClient from "./HomeClient";
import type { Hero } from "./components/HeroSearch";

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

  // Relative fetch works on server; no BASE_URL needed.
  const res = await fetch("/api/today-hero", { cache: "no-store" });
  const { heroId } = (await res.json()) as { heroId: string };

  const todayHero = heroes.find((h) => h.id === heroId);
  if (!todayHero) throw new Error("Today hero not found");

  return <HomeClient heroes={heroes} todayHero={todayHero} />;
}