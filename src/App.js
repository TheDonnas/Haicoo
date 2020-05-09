import React from 'react'
import ImageLoader from './image-loader'
import Haiku from './haiku'

class App extends React.Component{
  constructor(){
    super()
    this.state = {
      word :''
    }
    this.updateWord = this.updateWord.bind(this)
  }
  updateWord(word){
    this.setState({word})
  }
  render() {
    console.log("THIS STATE IN APP", this.state)
    return(
      <div>

        <ImageLoader updateWord= {this.updateWord}/>
        {this.state.word.length
        ? <Haiku word = {this.state.word}/>
        :<div/>}
      </div>
    )
  }
}

export default App
