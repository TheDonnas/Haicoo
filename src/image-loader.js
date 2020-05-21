import React, { useState, useRef, useReducer, useEffect } from "react";
import * as mobilenet from "@tensorflow-models/mobilenet";
import { HuePicker } from "react-color";
import FontPicker from "font-picker-react";
import { bindColorTextureToFramebuffer } from "@tensorflow/tfjs-core/dist/backends/webgl/webgl_util";
// import "../App.css";


let counter = 0;

// const API = process.env.apiKeySecret

const machine = {
  initial: "uploadReady",
  states: {
    uploadReady: {
      on: { next: "imageReady" },
    },
    imageReady: {
      on: { next: "identifying", redo: "uploadReady" },
      showImage: true,
      showResults: false,
    },
    identifying: {
      on: { next: "complete" },
      showImage: true,
      showResults: false,
    },
    complete: {
      on: { next: "uploadReady", redo: "identifying" },
      showImage: true,
      showResults: true,
    },
  },
};

function ImageLoader(props) {
  const [results, setResults] = useState([]);
  const [imageURL, setImageURL] = useState(null);
  const [model, setModel] = useState(null);
  const [modelReady, setModelReady] = useState(null);
  const [fontColor, setFontColor] = useState("#000000");
  const [activeFontFamily, setActiveFontFamily] = useState("Arial");

  let imageRef = useRef();
  let inputRef = useRef();
  // useEffect(() => {loadModel()}, [])
  // console.log("PROPS: ", props);

  const reducer = (state, event) => {
    return machine.states[state].on[event] || machine.initial;
  };

  const [appState, dispatch] = useReducer(reducer, machine.initial);
  const next = () => dispatch("next");
  const redo = () => dispatch("redo");

  const loadModel = async () => {
    if (counter === 0) {
      setModelReady(true);
      console.log("MODEL WILL BE LOADED");
      const model = await mobilenet.load();
      setModel(model);
      setModelReady(null);
      console.log("MODEL LOADED!!!!");
      counter++;
    }
  };

  const chooseRandom = (choices) => {
    let index = Math.floor(Math.random() * choices.length);
    return choices[index];
  };

  const identify = async () => {
    next();
    const results = await model.classify(imageRef.current);
    setResults(results);
    console.log(results);
    let word;

    // console.log(typeof results[0].probability, "PROBABILITY??? type");
    if (
      results.length &&
      results[0].probability < 0.25 &&
      results[2].probability < 0.1
    ) {
      word = chooseRandom(["flower", "love", "rainbow", "star"]);
    } else {
      word = results[0].className.split(", ")[0];
    }
    if (word.includes(" ")) {
      word = word.split(" ");
      word = word[word.length - 1];
    }
    props.updateWord(word);
    next();
  };

  const reIdentify = async () => {
    setResults([]);
    props.updateWord("");
    redo();
    const results = await model.classify(imageRef.current);
    setResults(results);
    console.log(results);
    let word;

    // console.log(typeof results[0].probability, "PROBABILITY??? type");
    if (
      results.length &&
      results[0].probability < 0.25 &&
      results[2].probability < 0.1
    ) {
      word = chooseRandom(["flower", "love", "rainbow", "star"]);
    } else {
      word = results[0].className.split(", ")[0];
    }
    if (word.includes(" ")) {
      word = word.split(" ");
      word = word[word.length - 1];
    }
    props.updateWord(word);
    next();
  };

  const reset = async () => {
    setResults([]);
    props.updateWord("");
    props.callbackFromHaiku("");
    inputRef.current.value = "";
    next();
    inputRef.current.click();
    console.log("DONE resetting")
  };

  const upload = () => {
    loadModel();
    inputRef.current.click();
  };

  const handleUpload = (event) => {
    const { files } = event.target;
    if (files.length > 0) {
      const url = URL.createObjectURL(event.target.files[0]);
      setImageURL(url);
      next();
    }
  };

  const handleChange = (color) => {
    setFontColor(color.hex);
  };

  const handleFontChange = (nextFont) => {
    setActiveFontFamily(nextFont.family);
  };

  const handleUndo = () => {
    inputRef.current.value = "";
    redo();
  };

  const copyToClipboard = () => {
    let elem = document.createElement("textarea");
    document.body.appendChild(elem);
    elem.value = props.poem;
    elem.select();
    document.execCommand("copy");
    document.body.removeChild(elem);
  }

  const actionButton = {
    uploadReady: { action: upload, text: "Upload Image" },
    imageReady: { action: identify, text: "Give me a Haiku" },
    reIdentify: { action: reIdentify },
    identifying: { text: "Identifying..." },
    complete: { action: reset, text: "Start Over" },
  };

  const { showImage, showResults } = machine.states[appState];

  return (
    <div id="container" className="row">
      {(actionButton[appState].text === "Start Over" ||
        actionButton[appState].text === "Identifying...") && (
        <div className="col-sm-4">
          <p>
            <button
              id="edit-btn"
              className="btn btn-info btn-pill"
              type="button"
              data-toggle="collapse"
              data-target="#multiCollapseExample2"
              aria-expanded="false"
              aria-controls="multiCollapseExample2"
            >
              Text Editor
            </button>
          </p>
          <div className="row">
            <div className="col">
              <div
                className="collapse multi-collapse"
                id="multiCollapseExample2"
              >
                <div>
                  {actionButton[appState].text === "Start Over" && (
                    <div>
                      <div className="spacer"/>
                      {/* <div id="text-color"> */}
                        <HuePicker onChange={handleChange} color={fontColor} />
                      {/* </div> */}
                      <div className="spacer2"/>
                        <FontPicker
                          apiKey={process.env.REACT_APP_GOOGLE_API_KEY}
                          nextFont={activeFontFamily}
                          onChange={handleFontChange}
                          // font={fontStyle}
                        />
                    </div>
                  )}
                </div>

                {/* <div>
                  {actionButton[appState].text === "Start Over" && (
                    <div id="font">
                      <FontPicker
                        apiKey=""
                        nextFont={activeFontFamily}
                        onChange={handleFontChange}
                        // font={fontStyle}
                      />
                    </div>
                  )}
                </div> */}
              </div>
            </div>
          </div>
        </div>
      )}

      <div id="buttons" className="col-sm">
        <div id="saveme">
          <input
            type="file"
            accept="image/x-png,image/jpeg,image/gif"
            onChange={handleUpload}
            ref={inputRef}
          />

          {showImage ? (
            <img
              id="image"
              src={imageURL}
              alt="upload-preview"
              ref={imageRef}
            />
          ) : (
            <div>
              {modelReady ? (
                <div>
                  {/* <div id="spacer2" /> */}
                  <img
                    className="circleLoader"
                    alt="poemLoader"
                    src="https://i.pinimg.com/originals/f2/9f/02/f29f025c9ff5297e8083c52b01f1a709.gif"
                  />
                </div>
              ) : (
                <div id="spacer" />
              )}
              <img
                id="loader"
                alt="imageLoader"
                src="https://media3.giphy.com/headers/shanebeam/myU7u7UKroOg.gif"
              />
            </div>
          )}

          <div className="apply-font" id="poem">
            {showResults &&
              props.poem &&
              props.poem.map((line) => (
                <p style={{ color: fontColor }} key={line}>
                  {line}
                </p>
              ))}
          </div>
        </div>

        {/* main button */}
        <div className="d-flex justify-content-center">
          {actionButton[appState].text === "Identifying..." ? (
            <img
              className="circleLoader"
              alt="poemLoader"
              src="https://i.pinimg.com/originals/f2/9f/02/f29f025c9ff5297e8083c52b01f1a709.gif"
            />
          ) : (
            <button
              id="action-btn"
              className="btn btn-outline-info btn-pill"
              onClick={actionButton[appState].action || (() => {})}
            >
              {actionButton[appState].text}
            </button>
          )}
        </div>

        {/* choose different image button */}
        {actionButton[appState].text === "Give me a Haiku" && (
          <button
            id="reidentify-btn"
            className="btn btn-outline-info btn-pill"
            onClick={handleUndo}
          >
            Choose different Image
          </button>
        )}

        <div>
        {showResults &&
          <div id="special2">
            <svg id="copy-clipboard-btn" type="button" className="btn btn-outline-info btn-pill" onClick={copyToClipboard} height="28" viewBox="-21 0 512 512" width="28" xmlns="http://www.w3.org/2000/svg"><path d="m186.667969 416c-49.984375 0-90.667969-40.683594-90.667969-90.667969v-218.664062h-37.332031c-32.363281 0-58.667969 26.300781-58.667969 58.664062v288c0 32.363281 26.304688 58.667969 58.667969 58.667969h266.664062c32.363281 0 58.667969-26.304688 58.667969-58.667969v-37.332031zm0 0" fill="#1976d2"/><path d="m469.332031 58.667969c0-32.40625-26.261719-58.667969-58.664062-58.667969h-224c-32.40625 0-58.667969 26.261719-58.667969 58.667969v266.664062c0 32.40625 26.261719 58.667969 58.667969 58.667969h224c32.402343 0 58.664062-26.261719 58.664062-58.667969zm0 0" fill="#2196f3"/></svg>
          </div>
        }
        </div>

        {/* download button */}
        {showResults && (
          <div id="special">
            {/* <button
              onClick={props.saveImage}
              id="save-me-btn"
              className="btn btn-success btn-pill"
            >
              ↓
            </button> */}
            <svg type="button" className="btn btn-outline-info btn-pill" onClick={props.saveImage}
              id="save-me-btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" height="30px" width="30px"><path d="M243.968 378.528c3.04 3.488 7.424 5.472 12.032 5.472s8.992-2.016 12.032-5.472l112-128c4.16-4.704 5.12-11.424 2.528-17.152S374.272 224 368 224h-64V16c0-8.832-7.168-16-16-16h-64c-8.832 0-16 7.168-16 16v208h-64c-6.272 0-11.968 3.68-14.56 9.376-2.624 5.728-1.6 12.416 2.528 17.152l112 128z" fill="#2196f3"/><path d="M432 352v96H80v-96H16v128c0 17.696 14.336 32 32 32h416c17.696 0 32-14.304 32-32V352h-64z" fill="#607d8b"/></svg>
          </div>
        )}

        {/* give another haiku button */}
        {actionButton[appState].text === "Start Over" && (
          <button
            id="reidentify-btn"
            className="btn btn-outline-info btn-pill"
            onClick={actionButton.reIdentify.action || (() => {})}
          >
            Give me another Haiku
          </button>
        )}
      </div>
    </div>
  );
}

export default ImageLoader;
