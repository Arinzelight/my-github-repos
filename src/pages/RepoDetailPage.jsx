import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { VStack, Text, Link, Box, Badge } from "@chakra-ui/react";

export default function RepoDetailPage() {
  const { repoName } = useParams();
  const [repo, setRepo] = useState(null);

  useEffect(() => {
    const fetchRepo = async () => {
      try {
        const response = await axios.get(
          `https://api.github.com/repos/Arinzelight/${repoName}`
        );
        setRepo(response.data);
      } catch (error) {
        console.error("Error fetching repository:", error);
      }
    };

    fetchRepo();
  }, [repoName]);

  return (
    <VStack spacing={6} align="stretch" p={6}>
      <Text fontSize="3xl" fontWeight="bold">
        Repository Detail
      </Text>
      {repo ? (
        <Box
          borderWidth="1px"
          borderRadius="md"
          boxShadow="md"
          borderColor="gray.400"
          p={4}
          width="100%"
        >
          <Link
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            fontWeight="bold"
            fontSize="xl"
            color="blue.500"
          >
            {repo.name}
          </Link>
          <Text mt={2} color="gray.600">
            {repo.description}
          </Text>
          <Box mt={2}>
            <Badge colorScheme="green" mr={2}>
              {repo.language}
            </Badge>
            <Text fontSize="sm" color="gray.500">
              Last updated: {new Date(repo.updated_at).toLocaleDateString()}
            </Text>
          </Box>
        </Box>
      ) : (
        <Text>Loading...</Text>
      )}
    </VStack>
  );
}
