import React from 'react';
import Relay from 'react-relay';
import ReactDOM from 'react-dom';
import { withRouter } from 'react-router';
import { Router, Route, browserHistory, applyRouterMiddleware } from 'react-router';
import useRelay from 'react-router-relay';

Relay.injectNetworkLayer(
  new Relay.DefaultNetworkLayer('localhost:4000/graphql')
)

class PersonsPage extends React.Component {
  static propTypes = {
    person: React.PropTypes.object,
  }

  render () {
    return (
      <div>
        {`Your viewer id is: ${this.props.viewer.id}`}
      </div>
    );
  }
}

export default Relay.createContainer (
  PersonsPage, {
    fragments: {
      person: () => Relay.QL`
        fragment on Person {
          id,
        }
      `,
    },
  }
)

const ViewerQueries = { person: () => Relay.QL`query { person }`}

ReactDOM.render(
  <Router
    forceFetch
    environment={Relay.Store}
    render={applyRouterMiddleware(useRelay)}
    history={browserHistory}
    >

    <Route path='/react' component={PersonsPage} queries={ViewerQueries} />
    </Router>
  , document.getElementById('example')
)
