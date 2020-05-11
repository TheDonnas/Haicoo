import React, { useState, useRef, useReducer } from "react";
import * as mobilenet from "@tensorflow-models/mobilenet";
import "./App.css";

const complete = {
  name: 'complete',
  next: modelReady,
  showImage: true,
  showResults: true,
}

const identifying = {
  name: 'identifying',
  next: complete,
  showImage: false,
  showResults: false,
}

const imageReady = {
  name: 'imageReady',
  next: identifying,
  showImage: true,
  showResults: false,
}

const modelReady = {
  name: 'modelReady',
  next: imageReady,
  showImage: false,
  showResults: false,
}

const loadingModel = {
  next: modelReady,
  showImage: false,
  showResults: false,
}
const initialState = {
  next: loadingModel,
  showImage: false,
  showResults: false,
}

class ImageLoader2 extends React.Component {
  constructor(props) { // this.props.updateWord
    super (props)
    this.state = {currState: modelReady, model: null, imageURL: null}

    this.handleUpload = this.handleUpload.bind(this)
  }
  async componentDidMount () {
    const model = await mobilenet.load();
    this.setState({ currState: modelReady, model: model })
  }
  handleUpload (event) {
    const { files } = event.target;
    if (files.length > 0) {
      const url = URL.createObjectURL(event.target.files[0]); //just don't worry about that
      this.setState({ currState: imageReady, imageURL: url})
    }
  };

  const actionButton = {
    initial: { action: loadModel, text: "Get Started" },
    loadingModel: { text: "Loading..." },
    modelReady: { action: upload, text: "Upload Image" },
    imageReady: { action: identify, text: "Give me a Haiku" },
    identifying: { text: "Identifying..." },
    complete: { action: reset, text: "Reset" },
  };

  async identify () {
    this.setState(imageReady)
    const results = await model.classify(imageRef.current);
    setResults(results);
    console.log(results);
    let word = results[0].className.split(", ")[0];
    word = word.replace(" ", "+")
    console.log("typeof word")
    props.updateWord(word);
    next();
  };

  const reset = async () => {
    setResults([]);
    next();
  };

  render() {
  const inputRef = useRef(); //could be null
  const upload = () => inputRef.current.click();
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

      <button onClick={upload}>
        {actionButton[this.state.currState.name].text}
      </button>
    </div>
    )
  }
}
function ImageLoader(props) {
  const [results, setResults] = useState([]);
  const [imageURL, setImageURL] = useState(null);
  // const imageRef = useRef();


  // const reducer = (state, event) =>
  //   machine.states[state].on[event] || machine.initial;

  // const [appState, dispatch] = useReducer(reducer, machine.initial);
  // const next = () => dispatch("next");

  const { showImage, showResults } = machine.states[appState];

}

export default ImageLoader;
