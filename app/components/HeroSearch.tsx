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

export type Hero = {
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

type Props = {
    handleSelect: (hero: Hero) => void;
};


export function HeroSearch({ handleSelect }: Props) {
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

    function handleDropdownSelect(hero: Hero) {
        setSelectedHero(hero);
        setQuery(hero.name);
        setIsFocused(false);
        handleSelect(hero);
    }

    return (
        <Box maxW="480px" mx="auto" w="100%">
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
                                onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => {
                                    e.preventDefault();
                                }}
                                onClick={() => handleDropdownSelect(hero)}
                            >
                                <Text fontSize="sm" fontWeight="semibold">
                                    {hero.name}
                                </Text>
                            </Box>
                        ))}
                    </Box>
                )}
            </Box>
        </Box>
    );
}
