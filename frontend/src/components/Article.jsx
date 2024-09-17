import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import {
  Button,
  Box,
  Text,
  Link,
  VStack,
  HStack,
  Badge,
} from "@chakra-ui/react";
import { FaExternalLinkAlt } from "react-icons/fa";
import { BiDownvote, BiSolidUpvote } from "react-icons/bi";

const Article = ({ article }) => {
  const [upvotes, setUpvotes] = useState(article.upvotes);
  const [downvotes, setDownvotes] = useState(article.downvotes);
  const [hasVoted, setHasVoted] = useState(false);
  const [votedType, setVotedType] = useState(null);

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  useEffect(() => {
    const votedArticles =
      JSON.parse(localStorage.getItem("votedArticles")) || {};
    if (votedArticles[article._id]) {
      setHasVoted(true);
      setVotedType(votedArticles[article._id]);
    }
  }, [article._id]);

  const handleVote = async (type) => {
    if (hasVoted && votedType === type) return;

    try {
      const response = await axios.post("https://backend-mauve-seven.vercel.app/api/vote", {
        articleId: article._id,
        voteType: type,
      });

      if (response.data.message === "Vote recorded successfully") {
        if (type === "up") {
          setUpvotes(upvotes + 1);
          if (votedType === "down") {
            setDownvotes(downvotes - 1);
          }
        } else {
          setDownvotes(downvotes + 1);
          if (votedType === "up") {
            setUpvotes(upvotes - 1);
          }
        }

        const votedArticles =
          JSON.parse(localStorage.getItem("votedArticles")) || {};
        votedArticles[article._id] = type;
        localStorage.setItem("votedArticles", JSON.stringify(votedArticles));

        setHasVoted(true);
        setVotedType(type);
      }
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  return (
    <Box borderWidth="1px" borderRadius="lg" p={4} marginY={4}>
      <Text fontWeight="bold" color="gray.200" fontSize={24}>
        {article.title}
      </Text>

      <Badge colorScheme="yellow" fontSize="0.6em" mt={2} opacity={0.5}>
        Published on: {formatDate(article.publishedAt)}
      </Badge>

      <Text mt={2} color="gray.500" fontSize={16}>
        {article.description}
      </Text>

      <Link
        href={article.url}
        isExternal
        color="teal.500"
        mt={2}
        display="inline-flex"
        alignItems="center"
      >
        <HStack spacing={2}>
          <Text>Source</Text>
          <FaExternalLinkAlt />
        </HStack>
      </Link>

      <VStack spacing={4} align="start" mt={4}>
        <HStack>
          <Button
            colorScheme={votedType === "up" ? "blue" : "gray"}
            onClick={() => handleVote("up")}
            isDisabled={hasVoted && votedType === "down"}
          >
            <BiSolidUpvote />({upvotes})
          </Button>
          <Button
            colorScheme={votedType === "down" ? "blue" : "gray"}
            onClick={() => handleVote("down")}
            isDisabled={hasVoted && votedType === "up"}
          >
            <BiDownvote />({downvotes})
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

Article.propTypes = {
  article: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    url: PropTypes.string.isRequired,
    upvotes: PropTypes.number.isRequired,
    downvotes: PropTypes.number.isRequired,
    publishedAt: PropTypes.string.isRequired,
  }).isRequired,
};

export default Article;