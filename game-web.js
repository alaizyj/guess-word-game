'use strict';
const data = require('./data');
const words = require('./words');

const gameWeb = {
    homePage: function(sid, errorcode) {
        return `
        <!doctype html>
        <html>
          <head>
            <title>Word Guess</title>
            <link rel="stylesheet" href="/css/styles.css">
            <script src="/script/script.js" defer></script>
          </head>
          <body>  
            <div class="app">
            ${gameWeb.loginPage(sid, errorcode)}
            ${gameWeb.wordList(sid)}
            ${gameWeb.guessList(sid)}
            ${gameWeb.errorPage(errorcode)} 
            ${gameWeb.guessForm(sid)}
            ${gameWeb.bottomForm(sid)}
            </div>
            <footer>
            <p class="footer-content">INFO 6250 Midterm Project by Yajian Zhang </p>
            </footer>
            
          </body>
        </html>
        `;
    },

    loginPage: function(sid, errorcode) {
        if (data.users[sid] && sid) {
            return ``;
        }
        if (errorcode) {
            return ``;
        }
        return `
        <div class="login-page">
        <img src="img/game.png" class="login-img"/>
        <h1 class="login-header">Welcome to the Game!</h1>
        <form action="/login" method="post" class="login-form">
        <div class="login-input-section">
        <label class="login-label" for="login-input">Username:</label>
        <input type="text" id="login-input" name="username" size="20"></input>
        <button type="submit" class="login-button">LOGIN</button>
        </div>
        </form>
        </div>

        `;
    },

    wordList: function(sid) {
        if (!data.users[sid] || !sid) {
            return ``;
        }
        const username = data.users[sid];
        const guesses = data.userWords[username]['guesses'];
        const guessesLowerCase = guesses.map((guess) => {
            return guess.toLowerCase();
        });

        return (
            `<div class="wordlist-section">
            <h1 class="words-header">Word Bank</h1>
        <ul class="word-list">` +
            Object.values(words)
            .map(
                (word) => `
        <li class=${
          guessesLowerCase.includes(word) ? 'single-word-chosen' : 'single-word'
        }>${word}</li>
        `
            )
            .join('') +
            `</ul>
            </div>`
        );
    },

    guessList: function(sid) {
        if (!data.users[sid] || !sid) {
            return ``;
        }
        const username = data.users[sid];
        const validGuesses = data.userWords[username]['validGuesses'];
        const guesses = data.userWords[username]['guesses'];
        const counts = data.userWords[username]['counts'];
        const win = data.userWords[username]['win'];
        const secretWord = data.userWords[username]['secretWord'];
        return (
            `
        <div class="guessword-section">
        <h2 class="secretword-header">Secret Word</h2>
        <div class="secretword-info">
        <p class=${win ? 'secret-word-show' : 'secret-word'}>${secretWord}</p>
        <button class=${
          win ? 'secretword-button-hide' : 'secretword-button'
        }>Show</button>
        </div>
        <div class="guessword-info-list">
        <h2 class="guessword-info-title">Previous Guesses & Number of Matching Letters (case-insensitive)</h2>
        <h3 class="guessword-info-subtitle">${
          guesses.length === 0 ? 'It is Empty, give it a try!' : ''
        }</h3>
        <ul class="guessword-info-ul">` +
            Object.keys(guesses)
            .map(
                (index) => `
               <li class=${
                 counts[index] === -1
                   ? 'single-guessword-invalid'
                   : 'single-guessword-li'
               }>
               <div class="single-guessword-info">
               <span class="single-guessword-word">"${guesses[index]}": </span>
               <span class="single-guessword-counts">${
                 counts[index] === -1 ? 'Invalid' : counts[index]
               }
               </span>
               </div>
               </li>
                  `
            )
            .join('') +
            `</ul>
       </div>

       <div class="guessword-info-header">
       <h2 class="guessword-info-title">Valid Guesses: ${validGuesses}</h2>
       </div>

       <div class="big">

       </div>
       </div>
        
        `
        );
    },

    guessForm: function(sid) {
        if (!data.users[sid] || !sid) {
            return ``;
        }
        const username = data.users[sid];
        const win = data.userWords[username]['win'];
        return win ?
            `<div class="win-page"> 
            <img src="/img/win.png" class="win-img" />
            <p class="win-message">Hi ${username}, congratulations, you win!</p> 
            </div>` :
            `
        <form action="/guess" method="post" class="guess-form">
        <div class="guess-input-section">
        <label class="guess-label" for="guess-input">Guess:</label>
        <input type="text" id="guess-input" name="guessword" size="20"></input>
        <button type="submit" id="guess-submit-button" class="guess-button-disabled" disabled>Submit</button>
        </div>
        <p class="guess-error-message"></p>
        </form>
        `;
    },

    errorPage: function(errorcode) {
        if (!errorcode) {
            return ``;
        }
        return `
        <div class="error-page">
        <img class="error-img" src="img/${
          errorcode == 'dog' ? 'dog' : 'oops'
        }.png" />
        <p class="error-message">${
          errorcode == 'dog'
            ? 'Sorry, currently the game is not for dogs!'
            : 'Username cannot be empty and should consist of only numbers and digits!'
        }</p>
        <a href="/" class="home-button">LOGIN</a>
        </div>
        `;
    },

    bottomForm: function(sid) {
        if (!data.users[sid] || !sid) {
            return ``;
        }
        return `
        <div class="bottom-form">

        <form action="/logout" method="post" class="logout-form">
        <button type="submit" class="logout-button">Log Out</button>
        </form>

        <form action="/new-game" method="post" class="newgame-form">
        <button type="submit" class="newgame-button">New Game</button>
        </form>
        </div>
        `;
    },
};

module.exports = gameWeb;