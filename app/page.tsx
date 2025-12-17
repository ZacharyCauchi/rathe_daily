"use client";

import { Box, Heading, Text, Stack } from "@chakra-ui/react";
import { HeroSearch, Hero } from "./components/HeroSearch";
import heroesData from "../assets/heroes.json";
import { useState } from "react";
import { HeroResult } from "./components/HeroResult";


export default function Home() {

  const [selectedHeroes, setSelectedHeroes] = useState<Hero[]>([]);

  const selectHero = (hero: Hero) => {
    setSelectedHeroes((prev) => [...prev, hero]);
    console.log('selectedHeores: ', selectedHeroes);
  }

  const heroes: Hero[] = heroesData.map((h) => ({
    ...h,
    year: Number(h.year),
    intellect: Number(h.intellect),
    health: Number(h.health),
  }));

  const todayHero = heroes.find(
    (hero): hero is Hero => hero.id === "vynnset-iron-maiden"
  );

  if (!todayHero) {
    throw new Error("Today hero not found");
  }

  console.log(todayHero);


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
        justifyContent="center"
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

          {[...selectedHeroes].reverse().map((hero) => (
            <HeroResult
              key={hero.id}
              selectedHero={hero}
              heroToday={todayHero}
            />
          ))}
        </Stack>
      </Box>
    </Box>
  );
}