import Story from "./Story"
import { createElement } from "../../ZZeact/ZZeact"

const stories = [
  { name: "1. Didact introduction", url: "http://bit.ly/2pX7HNn" },
  { name: "2. Rendering DOM elements ", url: "http://bit.ly/2qCOejH" },
  { name: "3. Element creation and JSX", url: "http://bit.ly/2qGbw8S" },
  { name: "4. Instances and reconciliation", url: "http://bit.ly/2q4A746" },
  { name: "5. Components and state", url: "http://bit.ly/2rE16nh" }
];

const App = <div><ul>{stories.map(Story)}</ul></div>;

export default App;