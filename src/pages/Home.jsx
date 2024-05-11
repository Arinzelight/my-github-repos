import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  VStack,
  Text,
  Link,
  Box,
  Badge,
  Button,
  useBreakpointValue,
} from "@chakra-ui/react";
import { motion } from "framer-motion";

export default function Home() {
  const [repos, setRepos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const response = await axios.get(
          "https://api.github.com/users/Arinzelight/repos"
        );
        setRepos(response.data);
      } catch (error) {
        console.error("Error fetching repositories:", error);
      }
    };

    fetchRepos();
  }, []);

  const totalPages = Math.ceil(repos.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRepos = repos.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Determine margin based on screen size
  const marginX = useBreakpointValue({ base: 4, lg: 28 });

  return (
    <VStack spacing={6} align="stretch" p={6} mx={marginX}>
      <Text fontSize="3xl" fontWeight="bold">
        My GitHub Repositories
      </Text>
      {currentRepos.length === 0 ? (
        <Text>Loading...</Text>
      ) : (
        currentRepos.map((repo) => (
          <motion.div
            key={repo.id}
            borderWidth="1px"
            borderRadius="md"
            boxShadow="md"
            borderColor="gray.400" // Adjust the border color here
            p={4}
            width={{ base: "50%", md: "100%" }}
            whileHover={{ scale: 1.023 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            minHeight="120px" // Set fixed height for container
          >
            <Box border="1px" borderRadius="md" borderColor="gray.400" p={4}>
              {" "}
              {/* Add border styles */}
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
          </motion.div>
        ))
      )}
      <motion.div
        className="pagination"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {Array.from({ length: totalPages }).map((_, index) => (
          <Button
            key={index}
            variant={currentPage === index + 1 ? "solid" : "outline"}
            colorScheme="blue"
            onClick={() => handlePageChange(index + 1)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            mx={1} // Add margin between buttons
          >
            {index + 1}
          </Button>
        ))}
      </motion.div>
    </VStack>
  );
}
