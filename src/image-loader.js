import React, { useState, useRef, useReducer, useEffect } from "react";
import * as mobilenet from "@tensorflow-models/mobilenet";
// import "../App.css";

let counter = 0;

const machine = {
  initial: "uploadReady",
  states: {
    uploadReady: { on: { next: "imageReady" }, showResults: false },
    imageReady: {
      on: { next: "identifying" },
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
  let imageRef = useRef();
  let inputRef = useRef();
  // useEffect(() => {loadModel()}, [])
  console.log("PROPS: ", props);

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

    console.log(typeof results[0].probability, "PROBABILITY??? type");
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

    console.log(typeof results[0].probability, "PROBABILITY??? type");
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
    props.callbackFromHaiku("")
    inputRef.current.value = ''
    next();
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

  const actionButton = {
    uploadReady: { action: upload, text: "Upload Image" },
    imageReady: { action: identify, text: "Give me a Haiku" },
    reIdentify: { action: reIdentify },
    identifying: { text: "Identifying..." },
    complete: { action: reset, text: "Reset" },
  };

  const { showImage, showResults } = machine.states[appState];

  return (

    <div id="container">
      <h2 id="title">Haicoo~</h2>
      <div id="content-container">

        <div id ="saveme">
        {showImage && <img src={imageURL} alt="upload-preview" ref={imageRef} />}
        <input
          type="file"
          accept="image/x-png,image/jpeg,image/gif"
          onChange={handleUpload}
          ref={inputRef}
        />
        {showResults && props.poem && props.poem.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
        <button id="action-btn" className="btn btn-info btn-pill" onClick={actionButton[appState].action || (() => {})}>
          {actionButton[appState].text}
        </button>

        {actionButton[appState].text === "Reset" && <button id="reidentify-btn" className="btn btn-info btn-pill" onClick={actionButton.reIdentify.action || (() => {})}>
          Give me another Haiku
        </button>}
      </div>

    </div>
  );
}

export default ImageLoader;
