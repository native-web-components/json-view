// import styles from "./styles.scss?inline";
// class WebComponent extends HTMLElement {
//   [key: string]: any;
//   data: string = "";
//   space: number = 2;
//   color: boolean = true;
//   // 监听的属性列表
//   static get observedAttributes() {
//     return ["data", "space", "color"];
//   }
//   constructor() {
//     super();
//     this.attachShadow({ mode: "open" });
//     // const div = document.createElement("div");
//     // div.innerHTML = "Hello World";
//     // this.shadowRoot!.appendChild(div);
//   }

//   connectedCallback() {
//     // console.log("connectedCallback when Custom element added to page.");
//     this.render();
//   }

//   // disconnectedCallback() {
//   //   console.log("disconnectedCallback when Custom element removed from page.");
//   // }

//   attributeChangedCallback(name: string, _oldValue: string, newValue: string) {
//     switch (name) {
//       case "data":
//         this.data = newValue;
//         break;
//       case "space":
//         this.space = Number(newValue);
//         break;
//       case "color":
//         this.color = newValue === "true";
//         break;
//     }
//     this.render();
//   }

//   // adoptedCallback() {
//   //   console.log(
//   //     "adoptedCallback when Custom element adopted into new document."
//   //   );
//   // }

//   render() {
//     if (this.data) {
//       const data = JSON.stringify(
//         JSON.parse(this.data),
//         function replacer(_key, value) {
//           return value;
//         },
//         this.space
//       );
//       this.shadowRoot!.innerHTML = `<pre>${
//         this.color ? this.syntaxHighlight(data) : data
//       }</pre>`;
//     } else {
//       this.shadowRoot!.innerHTML = `<pre>${this.data}</pre>`;
//     }
//     this.injectStyles();
//   }

//   injectStyles() {
//     const style = document.createElement("style");
//     style.textContent = `${styles}`;
//     this.shadowRoot!.appendChild(style);
//   }

//   syntaxHighlight(jsonString: string) {
//     let json = jsonString
//       .replace(/&/g, "&")
//       .replace(/</g, "<")
//       .replace(/>/g, ">");
//     return json.replace(
//       /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\\-]?\d+)?)/g,
//       function (match, ...args) {
//         console.log(123, match, args);
//         var cls = "pre-number";
//         if (/^"/.test(match)) {
//           if (/:$/.test(match)) {
//             cls = "pre-key";
//           } else {
//             cls = "pre-string";
//           }
//         } else if (/true|false/.test(match)) {
//           cls = "pre-boolean";
//         } else if (/null/.test(match)) {
//           cls = "pre-null";
//         }
//         return '<span class="' + cls + '">' + match + "</span>";
//       }
//     );
//   }
// }

// const define = (name: string, options?: ElementDefinitionOptions) => {
//   customElements.define(name, WebComponent, options);
// }

// export { define };

import BaseComponent from "./BaseComponent";
class WebComponent extends BaseComponent {
  data: string = "";
  // 监听的属性列表
  static get observedAttributes(): string[] {
    return ["data"];
  }
  constructor() {
    super();
  }
  attributeChangedCallback(name: string, _oldValue: string, newValue: string) {
    switch (name) {
      case "data":
        this.data = newValue;
        break;
    }
    this.render();
  }
  render(): void {
    super.render();

    const container = createElement("div", "json-container");
    this.shadowRoot!.appendChild(container);
    if (this.data) {
      const json = JSON.parse(this.data);
      createJsonTree(json, container);
    } else {
      container.innerHTML = `<pre>${this.data}</pre>`;
    }
    this.injectStyles();
  }
}

function createElement(type: string, className?: string, innerText?: string) {
  const element = document.createElement(type);
  if (className) element.className = className;
  if (innerText) element.innerText = innerText;
  return element;
}

function createJsonTree(json: any, container: HTMLElement) {
  const keys = Object.keys(json);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const isLastKey = i === keys.length - 1;
    if (json.hasOwnProperty(key)) {
      const keyElement = createElement("span", "json-key", key);
      container.appendChild(keyElement);

      if (typeof json[key] === "object" && json[key] !== null) {
        const toggleElement = createElement("span", "json-toggle", " [+]");
        toggleElement.onclick = function (event: any) {
          const sibling = event.target!.nextElementSibling;
          sibling.classList.toggle("hidden");
          event.target.innerText = sibling.classList.contains("hidden")
            ? " [+]"
            : " [-]";
        };
        container.appendChild(toggleElement);

        const subContainer = createElement("div", "json-object hidden");
        createJsonTree(json[key], subContainer);
        container.appendChild(subContainer);
      } else {
        const value = json[key];
        const valueElement = createElement(
          "span",
          "json-value",
          `: ${JSON.stringify(value)}`
        );

        if (typeof value === "string") {
          valueElement.classList.add("string");
        } else if (typeof value === "number") {
          valueElement.classList.add("number");
        } else if (typeof value === "boolean") {
          valueElement.classList.add("boolean");
        } else if (value === null) {
          valueElement.classList.add("null");
        }

        container.appendChild(valueElement);
        if (!isLastKey) {
          container.appendChild(createElement("span", "json-separator", ", "));
        }
      }

      container.appendChild(createElement("br"));
    }
  }
}

const define = (name: string, options?: ElementDefinitionOptions) => {
  customElements.define(name, WebComponent, options);
};

export { define };
