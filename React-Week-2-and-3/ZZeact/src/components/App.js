import Story from "./Story"
import ZZeact, {Component} from "../../ZZeact/ZZeact"

class App extends Component {
  render() {
    return (
      <div>
        <h1>Didact Stories</h1>
        <ul>
          {this.props.stories.map(story => {
            return <Story name={story.name} url={story.url} />;
          })}
        </ul>
      </div>
    );
  }
}

export default App;