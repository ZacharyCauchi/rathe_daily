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

export function HeroResultBox({ label, display, status }: HeroField) {
    const bg = {
        correct: "green.400",
        partial: "orange.400",
        wrong: "red.400",
    }[status];

    return (
        <Box
            display="grid"
            placeItems="center"
            w="100px"
            h="100px"
            bg={bg}
            color="white"
            borderRadius="md"
        >
            <Text fontSize="s">{label}</Text>
            <Text fontWeight="semibold" fontSize="xs">{display}</Text>
        </Box>
    );
}
