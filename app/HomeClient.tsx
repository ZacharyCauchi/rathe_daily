"use client";

import { Box, Heading, Stack } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import JSConfetti from "js-confetti";
import { Analytics } from "@vercel/analytics/next";

import { HeroSearch, Hero } from "./components/HeroSearch";
import { HeroResult } from "./components/HeroResult";
import { HeroResultHeader } from "./components/HeroResultHeader";
import NextLink from "next/link";
import { HStack, Link, Text } from "@chakra-ui/react";

export default function HomeClient({
    heroes,
    todayHero,
}: {
    heroes: Hero[];
    todayHero: Hero;
}) {
    const STORAGE_KEY_BASE = "rathe_selectedHeroes_v1";
    const EXPIRY_MS = 24 * 60 * 60 * 1000;

    const storageKeyForDay = `${STORAGE_KEY_BASE}_${todayHero.id}`;

    const [selectedHeroes, setSelectedHeroes] = useState<Hero[]>([]);

    const jsConfettiRef = useRef<JSConfetti | null>(null);
    const [gameComplete, setGameComplete] = useState<boolean>(false);

    useEffect(() => {
        if (typeof window === "undefined") return;

        try {
            const raw = localStorage.getItem(storageKeyForDay);
            if (!raw) return;

            const parsed = JSON.parse(raw) as { heroes: Hero[]; ts: number };
            if (Date.now() - parsed.ts < EXPIRY_MS) {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setSelectedHeroes(parsed.heroes || []);
            } else {
                localStorage.removeItem(storageKeyForDay);
            }
        } catch {
            localStorage.removeItem(storageKeyForDay);
        }
    }, [storageKeyForDay]);

    useEffect(() => {
        jsConfettiRef.current = new JSConfetti();
    }, []);

    useEffect(() => {
        try {
            if (selectedHeroes.length === 0) {
                localStorage.removeItem(storageKeyForDay);
                return;
            }
            const payload = { heroes: selectedHeroes, ts: Date.now() };
            localStorage.setItem(storageKeyForDay, JSON.stringify(payload));
        } catch (e) {
            // ignore storage errors
        }
    }, [selectedHeroes, storageKeyForDay]);

    const selectHero = (hero: Hero) => {
        setSelectedHeroes((prev) => [...prev, hero]);
        if (hero.id === todayHero.id) {
            jsConfettiRef.current?.addConfetti();
            setGameComplete(true);
        }
    };

    return (
        <Box minH="100vh" bg="zinc.50" display="flex" alignItems="center" justifyContent="center" backgroundImage="url('compendium_bg.jpg')" backgroundPosition="center" backgroundRepeat="no-repeat" backgroundSize="cover" backgroundAttachment="fixed">
            <Box h="100%" minH="100vh" bg="rgba(255,255,255,0.85)" _dark={{ bg: "rgba(0,0,0,0.65)" }} w="100%" backdropFilter="blur(4px)" display="flex" flexDir="column" alignItems={{ base: "center", sm: "center" }} justifyContent="flex-start" >
                <Analytics />
                <Box as="main" w="full" h="100%" minH="100vh" maxW="6xl" display="flex" flexDir="column" alignItems={{ base: "center", sm: "center" }} justifyContent="space-between" py={32} pb={0} px={16}>
                    <Box display="flex" flexDir="column">
                        <Stack align={{ base: "center", sm: "flex-start" }} textAlign="center">
                            <Heading as="h1" width="100%" fontSize="3xl" fontWeight="bold" lineHeight="2.5rem" letterSpacing="-0.03em" color="black" _dark={{ color: "zinc.50" }}>
                                Fabdle
                            </Heading>

                            <Heading as="h3" width="100%" fontSize="1xl" fontWeight="400" lineHeight="1.5rem" letterSpacing="-0.03em" color="black" _dark={{ color: "zinc.50" }}>
                                Guess a Flesh and Blood Hero. Deduce todays hero by process of elimination.
                            </Heading>

                            <HeroSearch handleSelect={selectHero} disabled={gameComplete} />
                            <Stack>

                                <Stack overflowX="auto">
                                    <HeroResultHeader />
                                    {[...selectedHeroes].reverse().map((hero, idx) => (
                                        <HeroResult
                                            key={`${hero.id}_${idx}`}
                                            selectedHero={hero}
                                            heroToday={todayHero}
                                        />
                                    ))}
                                </Stack>
                            </Stack>
                        </Stack>
                    </Box>
                    <Box py={6}>
                        <HStack
                            mt={8}
                            w="full"
                            justify="center"
                            spacing={2}
                            fontSize="sm"
                            color="blackAlpha.700"
                            _dark={{ color: "whiteAlpha.700" }}
                        >
                            <Text>Made by @thatzachary</Text>
                            <Text>·</Text>
                            <Link
                                as={NextLink}
                                href="https://bsky.app/profile/thatzachary.bsky.social"
                                isExternal
                                textDecoration="underline"
                                _hover={{ opacity: 1 }}
                                opacity={0.85}
                            >
                                Bluesky
                            </Link>
                        </HStack>
                    </Box>
                </Box>
            </Box>
        </Box >
    );
}
