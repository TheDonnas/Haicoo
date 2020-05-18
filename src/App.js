import React from "react";
import ImageLoader from "./image-loader";
import Haiku from "./haiku";
import * as htmlToImage from "html-to-image";
import InstallButton from "./InstallButton";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      word: "",
      poem: null,
    };
    this.updateWord = this.updateWord.bind(this);
    this.saveImage = this.saveImage.bind(this);
    this.callbackFromHaiku = this.callbackFromHaiku.bind(this);
  }

  updateWord(word) {
    this.setState({ word });
  }

  saveImage = async () => {
    try {
      console.log("pushhhh");
      htmlToImage
        .toJpeg(document.getElementById("saveme"), { quality: 0.95, backgroundColor:'#FFF5C7' })
        .then(function (dataUrl) {
          var link = document.createElement("a");
          link.download = "my-image-name.jpeg";
          link.href = dataUrl;
          link.click();
        });
    } catch (err) {
      console.error(err);
    }
  };

  callbackFromHaiku = (haiku) => {
    this.setState({ poem: haiku });
    console.log("STATE POEM IN APP: ", this.state.poem);
  };

  render() {
    let { word, poem } = this.state;
    console.log("THIS STATE IN APP", this.state);
    return (
      <div id="background">
        <div>
          {word.length ? (
            <Haiku
              key={word}
              word={word}
              callbackFromHaiku={this.callbackFromHaiku}
            />
          ) : (
            <div />
          )}
          <ImageLoader
            updateWord={this.updateWord}
            poem={poem}
            callbackFromHaiku={this.callbackFromHaiku}
          />
        </div>
        <div>
          {word.length ? (
            <button
              onClick={this.saveImage}
              id="save-me-btn"
              className="btn btn-outline-dark btn-pill"
            >
              Save Me
            </button>
          ) : (
            <div />
          )}
          {!word.length ? <InstallButton /> : <div />}
        </div>
      </div>
    );
  }
}

export default App;
