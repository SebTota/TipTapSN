export default class SKPrompt {
   /*
   callback: (text) => {}
   */
    constructor({ title, text, placeholder, submitCallback, dismissCallback }) {
      this.title = title;
      this.text = text;
      this.placeholder = placeholder;
      this.submitCallback = submitCallback;
      this.dismissCallback = dismissCallback;
    }

    promptString() {
      let promptStr = `<div class="sk-panel-row">
      ${this.text ? `<p class='sk-p'>${this.text}</p>` : ''}
      </div>
      <div class="sk-panel-row">
      <input id="sk-prompt-input" class="sk-input contrast" ${this.placeholder ? `placeholder="${this.placeholder}"` : ''}/>
      </div>`
      return promptStr;
    }
  
    buttonsString() {
      let str = `
        <div class='sk-button-group'>
        <button id='sk-prompt-button-close' class='sn-button small'>
          <div class='sk-label'>Close</div>
        </button>
        <button id='sk-prompt-button-ok' class='sn-button small neutral'>
          <div class='sk-label'>OK</div>
        </button>
        </div>
      `;
      return str;
    }
  
    templateString() {
      let panelStyle;
      let titleTemplate = this.title
        ? `<div class='sk-h3 sk-panel-section-title'>${this.title}</div>`
        : '';
  
      let template = `
        <div class="sk-modal">
          <div class="sk-modal-background"></div>
          <div class="sk-modal-content">
            <div class="sn-component">
              <div class="sk-panel" style='max-width: 500px;'>
                <div class="sk-panel-content" ${panelStyle}>
                  <div class="sk-panel-section">
                    ${titleTemplate}
                    ${this.promptString()}
                    ${this.buttonsString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
  
      return template;
    }
  
    dismiss() {
      this.onElement.removeChild(this.element);
      if (this.dismissCallback) this.dismissCallback();
    }

    submit() {
      let promptResult = this.element.querySelector('#sk-prompt-input').value;
      this.onElement.removeChild(this.element);
      if (this.submitCallback) this.submitCallback(promptResult);
    }
  
    present({ onElement } = {}) {
      if (!onElement) {
        onElement = document.body;
      }
  
      this.onElement = onElement;
  
      this.element = document.createElement('div');
      this.element.className = 'sn-component';
      this.element.innerHTML = this.templateString().trim();
  
      onElement.appendChild(this.element);

      this.element.querySelector(`#sk-prompt-button-close`).onclick = () => {
        this.dismiss();
      }

      this.element.querySelector(`#sk-prompt-button-ok`).onclick = () => {
        this.submit();
      }

      this.element.querySelector(`#sk-prompt-input`).focus();
    }
  }