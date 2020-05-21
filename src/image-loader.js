import React, { useState, useRef, useReducer, useEffect } from "react";
import * as mobilenet from "@tensorflow-models/mobilenet";
import { HuePicker } from "react-color";
import { bindColorTextureToFramebuffer } from "@tensorflow/tfjs-core/dist/backends/webgl/webgl_util";
// import "../App.css";

let counter = 0;

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
  const [fontColor, setFontColor] = useState("#000000");
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
      console.log("MODEL WILL BE LOADED");
      const model = await mobilenet.load();
      setModel(model);
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

  const handleUndo = () => {
    inputRef.current.value = "";
    redo();
  };

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
              Editor
            </button>
          </p>
          <div className="row">
            <div className="col">
              <div
                className="collapse multi-collapse"
                id="multiCollapseExample2"
              >
                {actionButton[appState].text === "Start Over" && (
                  <div id="picker">
                    <p>Text Color</p>
                    <HuePicker onChange={handleChange} color={fontColor} />
                  </div>
                )}
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
            // <div id="special">
            <img
              id="image"
              src={imageURL}
              alt="upload-preview"
              ref={imageRef}
            />
          ) : (
            // {!!counter ? (
              <img
                id="loader"
                alt="imageLoader"
                src="https://media3.giphy.com/headers/shanebeam/myU7u7UKroOg.gif"
              />
            // ) : (
            //   <img
            //     id="loader"
            //     alt="imageLoader"
            //     src="https://media3.giphy.com/headers/shanebeam/myU7u7UKroOg.gif"
            //   />
            // )

            // }
          )}

          <div id="poem">
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
              // id="wordLoader"
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
        {/* download button */}
        {showResults && <div id="special">
          <button
            onClick={props.saveImage}
            id="save-me-btn"
            className="btn btn-success btn-pill"
          >
            ↓
          </button>
        </div>}

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
