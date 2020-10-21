import React from 'react';
import Topic from "../Topic/Topic";
import useTopics from "/Users/cwefso/projects/debatable-practice/src/hooks/useTopics.js";

const Board = ({topic, piece}) => {

  // Create the 3 x 3 board


  return <div><Topic topic={topic} piece={piece}/></div>;
}

export default Board;
