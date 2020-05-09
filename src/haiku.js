// const fetch = require("node-fetch");
const DATAMUSE_FULL_APIBASE = "https://api.datamuse.com/words?md=sp&sp=s*";
const DATAMUSE_APIBASE = "https://api.datamuse.com/words?md=sp&max=250";
const DATAMUSE_LIMIT_ARG = "&max={}";
const DATAMUSE_STARTSWITH_ARG = "&sp={}*";
const LINE_SPACE = "\n";

class PoemGenerator {
  constructor(word) {
    this.word = word;
    this.nouns = this.getNouns(word);
    this.verbs = this.getVerbs(word);
    this.adj = this.getAdj(word);
    // this.associatedWords = this.getAssociatedWords(word);
    // this.synonyms = this.getSynonyms(word);
    // this.kindofWords = this.getKindofWords(word);
    // this.precedingWords = this.getPrecedingWords(word);
    this.followingWords = this.getFollowingWords(word);
    this.adv = this.getAdv(word);
    this.relatedWords = this.getRelatedWords(word);

    // this.allNouns = this.getAllNouns()
    // this.allVerbs = this.getAllVerbs()
    // // this.allAdj = this.getAllAdj()
    // this.allAdv = this.getAllAdv()
  }

  async requestWords(url) {
    try {
      const res = await fetch(url);
      const data = await res.json();
      // console.log("getReq: ", res);
      // console.log("DATA: ", data);
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  async getRelatedWords(word) {
    try {
      const relatedWordsUrl = `${DATAMUSE_APIBASE}&ml=${word}`;
      this.relatedWords = await this.requestWords(relatedWordsUrl);
      return this.relatedWords;
    } catch (error) {
      console.log(error);
    }
  }

  async getNouns(word) {
    try {
      const nouns = await this.requestWords(
        `${DATAMUSE_APIBASE}&rel_jja=${word}`
      );
      return nouns;
    } catch (error) {
      console.log(error);
    }
  }

  async getVerbs(word) {
    try {
      const relatedWords = await this.relatedWords;
      let verbsList = [];
      for (let i in relatedWords) {
        if (relatedWords[i].tags && relatedWords[i].tags.includes("v")) {
          verbsList.push(relatedWords[i]);
        }
      }
      console.log("VERB LIST", verbsList);
      return verbsList;
    } catch (error) {
      console.log(error);
    }
  }

  async getAdv(word) {
    try {
      const followingWords = await this.followingWords;
      // console.log("FOLLOWINGWORDS: ", followingWords);
      let advList = [];
      for (let i in followingWords) {
        if (followingWords[i].tags && followingWords[i].tags.includes("adv")) {
          advList.push(followingWords[i]);
        }
      }
      // console.log("ADV LIST: ", advList);
      return advList;
    } catch (error) {
      console.log(error);
    }
  }

  async getAdj(word) {
    try {
      const adjs = await this.requestWords(
        `${DATAMUSE_APIBASE}&rel_jjb=${word}`
      );
      return adjs;
    } catch (error) {
      console.log(error);
    }
  }

  // async getAssociatedWords(word) {
  //   this.associatedWords = await this.requestWords(
  //     `${DATAMUSE_APIBASE}&rel_trg=${word}`
  //   );
  //   return this.associatedWords;
  // }

  // async getSynonyms(word) {
  //   this.synonyms = await this.requestWords(
  //     `${DATAMUSE_APIBASE}&rel_syn=${word}`
  //   );
  //   return this.synonyms;
  // }

  // async getKindofWords(word) {
  //   this.kindofWords = await this.requestWords(
  //     `${DATAMUSE_APIBASE}&rel_spc=${word}`
  //   );
  //   return this.kindofWords;
  // }

  // async getPrecedingWords(word) {
  //   this.precedingWords = await this.requestWords(
  //     `${DATAMUSE_APIBASE}&rel_bgb=${word}`
  //   );
  //   return this.precedingWords;
  // }

  async getFollowingWords(word) {
    try {
      this.followingWords = await this.requestWords(
        `${DATAMUSE_APIBASE}&rel_bga=${word}`
      );
      return this.followingWords;
    } catch (error) {
      console.log(error);
    }
  }

  //   indirectExtendWordLists(wordType="n") {
  //       let extraWords = []
  //       extraWords.push(this.associatedWords);
  //       extraWords.push(this.synonyms)
  //       extraWords.push(this.kindofWords)
  //       extraWords.push(this.precedingWords)
  //       extraWords.push(this.followingWords)
  //       let indirectWList = []
  //       for (let i in extraWords) {
  //         console.log('WORD IN FOR LOOP: ', extraWords[i])
  //         console.log('TAGS: ', extraWords[i].tags)
  //         // if(extraWords[word]["tags"].includes(wordType)) {
  //             // indirectWList.push(...extraWords[word])
  //         // }
  //       }
  //       console.log("EXTRA WORDS: ", extraWords)
  //       console.log('INDIRECT WORDS: ', indirectWList)
  //       return indirectWList
  //   }

  //   getAllNouns() {
  //       this.nouns.push(this.indirectExtendWordLists("n"));
  //       console.log('THIS.NOUNS: ', this.nouns)
  //       let nounsList = [];
  //       for (let n in this.nouns) {
  //           if(n["word"]) {
  //               nounsList.push(n)
  //           }
  //       }
  //       return nounsList
  //   }

  //   getAllVerbs() {
  //     this.verbs.push(this.indirectExtendWordLists("v"));
  //     let verbsList = [];
  //     for (let v in this.verbs) {
  //         if(v["word"]) {
  //             verbsList.push(v)
  //         }
  //     }
  //     return verbsList
  //     }

  //   getAllAdj() {
  //     this.adj.push(this.indirectExtendWordLists("adj"));
  //     let adjList = [];
  //     for (let adj in this.adj) {
  //         if(adj["word"]) {
  //             adjList.push(adj)
  //         }
  //     }
  //     return adjList
  //   }

  //   getAllAdv() {
  //     if (this.followingWords()) {
  //         let adverb = this.indirectExtendWordLists("adv")
  //         let advList = [];
  //         for (let adv in adverb) {
  //             if(adv["word"]) {
  //                 advList.push(adv)
  //             }
  //         }
  //         console.log("ADV: ", advList)
  //         return advList
  //         }
  //     }
}

class HaikuGenerator extends PoemGenerator {
  choose(choices) {
    //choices = []
    let index = Math.floor(Math.random() * choices.length);
    return choices[index];
  }

  async buildHaiku() {
    console.log("THIS IS INSIDE HAIKUGENERATOR");
    try {
      let haikuSyllables = [5, 7, 5];
      let result = []; // will be a nested arr
      let currWordType = this.choose(["adj", "n", "v"]);
      console.log(currWordType);
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
        while (syllableTarget > 0) {
          console.log("PART OF SPEECH", structureMap[currWordType].next);
          errCount += 1; // 1
          let currWords = []; //["salad", "sweet", "baked"] STORE EVERY POSSIBLE WORD <= 5/7 SYLL
          // console.log("STMAP.CURRWORD TYPE: ", structureMap["n"]);
          // console.log("STMAP.CURRWORD TYPE: ", structureMap.n["wordList"]);
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
            //wordToAdd is truthy
            usedWords.push(wordToAdd["word"]);
            currLine.push(wordToAdd["word"]);
            syllableTarget -= wordToAdd["numSyllables"];
          }
          currWordType = structureMap[currWordType].next;
        }
        console.log("HAIKUGENERATOR AFTER WHILE LOOP");
        result.push(currLine);
      }
      console.log(result, "result");
      console.log(
        `${result[0].join(" ")}\n${result[1].join(" ")}\n${result[2].join(" ")}`
      );
    } catch (error) {
      console.log(error);
    }
  }
}

function main() {
  let pg = new HaikuGenerator("flower");
  console.log(pg.buildHaiku());
}

main();

