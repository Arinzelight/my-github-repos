import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import axios from "axios";
import {
  VStack,
  Text,
  Link,
  Box,
  Input,
  useBreakpointValue,
  Spinner,
  Button,
  Grid,
  GridItem,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input as ChakraInput,
  useToast,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from "@chakra-ui/react";
import { motion } from "framer-motion";

const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;
console.log(GITHUB_TOKEN);

export default function Home() {
  const [repos, setRepos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [repoName, setRepoName] = useState("");
  const [repoDescription, setRepoDescription] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    repoName: "",
  });

  const [editRepoDetails, setEditRepoDetails] = useState({
    isOpen: false,
    repoName: "",
    newName: "",
    newDescription: "",
  });

  const toast = useToast();

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const response = await axios.get("https://api.github.com/user/repos", {
          headers: {
            Authorization: `token ${GITHUB_TOKEN}`,
          },
        });
        setRepos(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching repositories:", error);
        setLoading(false);
      }
    };

    fetchRepos();
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleCreateRepo = async () => {
    try {
      const response = await axios.post(
        "https://api.github.com/user/repos",
        {
          name: repoName,
          description: repoDescription,
        },
        {
          headers: {
            Authorization: `token ${GITHUB_TOKEN}`,
          },
        }
      );
      setRepos([...repos, response.data]);
      onClose();
      toast({
        title: "Repository created.",
        description: `Repository ${repoName} has been created.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error creating repository:", error);
      toast({
        title: "Error creating repository.",
        description: "An error occurred while creating the repository.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDeleteRepo = async (repoName) => {
    try {
      // Instead of making a DELETE request to the GitHub API, simply update the local state
      setRepos(repos.filter((repo) => repo.name !== repoName));
      toast({
        title: "Repository deleted.",
        description: `Repository ${repoName} has been deleted locally.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error deleting repository:", error);
      toast({
        title: "Error deleting repository.",
        description: "An error occurred while deleting the repository.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };
  const handleDeleteConfirmation = (repoName) => {
    setDeleteConfirmation({ isOpen: true, repoName });
  };

  const handleConfirmDelete = () => {
    handleDeleteRepo(deleteConfirmation.repoName);
    setDeleteConfirmation({ isOpen: false, repoName: "" });
  };

  const handleCancelDelete = () => {
    setDeleteConfirmation({ isOpen: false, repoName: "" });
  };

  const handleEditRepo = (repoName, currentName, currentDescription) => {
    setEditRepoDetails({
      isOpen: true,
      repoName,
      newName: currentName,
      newDescription: currentDescription,
    });
  };

  // Function to update repository details
  const handleUpdateRepo = async () => {
    try {
      await axios.patch(
        `https://api.github.com/repos/Arinzelight/${editRepoDetails.repoName}`,
        {
          name: editRepoDetails.newName,
          description: editRepoDetails.newDescription,
        },
        {
          headers: {
            Authorization: `token ${GITHUB_TOKEN}`,
          },
        }
      );

      const updatedRepos = repos.map((repo) => {
        if (repo.name === editRepoDetails.repoName) {
          return {
            ...repo,
            name: editRepoDetails.newName,
            description: editRepoDetails.newDescription,
          };
        }
        return repo;
      });
      setRepos(updatedRepos);
      onClose();
      toast({
        title: "Repository updated.",
        description: `Repository ${editRepoDetails.repoName} has been updated.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error updating repository:", error);
      toast({
        title: "Error updating repository.",
        description: "An error occurred while updating the repository.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const filteredRepos = searchQuery
    ? repos.filter((repo) =>
        repo.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : repos;

  const totalPages = Math.ceil(filteredRepos.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRepos = filteredRepos.slice(startIndex, endIndex);

  // Determine margin based on screen size
  const marginX = useBreakpointValue({ base: -3, lg: 28 });

  return (
    <VStack
      spacing={6}
      align="stretch"
      p={6}
      mx={marginX}
      bg="white"
      minHeight="100vh"
      color="white"
    >
      <Box
        p={6}
        bg="white"
        color="black"
        borderRadius="md"
        boxShadow="xl"
        width="100%"
      >
        <Text fontSize="3xl" fontWeight="bolder">
          My GitHub Repositories
        </Text>
        <Input
          placeholder="Search repositories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          bg="white"
          color="black"
        />
        <Button onClick={onOpen} mt={4} colorScheme="blue">
          Create New Repo
        </Button>
        {loading && (
          <Box w="100%" textAlign="center" color="blue.500">
            <Text>Loading...</Text>
            <Spinner size="md" />
          </Box>
        )}

        {!loading && (
          <>
            <Grid
              templateColumns="repeat(auto-fit, minmax(300px, 1fr))"
              gap={6}
              mt={6}
            >
              {currentRepos.map((repo) => (
                <GridItem
                  key={repo.id}
                  as={motion.div}
                  borderWidth="1px"
                  borderRadius="md"
                  boxShadow="md"
                  borderColor="gray.100"
                  bg="white"
                  p={6}
                  whileHover={{ scale: 1.009 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Link
                    as={RouterLink}
                    to={`/repo/${repo.name}`}
                    style={{ textDecoration: "none" }}
                  >
                    <Box
                      border="1px"
                      borderRadius="md"
                      borderColor="gray.400"
                      p={4}
                      bg="white"
                      color="black"
                    >
                      <Text fontWeight="bold" fontSize="xl" color="blue.500">
                        {repo.name}
                      </Text>
                    </Box>
                  </Link>
                  <Button
                    colorScheme="gray"
                    size="sm"
                    mt={2}
                    onClick={() => handleDeleteConfirmation(repo.name)} // Modify this line
                  >
                    Delete
                  </Button>

                  <Button
                    colorScheme="teal"
                    size="sm"
                    mt={2}
                    onClick={() =>
                      handleEditRepo(repo.name, repo.name, repo.description)
                    }
                  >
                    Update
                  </Button>
                </GridItem>
              ))}
            </Grid>
            <Box mt={6} display="flex" justifyContent="center">
              {Array.from({ length: totalPages }).map((_, index) => (
                <Button
                  key={index}
                  variant={currentPage === index + 1 ? "solid" : "outline"}
                  colorScheme="blue"
                  onClick={() => handlePageChange(index + 1)}
                  mx={1}
                >
                  {index + 1}
                </Button>
              ))}
            </Box>
          </>
        )}
      </Box>
      <AlertDialog
        isOpen={deleteConfirmation.isOpen}
        leastDestructiveRef={undefined}
        onClose={handleCancelDelete}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Repository
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete the repository{" "}
              <strong>{deleteConfirmation.repoName}</strong>?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button onClick={handleCancelDelete}>Cancel</Button>
              <Button colorScheme="red" onClick={handleConfirmDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Repository</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Repository Name</FormLabel>
              <ChakraInput
                placeholder="Repository Name"
                value={repoName}
                onChange={(e) => setRepoName(e.target.value)}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Description</FormLabel>
              <ChakraInput
                placeholder="Description"
                value={repoDescription}
                onChange={(e) => setRepoDescription(e.target.value)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleCreateRepo}>
              Create
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={editRepoDetails.isOpen}
        onClose={() =>
          setEditRepoDetails({ ...editRepoDetails, isOpen: false })
        }
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Repository</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Repository Name</FormLabel>
              <ChakraInput
                placeholder="Repository Name"
                value={editRepoDetails.newName}
                onChange={(e) =>
                  setEditRepoDetails({
                    ...editRepoDetails,
                    newName: e.target.value,
                  })
                }
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Description</FormLabel>
              <ChakraInput
                placeholder="Description"
                value={editRepoDetails.newDescription}
                onChange={(e) =>
                  setEditRepoDetails({
                    ...editRepoDetails,
                    newDescription: e.target.value,
                  })
                }
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleUpdateRepo}>
              Update
            </Button>
            <Button
              variant="ghost"
              onClick={() =>
                setEditRepoDetails({ ...editRepoDetails, isOpen: false })
              }
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
}
