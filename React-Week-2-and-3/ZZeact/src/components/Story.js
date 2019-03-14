import { createElement } from "../../ZZeact/ZZeact"

function Story({ name, url }) {
  const likes = Math.ceil(Math.random() * 100);
  return (
    <li>
      <button>{likes}❤️</button>
      <a href={url}>{name}</a>
    </li>
  );
}

export default Story;