//configuration of the pin pad for the mecanic login, it reads the numbers choosen and then sends to <<define>> in order to authenticate with db

class PinLogin {
  constructor ({el, loginEndpoint, redirectTo, maxNumbers = Infinity}) {
      this.el = {
          main: el,
          numPad: el.querySelector(".pin-login__numpad"),
          textDisplay: el.querySelector(".pin-login__text")
      };

      this.loginEndpoint = loginEndpoint;
      this.redirectTo = redirectTo;
      this.maxNumbers = maxNumbers;
      this.value = "";

      this._generatePad();
  }

  //generate the layout
  _generatePad() {
      const padLayout = [
          "1", "2", "3",
          "4", "5", "6",
          "7", "8", "9",
          "backspace", "0", "done"
      ];

      padLayout.forEach(key => {
          const insertBreak = key.search(/[369]/) !== -1;
          const keyEl = document.createElement("div");

          //add the 2 icons
          keyEl.classList.add("pin-login__key");
          keyEl.classList.toggle("material-icons", isNaN(key));
          keyEl.textContent = key;
          keyEl.addEventListener("click", () => { this._handleKeyPress(key) });
          this.el.numPad.appendChild(keyEl);

          if (insertBreak) {
              this.el.numPad.appendChild(document.createElement("br"));
          }
      });
  }

  //what to do when a key is pressed
  _handleKeyPress(key) {
      switch (key) {
          case "backspace":
              this.value = this.value.substring(0, this.value.length - 1);
              break;
          case "done":
              this._attemptLogin();
              break;
          default:
              if (this.value.length < this.maxNumbers && !isNaN(key)) {
                  this.value += key;
              }
              break;
      }

      this._updateValueText();
  }

  //show the 'points' on the display
  _updateValueText() {
      this.el.textDisplay.value = "_".repeat(this.value.length);
      this.el.textDisplay.classList.remove("pin-login__text--error");
  }

  //what happens when "done" is pressed, change here for working with bd
  _attemptLogin() {
      if (this.value.length > 0) {
          fetch(this.loginEndpoint, {
              method: "post",
              headers: {
                  "Content-Type": "application/x-www-form-urlencoded"
              },
              body: `pincode=${this.value}`
          }).then(response => {
              if (response/* .status === 200 */) {
                  window.location.href = this.redirectTo;
              } else {
                  this.el.textDisplay.classList.add("pin-login__text--error");
              }
          })
      }
  }
}


//construct new class of the pin pad
new PinLogin({
  el: document.getElementById('mainPinLogin'),
  loginEndpoint: 'app.js',
  redirectTo: '../workview',
  maxNumber: 6
});