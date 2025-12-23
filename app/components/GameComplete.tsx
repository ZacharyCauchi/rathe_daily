"use client";

import { useEffect, useMemo, useState } from "react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Text,
    VStack,
    Button,
    Box,
    useToast,
} from "@chakra-ui/react";
import { Hero } from "./HeroResult";
import { FiShare2 } from "react-icons/fi";


type GameCompleteProps = {
    selectedHeroes: Hero[];
    todayHero: Hero;
    dialogOpen: boolean;
    closeDialog: () => void;
};

type Tile = "correct" | "partial" | "wrong";

const EMOJI: Record<Tile, string> = {
    correct: "🟩",
    partial: "🟨",
    wrong: "⬛",
};

const sameSet = (a: string[], b: string[]) => {
    if (a.length !== b.length) return false;
    return a.every((x) => b.includes(x));
};

const anyOverlap = (a: string[], b: string[]) =>
    a.some((x) => b.includes(x));

const compareValue = (guess: unknown, target: unknown): Tile => {
    if (Array.isArray(guess) && Array.isArray(target)) {
        return sameSet(guess, target)
            ? "correct"
            : anyOverlap(guess, target)
                ? "partial"
                : "wrong";
    }

    return guess === target ? "correct" : "wrong";
};

function heroToEmojiRow(guess: Hero, target: Hero) {
    const tiles: Tile[] = [
        compareValue(guess.year, target.year),
        compareValue(guess.region, target.region),
        compareValue(guess.set, target.set),
        compareValue(guess.talents, target.talents),
        compareValue(guess.classes, target.classes),
        compareValue(guess.intellect, target.intellect),
        compareValue(guess.health, target.health),
    ];

    return tiles.map((t) => EMOJI[t]).join("");
}

const buildShareText = (opts: {
    guesses: Hero[];
    todayHero: Hero;
}) => {
    const { guesses, todayHero } = opts;

    const dateUtc = new Date().toISOString().slice(0, 10);
    const grid = guesses.map((g) => heroToEmojiRow(g, todayHero)).join("\n");

    return `Fabdle ${dateUtc}

${grid}`;
}

function msUntilNextUtcMidnight(now = new Date()) {
    const next = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0, 0)
    );
    return next.getTime() - now.getTime();
}

function formatHMS(ms: number) {
    const total = Math.max(0, Math.floor(ms / 1000));
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

export function GameComplete({ selectedHeroes, dialogOpen, closeDialog, todayHero }: GameCompleteProps) {
    const [msLeft, setMsLeft] = useState(() => msUntilNextUtcMidnight());
    const toast = useToast();

    useEffect(() => {
        if (!dialogOpen) return;

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMsLeft(msUntilNextUtcMidnight());

        const id = window.setInterval(() => {
            setMsLeft(msUntilNextUtcMidnight());
        }, 1000);

        return () => window.clearInterval(id);
    }, [dialogOpen]);

    const timeText = useMemo(() => formatHMS(msLeft), [msLeft]);

    const shareResults = (selectedHeroes: Hero[]) => {
        const text = buildShareText({
            guesses: selectedHeroes,
            todayHero,
        })
        navigator.clipboard.writeText(text);
        toast({
            title: "Copied to Clipboard",
            duration: 2000,
            position: "bottom",
            render: () => (
                <Box
                    bg="#333"
                    color="white"
                    px={4}
                    py={3}
                    borderRadius="md"
                    boxShadow="lg"
                    textAlign="center"
                    fontWeight="semibold"
                    letterSpacing="wide"
                >
                    Copied to Clipboard
                </Box>
            ),
        });
    };

    return (
        <Modal isOpen={dialogOpen} onClose={closeDialog} isCentered>
            <ModalOverlay />
            <ModalContent margin="20px">
                <ModalHeader fontSize="3xl" textAlign="center">Congratulations!</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack spacing={2} align="stretch">
                        <Text textAlign="center" fontSize="1xl">
                            You solved for today&apos;s hero in <b>{selectedHeroes.length}</b> guesses
                        </Text>
                        <Text textAlign="center" fontSize="1xl" opacity={0.8}>
                            Next hero in <b>{timeText}</b>
                        </Text>
                        <Button colorScheme='blue' onClick={() => shareResults(selectedHeroes)} mt="8px">Share Results <Box ml="4px"><FiShare2 /></Box></Button>
                    </VStack>
                </ModalBody>
                <ModalFooter />
            </ModalContent >
        </Modal >
    );
}
