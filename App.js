// Code goes here

class ActorModel {
  constructor(tmdbActor) {
    this.image = "https://image.tmdb.org/t/p/w500" + tmdbActor.profile_path;
    this.imdb = "https://www.imdb.com/name/" + tmdbActor.imdb_id;
    this.fullName = tmdbActor.name;
  }
}


class Actors extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    // Creating an array of actor cards based on this.props.actors
    let actorCards = this.props.actors.map(actor => (
      <ReactBootstrap.Col md="4" sm="6">
        <ReactBootstrap.Card>
          <ReactBootstrap.Card.Img variant="top" src={actor.image} />
          <ReactBootstrap.Card.Body>
            <ReactBootstrap.Card.Title>
              <a href={actor.imdb} target="_blank">{actor.fullName}</a>
            </ReactBootstrap.Card.Title>
          </ReactBootstrap.Card.Body>
        </ReactBootstrap.Card>
      </ReactBootstrap.Col>
    ));

    return <ReactBootstrap.Row>{actorCards}</ReactBootstrap.Row>;
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchResults: [],
      selectedActors: []
    };

    this.searchActors = this.searchActors.bind(this);
    this.addActor = this.addActor.bind(this);
  }

  searchActors(e) {
    if (e.target.value) {

      let searchActorsURL = "https://api.themoviedb.org/3/search/person?api_key=53d2ee2137cf3228aefae083c8158855&query=" + e.target.value;

      axios.get(searchActorsURL).then(res => {
        this.state.searchResults = res.data.results;
        this.setState(this.state);
      });

    } else {
      this.state.searchResults = [];
      this.setState(this.state);
    }
    
  }


  addActor(e) {

    e.preventDefault();

    let actorId = e.target.getAttribute("data-id");
    // let actorDetailsURL = "https://api.themoviedb.org/3/person/" + actorId + "?api_key=53d2ee2137cf3228aefae083c8158855";
    let actorDetailsURL = `https://api.themoviedb.org/3/person/${actorId}?api_key=53d2ee2137cf3228aefae083c8158855`;

    axios.get(actorDetailsURL).then(res => {
      let newActor = new ActorModel(res.data);
      this.state.selectedActors.push(newActor);

      // Cleaning input
      this.searchInput.value = "";
      this.state.searchResults = [];

      this.setState(this.state);
    });
  }

  render() {
    // Creating the HTML (JSX) for the search results
    let listSearchResults = this.state.searchResults.map(result => (
      <ReactBootstrap.ListGroup.Item action onClick={this.addActor} data-id={result.id}>
        {result.name}
      </ReactBootstrap.ListGroup.Item>
    ));

    // let listSearchResults = [];
    // for (let i = 0; i < this.state.searchResults.length; i++) {
    //   listSearchResults.push(
    //     <ReactBootstrap.ListGroup.Item action>
    //       {this.state.searchResults[i]}
    //     </ReactBootstrap.ListGroup.Item>
    //   )
    // }

    return (
      <ReactBootstrap.Container>
        <h1>Actors</h1>
        <ReactBootstrap.Form autocomplete="off">
        <ReactBootstrap.Form.Group controlId="searchTextId" className="search-box">
          <ReactBootstrap.Form.Control
            type="text"
            placeholder="Add actor"
            onChange={this.searchActors}
            ref={element => {this.searchInput = element}}
          />
          <ReactBootstrap.ListGroup className="search-results">
            {listSearchResults}
          </ReactBootstrap.ListGroup>
        </ReactBootstrap.Form.Group>
        </ReactBootstrap.Form>
        <Actors actors={this.state.selectedActors} />
      </ReactBootstrap.Container>
    );
  }
}

// Main render function
ReactDOM.render(<App />, document.getElementById('root'));
