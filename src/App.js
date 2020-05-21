import React from "react";
import ImageLoader from "./image-loader";
import Haiku from "./haiku";
import * as htmlToImage from "html-to-image";
import InstallButton from "./InstallButton";

<<<<<<< HEAD
console.log(process.env.REACT_APP_API_KEY)
=======
>>>>>>> 3d99b102ff6cd544cea095b26d998cd6c0511ea6

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      word: "",
      poem: null,
<<<<<<< HEAD
=======
      copySuccess: ''
>>>>>>> 3d99b102ff6cd544cea095b26d998cd6c0511ea6
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
    link.setAttribute('property', 'og:image');
    link.content = localStorage.getItem("poemImg");
    document.getElementsByTagName('head')[0].appendChild(link);

    return (
      <div id="background">
        <div id="home">
          <h2 id="title">Haicoo~</h2>
          <div id="description">
            {/* <h4>What is Haicoo?</h4> */}
            <p>
              Click <i>"upload image"</i> <br />
              we will give you a haiku!
              <br />
              ...then try it again!
            </p>
          </div>
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
            button={button}
            poem={poem}
            callbackFromHaiku={this.callbackFromHaiku}
          />
<<<<<<< HEAD
          <div className="col-sm">

          {/* {word.length ? (
=======
        </div>
        <div>
        {this.state.poem &&
          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" type="button" onClick={this.copyToClipboard}><path d="M0 0h24v24H0z" fill="none"/><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm-1 4l6 6v10c0 1.1-.9 2-2 2H7.99C6.89 23 6 22.1 6 21l.01-14c0-1.1.89-2 1.99-2h7zm-1 7h5.5L14 6.5V12z"/></svg>
        }
        {
         /* Logical shortcut for only displaying the
            button if the copy command exists */
        //  document.queryCommandSupported('copy') &&
        //   <div>
        //     <button onClick={this.copyToClipboard}>Copy</button>
        //     {this.state.copySuccess}
        //   </div>
        }
        {/* <form> */}
          {/* {this.state.poem &&
            <textarea
            // ref={(textarea) => this.textArea = textarea}
            value={this.state.poem}
            />
          } */}

        {/* </form> */}
      </div>
        <div>
          {word.length ? (
>>>>>>> 3d99b102ff6cd544cea095b26d998cd6c0511ea6
            <button
              onClick={this.saveImage}
              id="save-me-btn"
              className="btn btn-success btn-pill"
            >
              ↓
            </button>
          ) : null} */}

          {!word.length ? <InstallButton /> : <div />}
<<<<<<< HEAD
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
=======
        </div>
        <div id="share-btns">
          {/* <div className="fb-share-button" data-href="https://haicoo.herokuapp.com/index.html" data-layout="button" data-size="large" href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fplugins%2F&amp;src=sdkpreparse" className="fb-xfbml-parse-ignore" target="_blank"> */}
          <a className="fb-share-button" href="https://haicoo.herokuapp.com/index.html" data-layout="button" data-size="large">Share</a>
          {/* </div> */}

          <a href="https://twitter.com/share?ref_src=twsrc%5Etfw" className="twitter-share-button" data-size="large" data-show-count="false">Twitter</a>
>>>>>>> 3d99b102ff6cd544cea095b26d998cd6c0511ea6
        </div>
      </div>
    );
  }
}

export default App;
