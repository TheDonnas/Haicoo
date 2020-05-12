import React from "react";
import ImageLoader from "./image-loader";
import Haiku from "./haiku";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      word: "",
    };
    this.updateWord = this.updateWord.bind(this);
  }
  updateWord(word) {
    this.setState({ word });
  }

  render() {
    let { word } = this.state;

    console.log("THIS STATE IN APP", this.state);
    return (
      <div>
        <ImageLoader updateWord={this.updateWord} />
        { word.length
        ? <Haiku key={word} word={word}/> : <div/>}
      </div>
    );
  }
}

export default App;
