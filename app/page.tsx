import { Box, Heading, Text, Stack } from "@chakra-ui/react";
import { HeroSearch } from "./components/HeroSearch";

export default function Home() {
  return (
    <Box
      minH="100vh"
      bg="zinc.50"
      _dark={{ bg: "black" }}
      fontFamily="system"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        as="main"
        minH="100vh"
        w="full"
        maxW="3xl"
        display="flex"
        flexDir="column"
        alignItems={{ base: "center", sm: "flex-start" }}
        justifyContent="space-between"
        py={32}
        px={16}
        bg="white"
        _dark={{ bg: "black" }}
      >
        <Stack
          align={{ base: "center", sm: "flex-start" }}
          textAlign={{ base: "center", sm: "left" }}
        >
          <Heading
            as="h1"
            maxW="xs"
            fontSize="3xl"
            fontWeight="semibold"
            lineHeight="2.5rem"
            letterSpacing="-0.03em"
            color="black"
            _dark={{ color: "zinc.50" }}
          >
            Hello World
          </Heading>

          <Text
            maxW="md"
            fontSize="lg"
            lineHeight="2rem"
            color="zinc.600"
            _dark={{ color: "zinc.400" }}
          >
            Guess a Flesh and Blood Hero. Deduce todays hero by process of
            elimination.
          </Text>

          <HeroSearch />
        </Stack>
      </Box>
    </Box>
  );
}