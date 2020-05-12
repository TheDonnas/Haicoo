import React, { useState, useRef, useReducer, useEffect } from "react";
import * as mobilenet from "@tensorflow-models/mobilenet";
import "./App.css";

const machine = {
  initial: "loadingModel",
  states: {
    // initial: { on: { next: "loadingModel" } },
    loadingModel: { on: { next: "modelReady" } },
    modelReady: { on: { next: "imageReady" }, showResults: false },
    imageReady: { on: { next: "identifying" }, showImage: true, showResults: false },
    identifying: { on: { next: "complete" } },
    complete: {
      on: { next: "modelReady" },
      showImage: true,
      showResults: true,
    },
  },
};

function ImageLoader(props) {
  const [results, setResults] = useState([]);
  const [imageURL, setImageURL] = useState(null);
  const [model, setModel] = useState(null);
  const imageRef = useRef();
  const inputRef = useRef();
  useEffect(() => {loadModel()}, [])

  const reducer = (state, event) => {
    return machine.states[state].on[event] || machine.initial;
  }

  const [appState, dispatch] = useReducer(reducer, machine.initial);
  const next = () => dispatch("next");

  const loadModel = async () => {
    console.log("MODEL WILL BE LOADED")
    const model = await mobilenet.load();
    setModel(model);
    next();
    console.log("MODEL LOADED!!!!")
  };

  const identify = async () => {
    next();
    const results = await model.classify(imageRef.current);
    setResults(results);
    console.log(results);
    let word = results[0].className.split(", ")[0];
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
    next();
  };

  const upload = () => inputRef.current.click();

  const handleUpload = (event) => {
    const { files } = event.target;
    if (files.length > 0) {
      const url = URL.createObjectURL(event.target.files[0]);
      setImageURL(url);
      next();
    }
  };

  const actionButton = {
    // initial: {  text: "Get Started" },
    loadingModel: { text: "Loading..." },
    modelReady: { action: upload, text: "Upload Image" },
    imageReady: { action: identify, text: "Give me a Haiku" },
    identifying: { text: "Identifying..." },
    complete: { action: reset, text: "Reset" },
  };

  const { showImage, showResults } = machine.states[appState];

  return (
    <div>
      {showImage && <img src={imageURL} alt="upload-preview" ref={imageRef} />}
      <input
        type="file"
        accept="image/*"
        capture="camera"
        onChange={handleUpload}
        ref={inputRef}
      />

      <button onClick={actionButton[appState].action || (() => {})}>
        {actionButton[appState].text}
      </button>
    </div>
  );
}

export default ImageLoader;