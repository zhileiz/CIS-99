name: title
layout: true
class: middle, center, large

---

name: poll
layout: true
class: large, center-title

{{content}}

.footnote[Vote at PollEv.com/jacquelineas740]

---

name: default
layout: true
class: large, center-title

---

template: title

# React Week 2 and 3
## The React Source Code

---

# Summary
- What I did in the past four weeks:
    - Learned webpack 4 and babel 7
        - Understood how these tools work
        - Write a custom React Project Template
    - Wrote my own React Framework: ZZeact
        - Implemented Components and Virtual DOM
    - Investigated the source code of React 15

---

template: title

# PART I
## Understanding Webpack and Babel

---

# Backgrounds: How React Compiles
- React is written in ES6 modules and JSX
  - *Problem:* browser support not guaranteed
  - *Problem:* complex dependency
  - *Problem:* subject to same origin policy
- needs to compile to one single ES5 script.
  - First transpile ES6 and JSX to ES5
  - Then combine all dependencies to one single file.

---
# Babel
- Transpiles ES6 and JSX to ES5 
- Presets: sets of plugins to do full transpilation.
- Plugins: task-specific code to transpile in part.
- Usage:
  - Install:
    ```bash
    npm i @babel/cli @babel/core @babel/preset-env
    ```
  - Include a `.babelrc`
    ```bash
    { "presets":["@babel/env", "@babel/react"], "plugins":[] }
    ```
- Will be invoked by Webpack later.

---
# What is JSX transpiled to?
- With the babel React preset, each pair of anchor tags transpile to:
  ```es6
  React.createElement(type, prop, ..children);
  ```
  - Babel jsx plugin allow customizing `createElement`
- `type` corresponds to the component's class
  - if it is a custom element.
  - but if it is an HTML element, transpile to `string`
- `prop` corresponds to the attributes in the leading anchor tag.
- `children` are the content between anchor tags.

---
```es6
<div className="test">
  <Link message="msg"><h3>Hello</h3></Link>
  <Link message="msg"><h3>Hello</h3></Link>
</div> 
```
transpiles to:
```es6
React.createElement(
  "div", 
  { className: "test" }, 
  React.createElement(
    Link, 
    { message: "msg" } , 
    React.createElement("h3", null, "Hello")
  ), 
  React.createElement(
    Link, 
    { message: "msg" }, 
    React.createElement("h3", null, "Hello")
  )
);
```

---
# Webpack
- Webpack compile all scripts and stylesheets into one single script.
- Install webpack and babel loader
```bash
npm i webpack babel-loader
```
- include a `webpack.config.js`
  - specify `index.js` (highest dependency document)
  - specify output location
  - specify transpiler/loader


---
# Why they matter
- away from `create-react-app`
- important for understanding how React works.
- must have if you want to write your own version of react using ES6 and JSX.
  - which we will do in the next part.

---
template: title

# Project 1
## Custom React Boilerplate

---
template: title

# Part 2
## Building React from Scratch

---

# 1. React uses basic DOM operations
Like all other frontend javascript libraries (including jQuery), React works by manipulating the DOM through the common DOM API
```es6
// Get an element by id
const domRoot = document.getElementById("root");

// Create a new element given set properties
const domInput = document.createElement("input");
domInput["type"] = "text"; 
domInput["value"] = "Hi world"; 
domInput["className"] = "my-class";
domInput.addEventListener("change", e => alert(e.target.value));
domRoot.appendChild(domInput);

// Create a text node
const domText = document.createTextNode("");
domText["nodeValue"] = "Foo";
domRoot.appendChild(domText);
```
---
# Step One: render JSX
- Goal:
```js
const Story = ({ name, url }) => (
  <li>
    <button>{likes}❤️</button>
    <a href={url}>{name}</a>
  </li>
)
const App = () => (
  <div><ul>{stories.map(Story)}</ul></div>;
)
ZZeact.render(App(), document.getElementById("root"));
```
---
- Recall `React.createElement(type, props, ..children)`
  - From
  ```html
  <div id="container">
    <input value="foo" type="text"/>
    <a href="/bar"></a>
    <span></span>
  </div>
  ```
  - To
  ```es6
  const element = {
    type: "div",
    props: {
      id: "container",
      children: [
        { type: "input", props: { value: "foo", type: "text" } },
        { type: "a", props: { href: "/bar" } },
        { type: "span", props: {} }
      ]
    }
  };
  ```

---
```js
export const render = function (element, parentDom) {
  const { type, props } = element;
  // Create DOM element
  const isTextElement = type === TEXT_ELEMENT;
  console.log("type:" + type);
  const dom = isTextElement ? document.createTextNode("") : document.createElement(type);

  // Add event listeners
  const isListener = name => name.startsWith("on");
  Object.keys(props).filter(isListener).forEach(name => {
    const eventType = name.toLowerCase().substring(2);
    dom.addEventListener(eventType, props[name]);
  });

  // Set properties
  const isAttribute = name => !isListener(name) && name != "children";
  Object.keys(props).filter(isAttribute).forEach(name => {
    dom[name] = props[name];
  });

  // Render children
  const childElements = props.children || [];
  childElements.forEach(childElement => render(childElement, dom));
  // Append to parent
  parentDom.appendChild(dom);
}
```
---
# Recap Step One
1. Babel will trigger JSX to transpile to `createElement(type, prop, children)`
2. We implment `createElement(type, prop, children)` to generate javascript `object` representing the element.
3. We implement `render(obj, domElement)` and have developers explicitly call it.

---

# Step Two: Enabling updates
- Goal:
```js
function like(story) {
  story.likes += 1;
  ZZeact.rerender();
}
const Story = (story) => (
  <li>
    <button onClick = {like(story)}>{story.likes}❤️</button>
    <a href={story.url}>{story.name}</a>
  </li>
)
```
- And we need to do it efficiently
- By reusing unchanged DOM elments

---
# Introducing the Virtual DOM
- Virtual DOM is a data structure
  - has a `type` - type of DOM
  - has a reference to the real DOM element
  - has an array of children Virtual DOMs
- The root componenent gets instantiated first.
  - Thus the root Virtual DOM instance is the root of the virtual dom tree.
- Everything of Virtual DOM eventually gets translated to the real DOM.

---
# Reconciliation
- Four types of possible Virtual DOM updates
  - **create** new Virtual DOM instance
    - append child to real DOM
  - **delete** old Virtual DOM instance
    - delete child from real DOM
  - **update** existing Virtual DOM instance
    - update attributes of the real DOM
  - **replace** Virtual DOM instance
    - replace child in the real DOM
- Recursively reconcile children

---
# Step Three: Breaking up to components
- Goal
```es6
class Component {
  constructor(props) {
    ...
  }

  setState(partialState) {
    ...
  }
}
...
class App extends ZZeact.Component { ... }
...
class Story extends ZZeact.Component { ... }
```
- `rerender` from componenent, not from root.
---
# Creating the `Component` class
```es6
export class Component {
  constructor(props) {
    this.props = props;
    this.state = this.state || {};
  }

  setState(partialState) {
    this.state = Object.assign({}, this.state, partialState);
    updateInstance(this.__internalInstance);
  }

  render() {
    ...jsx
  }
}
```

---
# `internalInstance` and `publicInstance`
- `publicInstance` is the instance of the component class
- Each virtual DOM instance keeps a `publicInstance`
- Each `publicInstance` keeps a reference to the virtual DOM instance with `publicInstance._internalInstance`
- `setState()` calls `updateInstance(publicInstance._internalInstance)`
- This lets the Virtual DOM start reconciliation from the internal instance.

---
template: title

# The end.