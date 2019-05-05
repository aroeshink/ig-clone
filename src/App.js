// src.App.js
import React, { Component } from 'react';
import './App.css';
import Header from './components/Header';
import Posts from './components/Posts';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import Pusher from 'pusher-js';

// setup graphql client
const client = new ApolloClient({
  uri: "http://localhost:4000/graphql"
})

// create Component
class App extends Component {
  constructor() {
    super();
    //connect to pusher
    this.pusher = new Pusher('41d87ef596e474059338', {
      cluser: 'us2',
      encrypted: true
    });
  }

  componentDidMount() {
    if ('actions' in Notification.prototype) {
      console.log('You can enjoy the notification feature');
    } else {
      alert('Sorry, notifications are NOT supported on your browser');
    }
  }

  render() {
    return(
      <ApolloProvider client={client}>
        <div className="App">
          <Header />
          <section className="App-main">
            <Posts pusher={this.pusher} apollo_client={client} />
          </section>
        </div>
      </ApolloProvider>
    );
  }
}

export default App;
