import React from "react";
import { Flex, Heading, Text, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export default function ErrorPage() {
  return (
    <Flex
      direction="column"
      justify="center"
      align="center"
      height="100vh"
      textAlign="center"
    >
      <Heading fontSize="6xl" color="red.500" mb={4}>
        404
      </Heading>
      <Text fontSize="2xl" mb={8}>
        Oops! Page not found.
      </Text>
      <Text fontSize="lg" mb={8}>
        The page you are looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </Text>
      <Button colorScheme="blue" as={Link} to="/">
        Go back to home
      </Button>
    </Flex>
  );
}
