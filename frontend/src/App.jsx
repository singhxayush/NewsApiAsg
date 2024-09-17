import { Box } from "@chakra-ui/react";
import ArticlesList from "./components/ArticlesList";
import { ChakraProvider } from "@chakra-ui/react";

function App() {
  return (
    <Box
      bgGradient="linear(to-b, gray.800, black)"
      minHeight="100vh"
      width="100%"
    >
      <ChakraProvider>
        <ArticlesList />
      </ChakraProvider>
    </Box>
  );
}

export default App;
