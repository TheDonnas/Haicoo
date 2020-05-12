import WordFetcher from "./wordFetcher"

export default class HaikuGenerator extends WordFetcher {
  choose(choices) {
    let index = Math.floor(Math.random() * choices.length);
    return choices[index];
  }

  async buildHaiku() {
    try {
      let haikuSyllables = [5, 7, 5];
      let result = []; // will be a nested arr
      let currWordType = this.choose(["adj", "n", "v"]);
      let structureMap = {
        n: { next: "v", wordList: await this.nouns },
        v: {
          next: this.choose(["adv", "adj"]),
          wordList: await this.verbs,
        },
        adj: {
          next: "n",
          wordList: await this.adj,
        },
        adv: {
          next: this.choose(["adj", "n"]),
          wordList: await this.adv,
        },
      };
      let usedWords = []; // ["salad", "sweet"]
      console.log("HAIKUGENERATOR BEFORE FOR LOOP");
      for (let syllableCount of haikuSyllables) {
        //haikuSyllables = [5, 7, 5];
        let syllableTarget = syllableCount; // 5-2, 3-1, 0
        let currLine = []; //["salad", "sweet"]
        let errCount = 0; //1
        let counter = 0;
        while (syllableTarget > 0 && counter < 30) {
          if (counter === 29) {
            console.log("I AM GOING TO TAKE YOU OUT OF THIS INFINITE LOOP ;)");
          }
          counter++;
          console.log("PART OF SPEECH", structureMap[currWordType].next);
          errCount += 1; // 1
          let currWords = []; //["salad", "sweet", "baked"] STORE EVERY POSSIBLE WORD <= 5/7 SYLL
          for (let word of structureMap[currWordType].wordList) {
            if (word.numSyllables && word["numSyllables"] <= syllableTarget) {
              currWords.push(word);
            }
          }
          let wordToAdd = this.choose(currWords); // choose random possible word in arr {word:, score:, etc}
          if (
            wordToAdd &&
            usedWords.includes(wordToAdd["word"]) &&
            errCount < 5
          ) {
            continue;
          } else if (wordToAdd) {
            usedWords.push(wordToAdd["word"]);
            currLine.push(wordToAdd["word"]);
            syllableTarget -= wordToAdd["numSyllables"];
          }
          currWordType = structureMap[currWordType].next;
        }
        result.push(currLine);
      }

      return result;
      // `${result[0].join(" ")}\n${result[1].join(" ")}\n${result[2].join(
      //   " "
      // )}`;
    } catch (error) {
      console.log(error);
    }
  }
}

// function main() {
//   let pg = new HaikuGenerator("flower");
//   console.log(pg.buildHaiku());
// }

// main();

// const generator = new PoemGenerator();
// const results = generator.getRelatedWords("flower");
// console.log("RESULTS", results);
