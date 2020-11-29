import React from "react";
import styled from "styled-components";

const CardContainer = styled.div`
  //   min-height: 150px;
  margin: 0 8px 8px 0;
  margin: ${({ gutterSize }) => `0 ${gutterSize}px ${gutterSize}px 0`};
  width: ${(props) => `calc(${100 / props.numCols}% - ${props.gutterSize}px)`};
  background-color: #0085ff;
  color: #fff;
  padding: 24px 16px 16px;
  border-radius: 16px;
  box-sizing: border-box;
  ${({ numCols }) => {
    let res = "";
    for (let i = 1; i <= numCols; i++) {
      res += `&:nth-of-type(${numCols}n + ${i}) { order: ${i}; }`;
    }
    return res;
  }}
`;

const Card = ({ item, gutterSize, numCols }) => (
  <CardContainer id="masonryCard" gutterSize={gutterSize} numCols={numCols}>
    <h2>{item.name}</h2>
  </CardContainer>
);

export default Card;
