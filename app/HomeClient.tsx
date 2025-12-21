"use client";

import { Box, Heading, Stack } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import JSConfetti from "js-confetti";
import { Analytics } from "@vercel/analytics/next";

import { HeroSearch, Hero } from "./components/HeroSearch";
import { HeroResult } from "./components/HeroResult";

export default function HomeClient({
    heroes,
    todayHero,
}: {
    heroes: Hero[];
    todayHero: Hero;
}) {
    const [selectedHeroes, setSelectedHeroes] = useState<Hero[]>([]);
    const jsConfettiRef = useRef<JSConfetti | null>(null);

    useEffect(() => {
        jsConfettiRef.current = new JSConfetti();
    }, []);

    const selectHero = (hero: Hero) => {
        setSelectedHeroes((prev) => [...prev, hero]);
        if (hero.id === todayHero.id) {
            jsConfettiRef.current?.addConfetti();
        }
    };

    return (
        <Box minH="100vh" bg="zinc.50" _dark={{ bg: "black" }} display="flex" alignItems="center" justifyContent="center">
            <Analytics />
            <Box as="main" minH="100vh" w="full" maxW="6xl" display="flex" flexDir="column" alignItems={{ base: "center", sm: "center" }} justifyContent="flex-start" py={32} px={16} bg="white" _dark={{ bg: "black" }}>
                <Stack align={{ base: "center", sm: "flex-start" }} textAlign="center">
                    <Heading as="h1" width="100%" fontSize="3xl" fontWeight="bold" lineHeight="2.5rem" letterSpacing="-0.03em" color="black" _dark={{ color: "zinc.50" }}>
                        Rathedle
                    </Heading>

                    <Heading as="h3" width="100%" fontSize="1xl" fontWeight="400" lineHeight="1.5rem" letterSpacing="-0.03em" color="black" _dark={{ color: "zinc.50" }}>
                        Guess a Flesh and Blood Hero. Deduce todays hero by process of elimination.
                    </Heading>

                    <HeroSearch handleSelect={selectHero} />
                    <Stack>
                        {[...selectedHeroes].reverse().map((hero, idx) => (
                            <HeroResult key={`${hero.id}_${idx}`} selectedHero={hero} heroToday={todayHero} />
                        ))}
                    </Stack>
                </Stack>
            </Box>
        </Box>
    );
}
