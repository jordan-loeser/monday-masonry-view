import React from "react";
import mondaySdk from "monday-sdk-js";
import styled from "styled-components";
import { Loader } from "monday-ui-react-core";
import { Card, InstructionScreen } from "./components";

import "monday-ui-react-core/dist/main.css";
import "./App.css";

const monday = mondaySdk();

const MASONRY_CONFIG = {
  gutterSize: 16,
  dGridCol: 4,
  tGridCol: 3,
  mGridCol: 2,
};

const LINK_TYPE = "LINK_TYPE";
const FILE_TYPE = "FILE_TYPE";

const LoaderContainer = styled.div`
  width: 48px;
  margin: 0 auto;
  height: 100vh;
`;

const MasonryContainer = styled.div`
  display: flex;
  flex-flow: column wrap;
  height: ${(props) => `${props.containerHeight}px` || "auto"};
  width: 100%;
  padding-left: ${MASONRY_CONFIG.gutterSize}px;
  padding-top: ${MASONRY_CONFIG.gutterSize}px;
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
      containerHeight: 1000,
      windowWidth: window.innerWidth,
      showNonImageItems: false,
      showItemNames: false,
    };
  }

  // Assumption: `column_value` properties are the same for all items
  async parseItems(items) {
    // If no column is selected, don't parse
    if (items.length === 0) return items;
    const { column_values: sampleColumn = [] } = items[0];
    if (sampleColumn.length === 0) return items;

    // Validate column type
    const sampleImageData = JSON.parse(sampleColumn[0].value);
    const columnType = sampleImageData.hasOwnProperty("url")
      ? LINK_TYPE
      : sampleImageData.hasOwnProperty("files")
      ? FILE_TYPE
      : null;

    // Parse Link Column
    if (columnType === LINK_TYPE) {
      return items.reduce((acc, item) => {
        const url = JSON.parse(item.column_values[0].value)?.url ?? null;
        return [...acc, url ? { ...item, image_url: url } : item];
      }, []);
    }

    // Parse File Column
    if (columnType === FILE_TYPE) {
      const NO_IMAGE = -1;
      // Get asset Ids
      const assetIds = items.reduce((acc, item) => {
        const files = JSON.parse(item.column_values[0].value)?.files ?? [];
        return [
          ...acc,
          files.length > 0 && files[0].isImage === "true"
            ? files[0].assetId
            : NO_IMAGE,
        ];
      }, []);
      // Pull asset URLs from monday
      const query = `
        query ($assetIds: [Int]!) {
          assets (ids: $assetIds) {
            id
            url
          }
        }
      `;
      return monday
        .api(query, {
          variables: {
            assetIds: assetIds.filter((assetId) => assetId !== NO_IMAGE),
          },
        })
        .then((res) => {
          const { assets } = res.data;
          const assetUrls = assets.reduce(
            (acc, curr) => ({ ...acc, [curr.id]: curr.url }),
            {}
          );
          // Reassign asset URLs to correct items
          return items.reduce((acc, item, i) => {
            if (assetIds[i] === NO_IMAGE) return [...acc, item];
            return [...acc, { ...item, image_url: assetUrls[assetIds[i]] }];
          }, []);
        });
    }

    return items;
  }

  pullItems() {
    const hasSelectedColumn =
      Object.keys(this.state.settings?.image_column ?? {}).length !== 0;
    const query = `
      query ($boardIds: [Int], $columnIds: [String]) {
        boards(ids:$boardIds) {
          groups{
            id
          title
          } 
          items {
            name
            column_values(ids:$columnIds) {
              value
            }
          }
        }
      }
    `;
    this.setState({ loading: true });
    monday
      .api(query, {
        variables: {
          boardIds: this.state.context.boardIds,
          columnIds: hasSelectedColumn
            ? Object.keys(this.state.settings?.image_column)
            : [""],
        },
      })
      .then(async (res) => {
        const { groups, items } = res.data.boards[0];
        const parsedItems = await this.parseItems(items);
        this.setState({
          groups,
          items: parsedItems,
          loading: false,
        });
      });
  }

  componentDidMount() {
    window.addEventListener("resize", this.updateWindowDimensions.bind(this));
    monday.listen("settings", (res) => {
      this.setState(
        {
          settings: res.data,
          showNonImageItems:
            res.data?.view_settings.includes("show_non_image") ?? false,
          showItemNames: res.data?.view_settings.includes("show_name") ?? false,
        },
        this.pullItems
      );
    });
    monday.listen("context", (res) => {
      this.setState({ context: res.data }, this.pullItems);
    });
    this.setContainerHeight();
  }

  componentDidUpdate() {
    this.setContainerHeight();
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
    // Based on settings
    if (
      this.state.settings?.override_num_cols &&
      this.state.settings.hasOwnProperty("num_cols")
    )
      return parseInt(this.state.settings.num_cols);

    // Based on window size
    if (window.innerWidth >= 1024) {
      return MASONRY_CONFIG.dGridCol;
    } else if (window.innerWidth >= 768) {
      return MASONRY_CONFIG.tGridCol;
    }
    return MASONRY_CONFIG.mGridCol;
  }

  setContainerHeight() {
    const cardList = Array.from(document.querySelectorAll("#masonryCard"));
    const maxItemsPerCol = Math.ceil(cardList.length / this.getNumCols());
    const sortedCardHeights = cardList
      .map((card) => card.offsetHeight + MASONRY_CONFIG.gutterSize)
      .sort((a, b) => b - a);
    const tallestPossibleColumn =
      MASONRY_CONFIG.gutterSize +
      sortedCardHeights
        .slice(0, maxItemsPerCol)
        .reduce((acc, curr) => acc + curr, 0);
    if (tallestPossibleColumn !== this.state.containerHeight) {
      this.setState({
        containerHeight: tallestPossibleColumn,
      });
    }
  }

  handleImageLoaded() {
    this.setContainerHeight();
  }

  render() {
    const numCols = this.getNumCols();
    const itemsToShow =
      this.state.showNonImageItems && this.state.showItemNames
        ? this.state.items
        : this.state.items.filter((item) => item.hasOwnProperty("image_url"));
    return (
      <div className="App">
        {this.state.loading ? (
          <LoaderContainer>
            <Loader svgClassName="loader-size-md" />
          </LoaderContainer>
        ) : !this.state.showNonImageItems && itemsToShow.length === 0 ? (
          <InstructionScreen />
        ) : (
          <MasonryContainer containerHeight={this.state.containerHeight}>
            {itemsToShow.map((item, i) => (
              <Card
                key={`card-${i}`}
                item={item}
                gutterSize={MASONRY_CONFIG.gutterSize}
                numCols={numCols}
                showName={this.state.showItemNames}
                onLoad={this.handleImageLoaded.bind(this)}
              />
            ))}
            {Array(numCols - 1)
              .fill()
              .map((_, i) => (
                <Break key={`break-${i}`} numCols={numCols} />
              ))}
          </MasonryContainer>
        )}
      </div>
    );
  }
}

export default App;
