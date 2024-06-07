import styles from "./styles.scss?inline";
class WebComponent extends HTMLElement {
  [key: string]: any;
  data: string = "";
  space: number = 2;
  color: boolean = true;
  // 监听的属性列表
  static get observedAttributes() {
    return ["data", "space", "color"];
  }
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    // const div = document.createElement("div");
    // div.innerHTML = "Hello World";
    // this.shadowRoot!.appendChild(div);
  }

  connectedCallback() {
    // console.log("connectedCallback when Custom element added to page.");
    this.render();
  }

  // disconnectedCallback() {
  //   console.log("disconnectedCallback when Custom element removed from page.");
  // }

  attributeChangedCallback(name: string, _oldValue: string, newValue: string) {
    switch (name) {
      case "data":
        this.data = newValue;
        break;
      case "space":
        this.space = Number(newValue);
        break;
      case "color":
        this.color = newValue === "true";
        break;
    }
    this.render();
  }

  // adoptedCallback() {
  //   console.log(
  //     "adoptedCallback when Custom element adopted into new document."
  //   );
  // }

  render() {
    if (this.data) {
      const data = JSON.stringify(
        JSON.parse(this.data),
        function replacer(_key, value) {
          return value;
        },
        this.space
      );
      this.shadowRoot!.innerHTML = `<pre>${
        this.color ? this.syntaxHighlight(data) : data
      }</pre>`;
    } else {
      this.shadowRoot!.innerHTML = `<pre>${this.data}</pre>`;
    }
    this.injectStyles();
  }

  injectStyles() {
    const style = document.createElement("style");
    style.textContent = `${styles}`;
    this.shadowRoot!.appendChild(style);
  }

  syntaxHighlight(jsonString: string) {
    let json = jsonString
      .replace(/&/g, "&")
      .replace(/</g, "<")
      .replace(/>/g, ">");
    return json.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\\-]?\d+)?)/g,
      function (match) {
        var cls = "pre-number";
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = "pre-key";
          } else {
            cls = "pre-string";
          }
        } else if (/true|false/.test(match)) {
          cls = "pre-boolean";
        } else if (/null/.test(match)) {
          cls = "pre-null";
        }
        return '<span class="' + cls + '">' + match + "</span>";
      }
    );
  }
}

customElements.define("json-view", WebComponent);
