'use strict';

(function() {
    const secretWordButton = document.querySelector('.secretword-button');
    const secretWordEl = document.querySelector('.secret-word');
    if (secretWordButton) {
        secretWordButton.addEventListener('click', () => {
            if (secretWordButton.innerText == 'Show') {
                secretWordButton.innerText = 'Hide';
            } else {
                secretWordButton.innerText = 'Show';
            }
            secretWordEl.classList.toggle('secret-word-show');
        });
    }

    const inputGuess = document.querySelector('#guess-input');
    const guessSubmitButton = document.querySelector('#guess-submit-button');
    const guessErrorMessage = document.querySelector('.guess-error-message');
    if (inputGuess) {
        inputGuess.addEventListener('keyup', () => {
            if (inputGuess.value != '') {
                guessSubmitButton.removeAttribute('disabled');
                guessSubmitButton.classList.add('guess-button');
            } else {
                guessSubmitButton.setAttribute('disabled', '');
                guessSubmitButton.classList.remove('guess-button');
            }
        });
    }
    if (guessSubmitButton) {
        guessSubmitButton.addEventListener('click', (e) => {
            if (inputGuess.value.length != 5) {
                e.preventDefault();
                guessErrorMessage.innerText = 'Word length must be five!';
            }
        });
    }
})();