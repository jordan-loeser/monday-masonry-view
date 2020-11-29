import React from "react";
import styled from "styled-components";

const CardContainer = styled.div`
  margin: 0 8px 8px 0;
  margin: ${({ gutterSize }) => `0 ${gutterSize}px ${gutterSize}px 0`};
  width: ${(props) => `calc(${100 / props.numCols}% - ${props.gutterSize}px)`};
  background-color: #0085ff;
  color: #fff;
  border-radius: 16px;
  box-sizing: border-box;
  overflow: hidden;
  ${({ numCols }) => {
    let res = "";
    for (let i = 1; i <= numCols; i++) {
      res += `&:nth-of-type(${numCols}n + ${i}) { order: ${i}; }`;
    }
    return res;
  }}
`;

const Image = styled.img`
  width: 100%;
  display: block;
`;

const Content = styled.div`
  padding: 16px;
  h2 {
    margin: 0;
  }
`;

const Card = ({ item, gutterSize, numCols, showName, onLoad }) => (
  <CardContainer id="masonryCard" gutterSize={gutterSize} numCols={numCols}>
    {item?.image_url && (
      <Image onLoad={onLoad} src={item.image_url} alt={item.name} />
    )}
    {showName && (
      <Content>
        <h2>{item.name}</h2>
      </Content>
    )}
  </CardContainer>
);

export default Card;
