import React from "react";
import styled from "styled-components";

const CardContainer = styled.div`
  margin: 0 8px 8px 0;
  margin: ${({ gutterSize }) => `0 ${gutterSize}px ${gutterSize}px 0`};
  width: ${(props) => `calc(${100 / props.numCols}% - ${props.gutterSize}px)`};
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0px 6px 20px -2px rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
  overflow: hidden;
  ${({ hasImage, numCols }) =>
    hasImage ? "" : `min-height: ${(8 - numCols) * 48}px`};
  justify-content: flex-end;
  display: flex;
  flex-direction: column;
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
  ${({ isOverlay }) =>
    isOverlay
      ? `position: absolute; color: #fff; text-shadow: 0px 0px 36px #000;`
      : ""}
  h3 {
    margin: 0;
  }
`;

const Card = ({ item, gutterSize, numCols, showName, onLoad }) => {
  const hasImage = item.hasOwnProperty("image_url");
  return (
    <CardContainer
      id="masonryCard"
      gutterSize={gutterSize}
      numCols={numCols}
      hasImage={hasImage}
    >
      {hasImage && (
        <Image onLoad={onLoad} src={item.image_url} alt={item.name} />
      )}
      {showName && (
        <Content isOverlay={hasImage}>
          <h3>{item.name}</h3>
        </Content>
      )}
    </CardContainer>
  );
};

export default Card;
