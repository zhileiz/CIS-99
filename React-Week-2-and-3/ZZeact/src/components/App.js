import Story from "./Story"

const stories = [
  { name: "1. Didact introduction", url: "http://bit.ly/2pX7HNn" },
  { name: "2. Rendering DOM elements ", url: "http://bit.ly/2qCOejH" },
  { name: "3. Element creation and JSX", url: "http://bit.ly/2qGbw8S" },
  { name: "4. Instances and reconciliation", url: "http://bit.ly/2q4A746" },
  { name: "5. Components and state", url: "http://bit.ly/2rE16nh" }
];

const App = {
  type: "div",
  props: {
    children: [
      {
        type: "ul",
        props: {
          children: stories.map(Story)
        }
      }
    ]
  }
};

export default App;