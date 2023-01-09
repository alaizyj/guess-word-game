'use strict';
const express = require('express');
const app = express();
const PORT = 3000;
const cookieParser = require('cookie-parser');
const uuidv4 = require('uuid').v4;
const words = require('./words');
const data = require('./data');
const gameWeb = require('./game-web');
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('./public'));

app.get('/', (req, res) => {
    const sid = req.cookies.sid;
    res.send(gameWeb.homePage(sid, ''));
});

app.post('/login', (req, res) => {
    const username = req.body.username.trim();
    if (username === 'dog') {
        res.status(401).send(gameWeb.homePage(null, 'dog'));
        return;
    }
    const isValidUserName = data.checkUsername(username);
    if (!isValidUserName) {
        res.status(401).send(gameWeb.homePage(null, 'oops'));
        return;
    }
    const sid = uuidv4();
    data.addUser(sid, username);
    //For grading purpose
    console.log(data.userWords[username]['secretWord']);
    res.cookie('sid', sid);
    res.redirect('/');
});

app.post('/guess', (req, res) => {
    const sid = req.cookies.sid;
    if (!sid || !data.users[sid]) {
        res.send(gameWeb.homePage(sid, ''));
    }
    const guessWord = req.body.guessword.trim();
    data.updateWordInfo(sid, guessWord);
    res.redirect('/');
});

app.post('/new-game', (req, res) => {
    const sid = req.cookies.sid;
    if (!sid || !data.users[sid]) {
        res.send(gameWeb.homePage(sid, ''));
    }
    const secretWord = data.getSecretWord(words);
    //For grading purpose
    console.log(secretWord);
    data.initializeWordInfo(sid, secretWord);
    res.redirect('/');
});

app.post('/logout', (req, res) => {
    const sid = req.cookies.sid;
    if (!sid || !data.users[sid]) {
        res.send(gameWeb.homePage(sid, ''));
        return;
    }
    data.deleteUser(sid);
    res.clearCookie('sid');
    res.redirect('/');
});

app.get('/login', (req, res) => {
    res.redirect('/');
});
app.get('/logout', (req, res) => {
    res.redirect('/');
});
app.get('/new-game', (req, res) => {
    res.redirect('/');
});
app.get('/guess', (req, res) => {
    res.redirect('/');
});
app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));