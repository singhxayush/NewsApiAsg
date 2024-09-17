import { useEffect, useState } from "react";
import axios from "axios";
import Article from "./Article";
import {
  Box,
  Button,
  Container,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  HStack,
} from "@chakra-ui/react";
import { FaChevronDown, FaTrash } from "react-icons/fa";
import "./ArticlesList.css";

const ArticlesList = () => {
  const [articles, setArticles] = useState([]);
  const [sortBy, setSortBy] = useState(() => {
    return localStorage.getItem("sortPreference") || "Upvotes";
  });

  const handleSortChange = (sortOption) => {
    setSortBy(sortOption);

    localStorage.setItem("sortPreference", sortOption);
  };

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/fetch`);
        setArticles(response.data);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };

    fetchArticles();
  }, []);

  const sortedArticles = [...articles].sort((a, b) => {
    if (sortBy === "Upvotes") {
      return b.upvotes - a.upvotes;
    } else if (sortBy === "Downvotes") {
      return b.downvotes - a.downvotes;
    } else if (sortBy === "Latest") {
      return new Date(b.publishedAt) - new Date(a.publishedAt);
    } else if (sortBy === "Oldest") {
      return new Date(a.publishedAt) - new Date(b.publishedAt);
    }
    return 0;
  });

  const clearCache = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div>
      {articles.length > 0 && (
        <HStack
          spacing={4}
          position="fixed"
          bottom="20px"
          left="20px"
          zIndex={1}
          width="100%"
          justify="space-between"
        >
          <Box>
            <Button
              colorScheme="red"
              onClick={clearCache}
              leftIcon={<FaTrash />}
              width="220px"
            >
              Clear Cache
            </Button>
          </Box>

          <Box position="fixed" right="20px">
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<FaChevronDown />}
                width="220px"
              >
                Sort by: {sortBy}
              </MenuButton>
              <MenuList>
                <MenuItem onClick={() => handleSortChange("Upvotes")}>
                  Upvotes
                </MenuItem>
                <MenuItem onClick={() => handleSortChange("Downvotes")}>
                  Downvotes
                </MenuItem>
                <MenuItem onClick={() => handleSortChange("Latest")}>
                  Latest
                </MenuItem>
                <MenuItem onClick={() => handleSortChange("Oldest")}>
                  Oldest
                </MenuItem>
              </MenuList>
            </Menu>
          </Box>
        </HStack>
      )}

      <Container className="articles-list" maxW="container.md" pb={80}>
        {sortedArticles.map((article) => (
          <Article key={article._id} article={article} />
        ))}
      </Container>
    </div>
  );
};

export default ArticlesList;
