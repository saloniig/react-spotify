import React, { Component } from "react";
import * as $ from "jquery";
import { authEndpoint, clientId, redirectUri, scopes } from './config';
import hash from './hash';
import Player from "./Player";
import logo from "./logo.svg";
import "./App.css";

class App extends Component {
  constructor() {     //call automatically during creation of object 
    super();
    this.state = {  //set properties
      token: null,
      item: {
        album: {
          images: [{ url: "" }]
        },
        name: "love",
        artists: [{ name: "" }],
        duration_ms: 0
      },
      is_playing: "Playing",
      progress_ms: 0   //elapsed time in milliseconds
    };
    this.getCurrentlyPlaying = this.getCurrentlyPlaying.bind(this);
  }
  componentDidMount() {
    let _token = hash.access_token;   //get token from url

    if (_token) {
      // Set token
      this.setState({
        token: _token
      });
      this.getCurrentlyPlaying(_token);
    }
  }

  getCurrentlyPlaying(token) {
    // Make a call using the token
    $.ajax({
      url: "https://api.spotify.com/v1/me/player",
      type: "GET",
      beforeSend: xhr => {
        xhr.setRequestHeader("Authorization", "Bearer " + token);  //authenticate user (bearer) token type 
      },
      success: data => {
        this.setState({
          item: data.item,
          is_playing: data.is_playing,
          progress_ms: data.progress_ms  // refers to the progress in milliseconds of currently playing track.
        });
      }
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          {!this.state.token && (
            <a
              className="btn btn--loginApp-link"
              href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
                "%20"
              )}&response_type=token&show_dialog=true`}
            >
              Login to Spotify
            </a>
          )}
          {this.state.token && (
            <Player
              item={this.state.item}
              is_playing={this.state.is_playing}
              progress_ms={this.progress_ms}
            />
          )}
        </header>
      </div>
    );
  }
}

export default App;
