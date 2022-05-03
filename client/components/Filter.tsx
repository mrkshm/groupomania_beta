import { Flex, Button } from "@chakra-ui/react";
import React from "react";
import { Trophy, BubbleStar, Flower } from "iconoir-react";

function Filter({ setSortOptions }: any) {
  const commentDesc = () =>
    setSortOptions((a, b) => (a.commentCount > b.commentCount ? -1 : 1));
  const voteDesc = () =>
    setSortOptions((a, b) => (a.voteScore > b.voteScore ? -1 : 1));
  const dateDesc = () => setSortOptions(null);
  return (
    <Flex gap={8} my={8}>
      <Button onClick={voteDesc} variant="ghost" leftIcon={<Trophy />}>
        Meilleur
      </Button>
      <Button onClick={commentDesc} variant="ghost" leftIcon={<BubbleStar />}>
        Populaire
      </Button>
      <Button onClick={dateDesc} variant="ghost" leftIcon={<Flower />}>
        Nouveau
      </Button>
    </Flex>
  );
}

export default Filter;
