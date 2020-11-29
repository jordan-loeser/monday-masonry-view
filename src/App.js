import React from "react";
import mondaySdk from "monday-sdk-js";
import styled from "styled-components";
import { Card } from "./components";

import "monday-ui-react-core/dist/main.css";
import "./App.css";

const monday = mondaySdk();

const MASONRY_CONFIG = {
  gutterSize: 16,
  dGridCol: 4,
  tGridCol: 3,
  mGridCol: 2,
};

const MasonryContainer = styled.div`
  display: flex;
  flex-flow: column wrap;
  height: ${(props) => `${props.height}px` || "100%"};
  width: 100%;
  max-height: 100%;
  padding-left: ${MASONRY_CONFIG.gutterSize}px;
  margin-top: ${MASONRY_CONFIG.gutterSize}px;
  box-sizing: border-box;
  align-content: flex-start;
`;

const Break = styled.span`
  flex-basis: 100%;
  width: 0;
  margin: 0;
  ${({ numCols }) => {
    let res = "";
    for (let i = 1; i <= numCols; i++) {
      res += `&:nth-of-type(${numCols}n + ${i}) { order: ${i}; }`;
    }
    return res;
  }}
`;

class App extends React.Component {
  constructor(props) {
    super(props);

    // Default state
    this.state = {
      loading: false,
      settings: {},
      context: {},
      items: [],
      groups: [],
      // Display
      containerHeight: "100%",
      windowWidth: window.innerWidth,
    };
  }

  componentDidMount() {
    window.addEventListener("resize", this.updateWindowDimensions.bind(this));
    monday.listen("settings", (res) => {
      this.setState({ settings: res.data });
    });
    monday.listen("context", (res) => {
      this.setState({ context: res.data, loading: true });
      const query = `
        query ($boardIds: [Int]) {
          boards (ids:$boardIds) {
            groups{
              id
              title
            } 
            items {
              name
            }
          }
        }
      `;
      monday
        .api(query, { variables: { boardIds: this.state.context.boardIds } })
        .then((res) => {
          const { groups, items } = res.data.boards[0];
          this.setState({ items, groups, loading: false });
          this.setContainerHeight();
        });
    });
  }

  componentWillUnmount() {
    window.removeEventListener(
      "resize",
      this.updateWindowDimensions.bind(this)
    );
  }

  updateWindowDimensions() {
    this.setState({ windowWidth: window.innerWidth });
  }

  getNumCols() {
    if (window.innerWidth >= 1024) {
      return MASONRY_CONFIG.dGridCol;
    } else if (window.innerWidth >= 768) {
      return MASONRY_CONFIG.tGridCol;
    }
    return MASONRY_CONFIG.mGridCol;
  }

  setContainerHeight() {
    const cardList = Array.from(document.querySelectorAll("#masonryCard"));
    const totalHeight = cardList.reduce(
      (acc, curr) => acc + curr.offsetHeight + MASONRY_CONFIG.gutterSize,
      0
    );
    const height =
      totalHeight / this.getNumCols() + totalHeight / (cardList.length + 1);
    this.setState({ containerHeight: height });
  }

  render() {
    const numCols = this.getNumCols();
    return (
      <div className="App">
        <MasonryContainer height={this.state.containerHeight}>
          {this.state.items.map((item, i) => (
            <Card
              key={`card-${i}`}
              item={item}
              gutterSize={MASONRY_CONFIG.gutterSize}
              numCols={numCols}
            />
          ))}
          {Array(numCols - 1)
            .fill()
            .map((_, i) => (
              <Break key={`break-${i}`} numCols={numCols} />
            ))}
        </MasonryContainer>
      </div>
    );
  }
}

export default App;
