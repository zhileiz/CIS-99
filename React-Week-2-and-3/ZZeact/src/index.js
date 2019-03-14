import ZZeact from "../ZZeact/ZZeact";
import App from "./components/App";

const randomLikes = () => Math.ceil(Math.random() * 100);

const stories = [
  {
    name: "Didact introduction",
    url: "http://bit.ly/2pX7HNn",
    likes: randomLikes()
  },
  {
    name: "Rendering DOM elements ",
    url: "http://bit.ly/2qCOejH",
    likes: randomLikes()
  },
  {
    name: "Element creation and JSX",
    url: "http://bit.ly/2qGbw8S",
    likes: randomLikes()
  },
  {
    name: "Instances and reconciliation",
    url: "http://bit.ly/2q4A746",
    likes: randomLikes()
  },
  {
    name: "Components and state",
    url: "http://bit.ly/2rE16nh",
    likes: randomLikes()
  }
];

ZZeact.render(<App stories = {stories} />, document.getElementById("root"));