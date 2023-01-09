'use strict';
const users = {};
const userWords = {};
const words = require('./words');

function checkUsername(userName) {
    if (userName === '') {
        return false;
    }
    return /^[A-Za-z0-9]*$/.test(userName);
}

function addUser(sid, username) {
    users[sid] = username;
    if (!userWords[username]) {
        const secretWord = getSecretWord(words);
        initializeWordInfo(sid, secretWord);
    }
}

function deleteUser(sid) {
    if (users[sid]) {
        delete users[sid];
    }
}

function initializeWordInfo(sid, secretWord) {
    const username = users[sid];
    const wordInfo = {
        secretWord: secretWord,
        guesses: [],
        counts: [],
        win: false,
        validGuesses: 0,
    };
    userWords[username] = wordInfo;
}

function compareTwoWords(sid, guess) {
    const username = data.users[sid];
    const word = data.userWords[username]['secretWord'];
    const guesses = data.userWords[username]['guesses'];
    const guessesLowerCase = guesses.map((guess) => {
        return guess.toLowerCase();
    });

    if (!words.includes(guess.toLowerCase()) ||
        guessesLowerCase.includes(guess.toLowerCase())
    ) {
        return -1;
    }

    //count characters in word and guess
    function letterCountOf(word) {
        const letterCounts = {};
        word
            .toLowerCase()
            .split('')
            .forEach((letter) => {
                letterCounts[letter] = letterCounts[letter] + 1 || 1;
            });
        return letterCounts;
    }

    const wordCounts = letterCountOf(word);
    const guessCounts = letterCountOf(guess);

    let matched = 0;
    for (let letter in guessCounts) {
        const wordCount = wordCounts[letter] || 0;
        const guessCount = guessCounts[letter] || 0;
        matched += Math.min(wordCount, guessCount);
    }

    return matched;
}

function getSecretWord(words) {
    const wordsLength = words.length;
    return words[Math.floor(Math.random() * wordsLength)];
}

function updateWordInfo(sid, guess) {
    //update database
    const result = compareTwoWords(sid, guess);
    const username = users[sid];
    const guesses = userWords[username]['guesses'];
    const counts = userWords[username]['counts'];
    if (result === -1) {
        guesses.push(guess);
        counts.push(-1);
    } else {
        guesses.push(guess);
        counts.push(result);
        userWords[username]['validGuesses']++;
    }
    const word = userWords[username]['secretWord'];
    if (result == word.length) {
        userWords[username]['win'] = true;
    }
}

const data = {
    users,
    userWords,
    checkUsername,
    addUser,
    deleteUser,
    initializeWordInfo,
    getSecretWord,
    updateWordInfo,
};

module.exports = data;