import React from "react";
import "./App.css";
import mondaySdk from "monday-sdk-js";
const monday = mondaySdk();

class App extends React.Component {
  constructor(props) {
    super(props);

    // Default state
    this.state = {
      loading: false,
      settings: {},
      context: {},
      items: {},
      groups: {},
    };
  }

  componentDidMount() {
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
        });
    });
  }

  render() {
    return (
      <div className="App">
        <h1>HELLO</h1>
        <p>{JSON.stringify(this.state.items, null, 1)}</p>
        <p>{JSON.stringify(this.state.groups, null, 1)}</p>
      </div>
    );
  }
}

export default App;
