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

type MatchStatus = "correct" | "partial" | "wrong";

type HeroField = {
    label: string;
    display: string;
    status: MatchStatus;
};

type HeroResultBoxProps = HeroField & { showLabel?: boolean };


export function HeroResultBox({ label, display, status, showLabel = true }: HeroResultBoxProps) {
    const bg = {
        correct: "green.500",
        partial: "orange.500",
        wrong: "#cb4d37",
    }[status];

    return (
        <Box
            display="grid"
            placeItems="center"
            w={{ base: "100px", md: "115px" }}
            h={{ base: "100px", md: "115px" }}
            bg={bg}
            color="#fff7ed"
            borderRadius="md"
        >
            {showLabel && (
                <Text fontSize={{ base: "0.7rem", md: "0.75rem" }} opacity={0.85}>
                    {label}
                </Text>
            )}

            <Text
                fontWeight="semibold"
                fontSize={{ base: "0.8rem", md: ".9rem" }}
                textAlign="center"
                px={2}
                lineHeight="1.15"
                whiteSpace="normal"
                wordBreak="break-word"
            >
                {display || "None"}
            </Text>
        </Box>
    );
}