import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { VStack, Text, Link, Box, Badge, Spinner } from "@chakra-ui/react";

export default function RepoDetailPage() {
  const { repoName } = useParams();
  const [repo, setRepo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRepo = async () => {
      try {
        const response = await axios.get(
          `https://api.github.com/repos/Arinzelight/${repoName}`
        );
        setRepo(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching repository:", error);
        setLoading(false);
      }
    };

    fetchRepo();
  }, [repoName]);

  return (
    <VStack
      spacing={6}
      align="stretch"
      p={6}
      bgSize="cover"
      minHeight="100vh"
      color="white"
    >
      <Box p={6} bg="white" borderRadius="md" boxShadow="xl" width="100%">
        <Text fontSize="3xl" fontWeight="bold" color="black">
          Repository Detail
        </Text>
        {loading ? (
          <Box w="100%" textAlign="center">
            <Text>Loading...</Text>
            <Spinner size="md" />
          </Box>
        ) : repo ? (
          <Box
            borderWidth="1px"
            borderRadius="md"
            boxShadow="lg"
            borderColor="gray.300"
            p={4}
            width="100%"
            bg="white"
            color="gray.800"
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
            <Box mt={2}>
              <Text fontSize="md" color="gray.600">
                <strong>Forks:</strong> {repo.forks_count}
              </Text>
              <Text fontSize="md" color="gray.600">
                <strong>Stars:</strong> {repo.stargazers_count}
              </Text>
              <Text fontSize="md" color="gray.600">
                <strong>Watchers:</strong> {repo.watchers_count}
              </Text>
              <Text fontSize="md" color="gray.600">
                <strong>Open Issues:</strong> {repo.open_issues_count}
              </Text>
            </Box>
          </Box>
        ) : (
          <Text>Error loading repository details</Text>
        )}
      </Box>
    </VStack>
  );
}
