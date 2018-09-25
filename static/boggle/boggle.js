this.boggle = this.boggle || {};

(function(boggle) {
  "use strict";
  boggle.options = {
    grid: {
      width: 4,
      height: 4
    }
  };

  boggle.forEach = function (array, fn) {
    var i, retval;
    for(i = 0; i < array.length; i++) {
      retval = fn.call(this, array[i], i);
      if(retval) {
        return retval;
      }
    }
  };

  boggle.forEachKeyValue = function (object, fn) {
    for(var key in object) {
      if(object.hasOwnProperty(key)) {
        fn.call(this, key, object[key]);
      }
    }
  };

  boggle.keys = function (object) {
    var retval = [];
    for(var key in object) {
      if(object.hasOwnProperty(key)) {
        retval.push(key);
      }
    }
    return retval;
  };

  boggle.map = function (array, fn) {
    var i, retval = [], callback;
    callback = function (el, i) {
      return fn.call(boggle, el, i);
    };
    if(typeof array.map === "function") {
      return array.map(callback);
    }
    for(i = 0; i < array.length; i++) {
      retval[retval.length] = fn.call(this, array[i], i);
    }
    return retval;
  };

  boggle._adjacencyMap = [
  /*  0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F */
    [ 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],		/* 0 */
    [ 1, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],		/* 1 */
    [ 0, 1, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0 ],		/* 2 */
    [ 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0 ],		/* 3 */
    [ 1, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0 ],		/* 4 */
    [ 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0 ],		/* 5 */
    [ 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0 ],		/* 6 */
    [ 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0 ],		/* 7 */
    [ 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0 ],		/* 8 */
    [ 0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0 ],		/* 9 */
    [ 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1 ],		/* A */
    [ 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1 ],		/* B */
    [ 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0 ],		/* C */
    [ 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1, 0 ],		/* D */
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1 ],		/* E */
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0 ]		/* F */
  ];

  boggle._cubes = [
		"ednosw", "aaciot", "acelrs", "ehinps",
		"eefhiy", "elpstu", "acdemp", "gilruw",
		"egkluy", "ahmors", "abilty", "adenvz",
		"bfiorx", "dknotu", "abjmoq", "egintv"
	]; 

  // Find all of the cubeIndexes at which letter1 is adjacent 
  // to letter2, as indicated by a mapping of letters to cubeIndexes
  // where the letter can be found.
  boggle._findPotentialWordCubesForLetter = function (letter1, letter2, letterMap) {
    var retval = {
      letter: letter1,
      used: false,
      cubeIndexes: []
    },
        set1 = letterMap[letter1] || [],
        set2 = letterMap[letter2] || [];

    if(letter2 == null) {
      retval.cubeIndexes = set1;
      return retval;
    }

    this.forEach(set1, function (index1) {
      this.forEach(set2, function (index2) {
        if(this._adjacencyMap[index1][index2]) {
          retval.cubeIndexes.push(index1);
        }
      });
    });
    return retval;
  };

  boggle._debug = function () {
    // window.console.debug.apply(window.console, arguments);
  };


  boggle.WordSearch = function (word, letterMap) {
    this.word = word;
    this.usedbits = 0;
    this.potentialWordCubes = boggle.map(word, function (letter, letterIndex) {
        var nextLetter = word[letterIndex + 1];
        return this._findPotentialWordCubesForLetter(letter, nextLetter, letterMap);
    });
  };

  // Given a set of sets of cubes, find a spatially continuous path using one
  // cube from each set. Additionally, though the same cube may appear in 
  // multiple sets, the path can only use each cube once. In other words, the
  // path must be like that of a valid word in a Boggle letter grid.
  //
  // If such a path exists, return 1, else return -1.
  boggle.WordSearch.prototype.findPath = function () {
    return boggle._findPathRecursively(this.potentialWordCubes, this.usedbits, null);
  };

  boggle._findPathRecursively = function (potentialWordCubes, usedbits, startCubeIndex) {
    var retval = [];
    this.forEach(potentialWordCubes, function (potentialWordCubesForLetter, letterIndex) {
      return this.forEach(potentialWordCubesForLetter.cubeIndexes, function (cubeIndex) {
        if(!((1 << cubeIndex) & usedbits) &&
          (startCubeIndex == null || this._adjacencyMap[startCubeIndex][cubeIndex] == 1)) {
            usedbits |= 1 << cubeIndex;
            if(potentialWordCubes.length === 1) {
              retval.unshift(cubeIndex);
            } else {
              retval = this._findPathRecursively(
                potentialWordCubes.slice(letterIndex + 1),
                usedbits,
                cubeIndex
              );
              retval.unshift(cubeIndex);
              return retval;
            }
        }
      }) || [];
    });
    return retval;
  };

  boggle.findWord = function (word, letterMap) {
    var search = new boggle.WordSearch(word, letterMap);

    return search.findPath();
  };

  boggle.createLetterMap = function (letterGrid) {
    var letterMap = {};

    boggle.forEach(letterGrid, function (letter, gridIndex) {
      var gridIndexes = letterMap[letter] = letterMap[letter] || [];
      gridIndexes.push(gridIndex);
    });

    return letterMap;
  };

  boggle.findWords = function (wordList, letterMap) {
    var foundWords = {};

    this.forEach(wordList, function (word) {
      var path = boggle.findWord(word, letterMap);
      if(path.length === word.length) {
        foundWords[word] = path;
      }
    });
    return foundWords;
  };

  boggle.findWordsBasic = function (wordList, letterGrid) {
    return boggle.keys(boggle.findWords(wordList, boggle.createLetterMap(letterGrid)));
  };

  boggle.random = function (min, max) {
    return Math.random() * max + min;
  };

  boggle.shuffle = function (array) {
    var retval = [], rindex;
    this.forEach(array, function (item) {
      do {
        rindex = Math.floor(this.random(0, array.length));
      } while(retval[rindex] != null);
      retval[rindex] = item;
    });
    return retval;
  };

  boggle.createLetterGrid = function () {
    var shuffledCubes = this.shuffle(this._cubes);
    return this.map(shuffledCubes, function (cube) {
      return cube[Math.floor(this.random(0, cube.length))];
    });
  };

  boggle.scoreWord = function (word) {
    switch(word.length) {
      case 0:
      case 1:
      case 2:
        return 0;
      case 3:
      case 4:
        return 1;
      case 5:
        return 2;
      case 6:
        return 3;
      case 7:
        return 5;
      default:
        return 11;
    }
  };

})(this.boggle);
