import React, { useState, useRef, useReducer, useEffect } from "react";
import * as mobilenet from "@tensorflow-models/mobilenet";
// import "../App.css";

let counter = 0

const machine = {
  initial: "uploadReady",
  states: {
    uploadReady: { on: { next: "imageReady" }, showResults: false },
    imageReady: { on: { next: "identifying" }, showImage: true, showResults: false },
    beforeReIdentify: { on: { next: "identifying" }, showImage: true, showResults: false},
    identifying: { on: { next: "complete" }, showImage: true, showResults: false },
    complete: {
      on: { next: "uploadReady" },
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
  // useEffect(() => {loadModel()}, [])

  const reducer = (state, event) => {
    return machine.states[state].on[event] || machine.initial;
  }

  const [appState, dispatch] = useReducer(reducer, machine.initial);
  const next = () => dispatch("next");

  const loadModel = async () => {
    if(counter === 0){
    console.log("MODEL WILL BE LOADED")
    const model = await mobilenet.load();
    setModel(model);
    console.log("MODEL LOADED!!!!")
    counter++
    }
  };

  const chooseRandom = (choices) => {
    let index = Math.floor(Math.random() * choices.length);
    return choices[index];
  }

  const identify = async () => {
    next();
    const results = await model.classify(imageRef.current);
    setResults(results);
    console.log(results);
    let word;

    console.log(typeof results[0].probability, "PROBABILITY??? type")
    if (results.length && results[0].probability < .25 && results[2].probability < .10){
      word = chooseRandom(["flower", "love", "rainbow", "star"])
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
  
  const beforeReIdentify = () => {
    next();
    setResults([]);
    props.updateWord("");
    next();
  };

  const reset = async () => {
    setResults([]);
    props.updateWord("");
    next();
  };

  const upload = () => {
    loadModel()
    inputRef.current.click();
  }


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
    reIdentify: { action: beforeReIdentify },
    identifying: { text: "Identifying..." },
    complete: { action: reset, text: "Reset" },
  };

  const { showImage, showResults } = machine.states[appState];

  return (
    <div>
      {showImage && <img src={imageURL} alt="upload-preview" ref={imageRef} />}
      <input
        type="file"
        accept="image/x-png,image/jpeg,image/gif"
        onChange={handleUpload}
        ref={inputRef}
      />

      <button onClick={actionButton[appState].action || (() => {})}>
        {actionButton[appState].text}
      </button>
      
      {actionButton[appState].text === "Reset" && <button onClick={actionButton.reIdentify.action || (() => {})}>
        Give me another Haiku
      </button>}
    </div>
  );
}

export default ImageLoader;
