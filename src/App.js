import React from "react";
import ImageLoader from "./image-loader";
import Haiku from "./haiku";
import * as htmlToImage from "html-to-image";
import InstallButton from "./InstallButton";
import { Base64 } from 'js-base64';
const FB = window.FB 

if ( XMLHttpRequest.prototype.sendAsBinary === undefined ) {
  XMLHttpRequest.prototype.sendAsBinary = function(string) {
      var bytes = Array.prototype.map.call(string, function(c) {
          return c.charCodeAt(0) & 0xff;
      });
      this.send(new Uint8Array(bytes).buffer);
  };
};

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      word: "",
      poem: null
    };
    this.updateWord = this.updateWord.bind(this);
    this.saveImage = this.saveImage.bind(this);
    this.callbackFromHaiku = this.callbackFromHaiku.bind(this);
    this.sendDataToFacebook= this.sendDataToFacebook.bind(this)
    this.postImageToFacebook= this.postImageToFacebook.bind(this);

  }

  updateWord(word) {
    this.setState({ word });
  }

  saveImage = async () => {
    try {
      htmlToImage
        .toPng(document.getElementById("saveme"), {
          quality: 0.95,
          backgroundColor: "#f0fff0",
        })
        .then(function (dataUrl) {
          var link = document.createElement("a");
          link.download = "haicoo.png";
          link.href = dataUrl;
          link.click();
        });
    } catch (err) {
      console.error(err);
    }
  };
  sendDataToFacebook ( authToken, filename, mimeType, imageData, message )
  {
      // this is the multipart/form-data boundary we'll use
      var boundary = '----ThisIsTheBoundary1234567890';
      // let's encode our image file, which is contained in the var
      var formData = '--' + boundary + '\r\n'
      formData += 'Content-Disposition: form-data; name="source"; filename="' + filename + '"\r\n';
      formData += 'Content-Type: ' + mimeType + '\r\n\r\n';
      for ( var i = 0; i < imageData.length; ++i )
      {
          formData += String.fromCharCode( imageData[ i ] & 0xff );
      }
      formData += '\r\n';
      formData += '--' + boundary + '\r\n';
      formData += 'Content-Disposition: form-data; name="message"\r\n\r\n';
      formData += message + '\r\n'
      formData += '--' + boundary + '--\r\n';

      var xhr = new XMLHttpRequest();
      xhr.open( 'POST', 'https://graph.facebook.com/me/photos?access_token=' + authToken, true );
      xhr.onload = xhr.onerror = function() {
          console.log( xhr.responseText );
      };
      xhr.setRequestHeader( "Content-Type", "multipart/form-data; boundary=" + boundary );
      xhr.sendAsBinary( formData );
  };

  postImageToFacebook = () => {
    let encodedPng
    htmlToImage.toPng(document.getElementById('saveme'))
    .then(function (dataUrl) {
      encodedPng = dataUrl
      var decodedPng = Base64.decode(encodedPng);
      //get Login status 
      FB.getLoginStatus(function(response) {
        console.log(response, "FBRESPONSE")
        if (response.status === "connected") {
        this.sendDataToFacebook(response.authResponse.accessToken, "haicoo", "image/png", decodedPng, "haicoo.herokuapp.com");
        } else if (response.status === "not_authorized") {
        FB.login(function(response) {
          this.sendDataToFacebook(response.authResponse.accessToken, "haicoo", "image/png", decodedPng, "haicoo.herokuapp.com");
        }, {scope: "publish_actions"});
        } else {
        FB.login(function(response)  {
          this.sendDataToFacebook(response.authResponse.accessToken, "haicoo", "image/png", decodedPng, "haicoo.herokuapp.com");
        }, {scope: "publish_actions"});
        }
      })
    })
  }

  callbackFromHaiku = (haiku) => {
    this.setState({ poem: haiku });
    console.log("STATE POEM IN APP: ", this.state.poem);
  };

  render() {
    let { word, poem } = this.state;
    console.log("THIS STATE IN APP", this.state);

    return (
      <div id="background">
        <div id="home">
          <h2 id="title">Haicoo~</h2>
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
            poem={poem}
            callbackFromHaiku={this.callbackFromHaiku}
          />
          {word.length ? (
            <div>
            <button
              onClick={this.saveImage}
              id="save-me-btn"
              className="btn btn-info btn-pill"
            >
              Download
            </button>
            <button
              onClick={this.postImageToFacebook}
              id="post-fb-btn"
              className="btn btn-info btn-pill"
            >
              Post to Facebook
            </button>
            </div>
          ) : null}
          {!word.length ? <InstallButton /> : <div />}
        </div>
        <div id="share-btns">
          {/* <div className="fb-share-button" data-href="https://haicoo.herokuapp.com/index.html" data-layout="button" data-size="large" href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fplugins%2F&amp;src=sdkpreparse" className="fb-xfbml-parse-ignore" target="_blank"> */}
          <a className="fb-share-button" href="https://haicoo.herokuapp.com/index.html" data-layout="button" data-size="large" >Share</a>
          {/* </div> */}

          <a href="https://twitter.com/share?ref_src=twsrc%5Etfw" className="twitter-share-button" data-size="large" data-show-count="false">Twitter</a>
        </div>
      </div>
    );
  }
}

export default App;
