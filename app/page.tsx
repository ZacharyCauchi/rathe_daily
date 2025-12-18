"use client";

import { Box, Heading, Text, Stack } from "@chakra-ui/react";
import { HeroSearch, Hero } from "./components/HeroSearch";
import heroesData from "../assets/heroes.json";
import { useEffect, useMemo, useRef, useState } from "react";
import { HeroResult } from "./components/HeroResult";
import JSConfetti from "js-confetti";

const xmur3 = (str: string) => {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^= h >>> 16) >>> 0;
  };
}

const mulberry32 = (a: number) => {
  return () => {
    let t = (a += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const localDayKey = (d = new Date()) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function Home() {

  const [selectedHeroes, setSelectedHeroes] = useState<Hero[]>([]);
  const jsConfettiRef = useRef<JSConfetti | null>(null);

  useEffect(() => {
    jsConfettiRef.current = new JSConfetti();
  }, []);

  const selectHero = (hero: Hero) => {
    setSelectedHeroes((prev) => [...prev, hero]);
    if (todayHero && hero.id === todayHero.id) {
      jsConfettiRef.current?.addConfetti();
    }
  }

  const heroes: Hero[] = heroesData.map((h) => ({
    ...h,
    year: Number(h.year),
    intellect: Number(h.intellect),
    health: Number(h.health),
  }));

  const dayKey = localDayKey();
  const seed = xmur3(dayKey)();
  const rand = mulberry32(seed);
  const index = Math.floor(rand() * heroes.length);
  const todayHero = heroes[index];

  if (!todayHero) {
    throw new Error("Today hero not found");
  }

  return (
    <Box
      minH="100vh"
      bg="zinc.50"
      _dark={{ bg: "black" }}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        as="main"
        minH="100vh"
        w="full"
        maxW="6xl"
        display="flex"
        flexDir="column"
        alignItems={{ base: "center", sm: "center" }}
        justifyContent="flex-start"
        py={32}
        px={16}
        bg="white"
        _dark={{ bg: "black" }}
      >
        <Stack
          align={{ base: "center", sm: "flex-start" }}
          textAlign="center"
        >
          <Heading
            as="h1"
            width="100%"
            fontSize="3xl"
            fontWeight="bold"
            lineHeight="2.5rem"
            letterSpacing="-0.03em"
            color="black"
            _dark={{ color: "zinc.50" }}
          >
            Rathedle
          </Heading>

          <Heading
            as="h3"
            width="100%"
            fontSize="1xl"
            fontWeight="400"
            lineHeight="1.5rem"
            letterSpacing="-0.03em"
            color="black"
            _dark={{ color: "zinc.50" }}
          >
            Guess a Flesh and Blood Hero. Deduce todays hero by process of
            elimination.
          </Heading>

          <HeroSearch handleSelect={selectHero} />
          <Stack>
            {[...selectedHeroes].reverse().map((hero, idx) => (
              <HeroResult
                key={hero.id + '_' + idx}
                selectedHero={hero}
                heroToday={todayHero}
              />
            ))}
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}