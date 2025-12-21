import { useMemo, useState } from "react";
import {
    Box,
    Input,
    Card,
    Text,
    VStack,
    Image
} from "@chakra-ui/react";
import heroesData from "../../assets/heroes.json";
import { HeroResultBox } from "./HeroResultBox";
import { RESULT_GRID_PROPS } from "./HeroResultHeader";

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

type Props = {
    selectedHero: Hero;
    heroToday: Hero;
};

type MatchStatus = "correct" | "partial" | "wrong";

type HeroField = {
    label: string;
    display: string;
    status: MatchStatus;
};

export function HeroResult({ selectedHero, heroToday }: Props) {

    function arraysStatus(a: string[], b: string[]): MatchStatus {
        const aSet = new Set(a);
        const bSet = new Set(b);

        if (aSet.size === 0 && bSet.size === 0) return "correct";

        const intersection = [...aSet].filter((x) => bSet.has(x)).length;

        if (intersection === 0) return "wrong";
        if (intersection === aSet.size && intersection === bSet.size) return "correct";
        return "partial";
    }

    const fields: HeroField[] = [
        {
            label: "Year",
            display: String(selectedHero.year),
            status: selectedHero.year === heroToday.year ? "correct" : "wrong",
        },
        {
            label: "Region",
            display: selectedHero.region,
            status: selectedHero.region === heroToday.region ? "correct" : "wrong",
        },
        {
            label: "Talents",
            display: selectedHero.talents.join(" "),
            status: arraysStatus(selectedHero.talents, heroToday.talents),
        },
        {
            label: "Classes",
            display: selectedHero.classes.join(" "),
            status: arraysStatus(selectedHero.classes, heroToday.classes),
        },
        {
            label: "Intellect",
            display: String(selectedHero.intellect),
            status: selectedHero.intellect === heroToday.intellect ? "correct" : "wrong",
        },
        {
            label: "Health",
            display: String(selectedHero.health),
            status: selectedHero.health === heroToday.health ? "correct" : "wrong",
        },
    ];

    return (
        <Box {...RESULT_GRID_PROPS}>
            <Image
                src={`/avatars/${selectedHero.id}.webp`}
                alt={selectedHero.name}
                w={{ base: "100px", md: "115px" }}
                h={{ base: "100px", md: "115px" }}
                borderRadius="md"
            ></Image>
            {fields.map((f) => (
                <HeroResultBox key={f.label} {...f} showLabel={false} />
            ))}
        </Box>
    );
}
