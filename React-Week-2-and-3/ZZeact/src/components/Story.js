function Story({ name, url }) {
  const likes = Math.ceil(Math.random() * 100);
  const buttonElement = {
    type: "button",
    props: {
      children: [
        { type: "TEXT ELEMENT", props: { nodeValue: likes } },
        { type: "TEXT ELEMENT", props: { nodeValue: "❤️" } }
      ]
    }
  };
  const linkElement = {
    type: "a",
    props: {
      href: url,
      children: [{ type: "TEXT ELEMENT", props: { nodeValue: name } }]
    }
  };

  return {
    type: "li",
    props: {
      children: [buttonElement, linkElement]
    }
  };
}

export default Story;