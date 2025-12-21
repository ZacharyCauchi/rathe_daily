"use client";

import { useMemo, useState } from "react";
import {
    Box,
    Input,
    Card,
    Text,
    VStack,
} from "@chakra-ui/react";
import NextImage from "next/image";
import { Image as ChakraImage } from "@chakra-ui/react";
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

    const results = () => {
        const q = query.trim().toLowerCase();
        console.log('q: ', q);
        if (!q) return [];

        return heroes
            .filter((h) => {
                const name = h.name.toLowerCase();

                return (
                    name.includes(q)
                );
            })
            .slice(0, 10);
    }

    function handleDropdownSelect(hero: Hero) {
        setSelectedHero(hero);
        setQuery("");
        setIsFocused(false);
        handleSelect(hero);
    }

    return (
        <Box maxW="480px" mx="auto" w="100%" mb="8px">
            <Box position="relative">
                <Input
                    backgroundColor="#fff"
                    value={query}
                    placeholder="Type a hero name..."
                    size="sm"
                    fontSize="16px"
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setSelectedHero(null);
                        setIsFocused(true);
                    }}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => {
                        setIsFocused(false);
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
                        {results().length === 0 && (
                            <Box px={3} py={2}>
                                <Text fontSize="sm" color="gray.500">
                                    No results
                                </Text>
                            </Box>
                        )}

                        {results().map((hero) => (
                            <Box
                                key={hero.id}
                                as="button"
                                w="100%"
                                textAlign="left"
                                px={3}
                                py={2}
                                _hover={{ bg: "gray.100" }}
                                _focus={{ outline: "none", bg: "gray.100" }}
                                onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => {
                                    e.preventDefault();
                                }}
                                onClick={() => handleDropdownSelect(hero)}
                                display='flex'
                                justifyContent='flex-start'
                                alignItems='center'
                            >
                                <ChakraImage
                                    src={'/avatars/' + hero.id + '.webp'}
                                    alt={hero.name + ' avatar'}
                                    width="40px"
                                    height="40px"
                                    display='inline-block'
                                    mr='8px'
                                    loading="lazy"
                                    decoding="async"
                                    fallbackSrc="/fallback.png" />
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
