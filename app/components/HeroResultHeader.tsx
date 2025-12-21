import { Box, Text } from "@chakra-ui/react";

const labels = ["Hero", "Year", "Region", "Talents", "Classes", "Intellect", "Health"];

export const RESULT_GRID_PROPS = {
    display: "grid",
    gridTemplateColumns: {
        base: "repeat(7, 100px)",
        md: "repeat(7, 115px)",
    },
    gap: "8px",
    maxW: "90vw",
} as const;


export function HeroResultHeader() {
    return (
        <Box maxW="90vw">
            <Box
                w="max-content"
                display="grid"
                gridTemplateColumns={{ base: "repeat(7, 100px)", md: "repeat(7, 115px)" }}
                gap="8px"
                py={2}
                bg="rgba(255,255,255,0.75)"
                backdropFilter="blur(6px)"
                _dark={{ bg: "rgba(0,0,0,0.45)" }}
                borderRadius="md"
            >
                {labels.map((label) => (
                    <Box
                        key={label}
                        display="grid"
                        placeItems="center"
                        w={{ base: "100px", md: "115px" }}
                        h={{ base: "32px", md: "36px" }}
                        borderRadius="md"
                    >
                        <Text
                            fontSize={{ base: "0.7rem", md: "0.75rem" }}
                            fontWeight="700"
                            letterSpacing="0.06em"
                            textTransform="uppercase"
                            color="blackAlpha.700"
                            _dark={{ color: "whiteAlpha.700" }}
                        >
                            {label}
                        </Text>
                    </Box>
                ))}
            </Box>
        </Box>
    );
}
