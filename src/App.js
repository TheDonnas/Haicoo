import React from "react";
import ImageLoader from "./image-loader";
import Haiku from "./haiku";
import * as htmlToImage from "html-to-image";
import InstallButton from "./InstallButton";
import '../node_modules/font-awesome/css/font-awesome.min.css';
import Typewriter from 'typewriter-effect';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      word: "",
      poem: null,
      copySuccess: ''
    };
    this.updateWord = this.updateWord.bind(this);
    this.saveImage = this.saveImage.bind(this);
    this.callbackFromHaiku = this.callbackFromHaiku.bind(this);
    this.copyToClipboard = this.copyToClipboard.bind(this);
  }

  updateWord(word) {
    this.setState({ word });
  }

  saveImage = async () => {
    try {
      console.log("pushhhh");
      htmlToImage
        .toPng(document.getElementById("saveme"), {
          quality: 0.95,
          backgroundColor: "#f2e9e4",
          // background: "https://www.pngkey.com/png/detail/203-2032708_scribble-frames-doodle-frame-png.png",
        })
        .then(function (dataUrl) {
          var link = document.createElement("a");
          link.download = "haicoo.png";
          link.href = dataUrl;
          link.click();
          localStorage.setItem('poemImg', dataUrl)
        })
    } catch (err) {
      console.error(err);
    }
  };

  callbackFromHaiku = (haiku) => {
    this.setState({ poem: haiku });
    console.log("STATE POEM IN APP: ", this.state.poem);
  };

  copyToClipboard = () => {
    var elem = document.createElement("textarea");
    document.body.appendChild(elem);
    elem.value = this.state.poem;
    elem.select();
    document.execCommand("copy");
    document.body.removeChild(elem);
  }


  render() {
    let { word, poem } = this.state;
    console.log("THIS STATE IN APP", this.state);
    // let imgUrl = localStorage.getItem("poemImg")
    // document.getElementsByTagName('meta')[12].content= imgUrl

    let link = document.createElement('meta');
    link.setAttribute("property", "og:image");
    link.content = localStorage.getItem("poemImg");
    document.getElementsByTagName("head")[0].appendChild(link);
    // const string =
    // "Haiku is a Japanese poem of seventeen syllables, in three lines
    // of five, seven, and five, traditionally evoking images of the
    // natural world."
    // console.log(string)

    return (
      <div id="background">
        <div id="home">
          <h2 id="title">Haicoo~</h2>
          {/* <Typewriter
            options={{
              strings: [
                "Haiku",
                "is",
                "a",
                "Japanese",
                "poem",
                "of",
                "seventeen",
                "syllables,",
                "in",
                "three",
                "lines",
                "of",
                "five,",
                "poem",
                "seven,",
                "and",
                "five,",
                "traditionally",
                "evoking",
                "images",
                "of",
                "the",
                "natural",
                "world.",
              ],
              autoStart: true,
              loop: true,
            }}
          /> */}

          <div id="definition">
            <span className="hidden">
            <Typewriter
            onInit={(typewriter) => {
              typewriter
                .typeString("Haiku is a Japanese poem of seventeen syllables, in three lines of five, seven, and five, traditionally evoking images of the natural world.")
                .callFunction(() => {
                  console.log("String typed out!");
                })
                .start();
            }}
          />
            </span>
            <div className="spacer3" />
            <hr className="hidden" />
            <div className="spacer3" />
            <span id="bold">
              Click <i>upload image</i> <br />
              we will give you a haiku!
              <br />
              ...then try it again!
            </span>
          </div>
          {/* <div id="definition"> */}

          {/* </div> */}

          <a href="#app">
            <button
              id="get-started-btn"
              type="button"
              className="btn btn-outline-light btn-pill"
            >
              Get Started
            </button>
          </a>
        </div>

        <div id="app" className="container-fluid">
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
            saveImage={this.saveImage}
            poem={poem}
            callbackFromHaiku={this.callbackFromHaiku}
          />
          <div className="col-sm">
            {!word.length ? <InstallButton /> : <div />}
          </div>
          <div id="sticky">
            <div id="share-btns">
              {/* <div className="fb-share-button" data-href="https://haicoo.herokuapp.com/index.html" data-layout="button" data-size="large" href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fplugins%2F&amp;src=sdkpreparse" className="fb-xfbml-parse-ignore" target="_blank"> */}
              <a
                className="fb-share-button"
                href="https://haicoo.herokuapp.com/index.html"
                data-layout="button"
                data-size="large"
              >
                Share
              </a>

              <a
                href="https://twitter.com/share?ref_src=twsrc%5Etfw"
                className="twitter-share-button share-button"
                data-size="large"
                data-show-count="false"
              >
                Twitter
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
