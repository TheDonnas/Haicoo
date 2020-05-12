import React from "react";
import HaikuGenerator from "./haiku-generator";

class Haiku extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      poem: "",
    };
  }
  async componentDidMount() {
    console.log("haiku Prop", this.props.word);
    if (!this.props.word.length) {
      return;
    } else {
      let generator = new HaikuGenerator(this.props.word);
      //const generator = new HaikuGenerator("flower"); //TEST ONLY
      const poem = await generator.buildHaiku();
      //let poem = new HaikuGenerator(this.props.word);
      //word from props that comes from image
      //when component mounts set state with poem after haiku generator is called
      console.log(poem);
      this.setState({ poem });
    }
  }
  render() {
    return <div>{this.state.poem}</div>;
  }
}

export default Haiku;
