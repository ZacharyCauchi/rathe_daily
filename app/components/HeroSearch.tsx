"use client";

import { useMemo, useState } from "react";
import {
    Box,
    Input,
    Card,
    Text,
    VStack,
} from "@chakra-ui/react";
import heroesData from "../../assets/heroes.json";

type Hero = {
    id: string;
    name: string;
    year: number;
    region: string;
    set: string;
    talents: string[];
    classes: string[];
    intellect: number;
    health: number;
};

const heroes: Hero[] = heroesData.map((h) => ({
    ...h,
    year: Number(h.year),
    intellect: Number(h.intellect),
    health: Number(h.health),
}));
export function HeroSearch() {
    const [query, setQuery] = useState("");
    const [selectedHero, setSelectedHero] = useState<Hero | null>(null);
    const [isFocused, setIsFocused] = useState(false);

    const results = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return [];

        return heroes
            .filter((h) => {
                const name = h.name.toLowerCase();
                const id = h.id.toLowerCase();
                const region = h.region.toLowerCase();
                const classes = h.classes.map((c) => c.toLowerCase());
                const talents = h.talents.map((t) => t.toLowerCase());

                return (
                    name.includes(q) ||
                    id.includes(q) ||
                    region.includes(q) ||
                    classes.some((c) => c.includes(q)) ||
                    talents.some((t) => t.includes(q))
                );
            })
            .slice(0, 10);
    }, [query]);

    function handleSelect(hero: Hero) {
        setSelectedHero(hero);
        setQuery(hero.name);
        setIsFocused(false);
    }

    return (
        <Box maxW="480px" mx="auto">
            <Box position="relative">
                <Input
                    value={query}
                    placeholder="Search hero by name, id, class, region…"
                    size="sm"
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setSelectedHero(null);
                    }}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => {
                        // let click on dropdown item register first
                        setTimeout(() => setIsFocused(false), 150);
                    }}
                />

                {isFocused && query.trim() && (
                    <Box
                        position="absolute"
                        top="100%"
                        left={0}
                        right={0}
                        mt={1}
                        bg="white"
                        borderWidth="1px"
                        borderRadius="md"
                        boxShadow="sm"
                        maxH="260px"
                        overflowY="auto"
                        zIndex={10}
                    >
                        {results.length === 0 && (
                            <Box px={3} py={2}>
                                <Text fontSize="sm" color="gray.500">
                                    No results
                                </Text>
                            </Box>
                        )}

                        {results.map((hero) => (
                            <Box
                                key={hero.id}
                                as="button"
                                w="100%"
                                textAlign="left"
                                px={3}
                                py={2}
                                _hover={{ bg: "gray.50" }}
                                _focus={{ outline: "none", bg: "gray.50" }}
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => handleSelect(hero)}
                            >
                                <Text fontSize="sm" fontWeight="semibold">
                                    {hero.name}
                                </Text>
                            </Box>
                        ))}
                    </Box>
                )}
            </Box>

            {selectedHero && (
                <Card.Root mt={4} size="sm">
                    <Card.Body>
                        <VStack align="flex-start" gap={1}>
                            <Box>
                                <Text fontSize="lg" fontWeight="bold">
                                    {selectedHero.name}
                                </Text>
                                <Text fontSize="xs" color="gray.500">
                                    {selectedHero.id}
                                </Text>
                            </Box>

                            <Text fontSize="sm">
                                <Text as="span" fontWeight="semibold">
                                    Year:
                                </Text>{" "}
                                {selectedHero.year} ·{" "}
                                <Text as="span" fontWeight="semibold">
                                    Set:
                                </Text>{" "}
                                {selectedHero.set}
                            </Text>

                            <Text fontSize="sm">
                                <Text as="span" fontWeight="semibold">
                                    Region:
                                </Text>{" "}
                                {selectedHero.region}
                            </Text>

                            <Text fontSize="sm">
                                <Text as="span" fontWeight="semibold">
                                    Classes:
                                </Text>{" "}
                                {selectedHero.classes.join(", ") || "—"}
                            </Text>

                            <Text fontSize="sm">
                                <Text as="span" fontWeight="semibold">
                                    Talents:
                                </Text>{" "}
                                {selectedHero.talents.join(", ") || "—"}
                            </Text>

                            <Text fontSize="sm">
                                <Text as="span" fontWeight="semibold">
                                    Intellect / Health:
                                </Text>{" "}
                                {selectedHero.intellect} / {selectedHero.health}
                            </Text>
                        </VStack>
                    </Card.Body>
                </Card.Root>
            )}
        </Box>
    );
}
