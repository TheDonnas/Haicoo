const fetch = require("node-fetch");
// const DATAMUSE_FULL_APIBASE =
//   "https://cors-anywhere.herokuapp.com/https://api.datamuse.com/words?md=sp&sp=s*";
const DATAMUSE_APIBASE =
  "https://cors-anywhere.herokuapp.com/https://api.datamuse.com/words?md=sp&max=250";
//getting a COR local host error will need to debug without this route // change to axios?
// const DATAMUSE_LIMIT_ARG = "&max={}";
// const DATAMUSE_STARTSWITH_ARG = "&sp={}*";
// const LINE_SPACE = "\n";

export default class WordFetcher {
  constructor(word) {
    this.word = word;
    Promise.all([
      (this.followingWords = this.getFollowingWords(word)),
      (this.nouns = this.getNouns(word)),
      (this.verbs = this.getVerbs(word)),
      (this.adj = this.getAdj(word)),
      (this.adv = this.getAdv(word)),
      (this.relatedWords = this.getRelatedWords(word)),
    ]).then((results) => {
      const [followingWords, nouns, verbs, adj, adv, relatedWords] = results;

      console.log(
        "PROMISE RESULTS",
        "followingWords: ",
        followingWords,
        "nouns: ",
        nouns,
        "verbs: ",
        verbs,
        "adjectives: ",
        adj,
        "adverbs: ",
        adv,
        "relatedWords: ",
        relatedWords
      );
    });

    // this.associatedWords = this.getAssociatedWords(word);
    // this.synonyms = this.getSynonyms(word);
    // this.kindofWords = this.getKindofWords(word);
    // this.precedingWords = this.getPrecedingWords(word);
    // this.allNouns = this.getAllNouns()
    // this.allVerbs = this.getAllVerbs()
    // // this.allAdj = this.getAllAdj()
    // this.allAdv = this.getAllAdv()
  }

  async requestWords(url) {
    try {
      const res = await fetch(url);
      const data = await res.json();
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

  async getNouns(word) {
    try {
      const popularNouns = await this.requestWords(
        `${DATAMUSE_APIBASE}&rel_jja=${word}`
      );
      const relatedNouns = await this.requestWords(
        `${DATAMUSE_APIBASE}&ml=${word}`
      );
      let nouns;
      if (popularNouns.length < 1) {
        nouns = [
          {word: "life", numSyllables: 1},
          {word: "joy", numSyllables: 1},
          {word: "magic", numSyllables: 2},
          {word: "comedy", numSyllables: 3},
          {word: "colors", numSyllables: 2},
          {word: "light", numSyllables: 1},
        ]
      } else if (popularNouns.length < 5) {
        nouns = relatedNouns;
      } else {
        nouns = popularNouns;
      }
      return nouns;
    } catch (error) {
      console.log(error);
    }
  }

  async getVerbs(word) {
    try {
      const followingWords = await this.followingWords;
      let verbsList = [];
      for (let i in followingWords) {
        if (followingWords[i].tags && followingWords[i].tags.includes("v")) {
          verbsList.push(followingWords[i]);
        }
      }
      if (verbsList.length < 1) {
        verbsList = [
          {word: "am", numSyllables: 1},
          {word: "are", numSyllables: 1},
          {word: "were", numSyllables: 1},
          {word: "is", numSyllables: 1},
          {word: "be", numSyllables: 1},
          {word: "can", numSyllables: 1},
          {word: "will", numSyllables: 1},
          {word: "love", numSyllables: 1},
        ];
      }
      return verbsList;
    } catch (error) {
      console.log(error);
    }
  }

  async getAdv(word) {
    try {
      const followingWords = await this.followingWords;
      let advList = [];
      if (followingWords.length < 1) {
        advList = [
          {word: "cheerfully", numSyllables: 3},
          {word: "happily", numSyllables: 3},
          {word: "warmly", numSyllables: 2},
          {word: "finally", numSyllables: 3},
          {word: "sometimes", numSyllables: 3},
          {word: "slowly", numSyllables: 2},
          {word: "only", numSyllables: 2},
          {word: "always", numSyllables: 2},
        ]
      } else {
          for (let i in followingWords) {
            if (followingWords[i].tags && followingWords[i].tags.includes("adv")) {
              advList.push(followingWords[i]);
            }
        }
      }
      return advList;
    } catch (error) {
      console.log(error);
    }
  }

  async getAdj(word) {
    try {
      let adjs = await this.requestWords(
        `${DATAMUSE_APIBASE}&rel_jjb=${word}`
      );
      if (adjs.length < 1) {
        adjs = [
          {word: "beautiful", numSyllables: 4},
          {word: "fancy", numSyllables: 2},
          {word: "faithful", numSyllables: 2},
          {word: "silly", numSyllables: 2},
          {word: "calm", numSyllables: 1},
          {word: "nice", numSyllables: 1},
        ]
      }
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
