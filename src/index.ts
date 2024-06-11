import BaseComponent from "./BaseComponent";
class WebComponent extends BaseComponent {
  data: string = "";
  // 监听的属性列表
  static get observedAttributes(): string[] {
    return ["data"];
  }
  constructor() {
    super();
    this.watchOutHtmlChange();
  }
  attributeChangedCallback(name: string, _oldValue: string, newValue: string) {
    switch (name) {
      case "data":
        this.data = newValue;
        break;
    }
    this.render();
  }

  watchOutHtmlChange() {
    const getData = () => {
      const div = document.createElement("div");
      div.innerHTML = this.innerHTML;
      const data = div.innerText.trim();
      this.data = data;
      this.render();
    };
    getData();

    const MutationObserver =
      window.MutationObserver || (window as any).WebKitMutationObserver;
    const config = { childList: true, subtree: true };
    const observer = new MutationObserver(getData);
    observer.observe(this, config);
  }

  render(): void {
    super.render();

    const container = createElement("div", "json-container");
    this.shadowRoot!.appendChild(container);
    if (this.data) {
      this.addCopyButton(container);
      try {
        const json = JSON.parse(this.data);
        if (typeof json === "object" && json !== null) {
          const jsonObject = createElement("div", "json-object");
          container.appendChild(jsonObject);
          return createJsonTree(json, jsonObject);
        }
      } catch (error) {
        container.innerHTML = this.data;
        return;
      }
    }
    container.innerHTML = this.data;
  }

  addCopyButton(container: HTMLElement) {
    const button = createElement("button", "copy-button", "Copy");
    container.appendChild(button);
    button.addEventListener("click", () => {
      let jsonString = "";
      try {
        const json = JSON.parse(this.data);
        jsonString = JSON.stringify(json, null, 2);
      } catch (error) {
        jsonString = this.data;
      }
      navigator.clipboard.writeText(jsonString).then(() => {
        alert("JSON copied to clipboard");
      });
    });
  }
}

function createElement(type: string, className?: string, innerText?: string) {
  const element = document.createElement(type);
  if (className) element.className = className;
  if (innerText) element.innerText = innerText;
  return element;
}

function createJsonTree(json: any, container: HTMLElement) {
  if (Array.isArray(json)) {
    container.appendChild(createElement("span", "bracket", "["));
  } else {
    container.appendChild(createElement("span", "bracket", "{"));
  }
  container.appendChild(createElement("br"));

  const keys = Object.keys(json);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const isLastKey = i === keys.length - 1;
    if (json.hasOwnProperty(key)) {
      // 数组下标不追加key
      if (!Array.isArray(json)) {
        const keyElement = createElement("span", "json-key", key);
        container.appendChild(keyElement);
        let colonElement = createElement("span", "colon", ":");
        container.appendChild(colonElement);
      }

      if (typeof json[key] === "object" && json[key] !== null) {
        const toggleElement = createElement(
          "span",
          "json-toggle",
          `[+]${Array.isArray(json[key]) ? "Array" : "Object"}(${
            Object.keys(json[key]).length
          })`
        );
        toggleElement.onclick = function (event: any) {
          const sibling = event.target!.nextElementSibling;
          sibling.classList.toggle("hidden");
          event.target.innerText = sibling.classList.contains("hidden")
            ? `[+]${Array.isArray(json[key]) ? "Array" : "Object"}(${
                Object.keys(json[key]).length
              })`
            : `[-]${Array.isArray(json[key]) ? "Array" : "Object"}(${
                Object.keys(json[key]).length
              })`;
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
          `${JSON.stringify(value)}`
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

  if (Array.isArray(json)) {
    container.appendChild(createElement("span", "bracket", "]"));
  } else {
    container.appendChild(createElement("span", "bracket", "}"));
  }
}

const define = (name: string, options?: ElementDefinitionOptions) => {
  customElements.define(name, WebComponent, options);
};

export { define };
export default WebComponent;
