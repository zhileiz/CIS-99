import ZZeact from "../../ZZeact/ZZeact"

function Story(story) {
  console.log(story.likes);
  return (
    <li>
      <button onClick={e => handleClick(story)}>{story.likes}❤️</button>
      <a href={story.url}>{story.name}</a>
    </li>
  );
}

function handleClick(story) {
  story.likes += 1;
  ZZeact.rerender();
}

export default Story;