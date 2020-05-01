import React, { Component } from "react";
import SpotifyWebApi from 'spotify-web-api-node';


var spotifyApi = new SpotifyWebApi();


 
class ThemeSelect extends Component {
  constructor(props){
    super(props);
    this.state = {
      desiredDuration: 0,
      playlist_type: '',
    }
  }
    
  getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    e = r.exec(q)
    while (e) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
       e = r.exec(q);
    }
    return hashParams;
  }

  setToken() {
    console.log(this.props.token)
    spotifyApi.setAccessToken(this.props.token)

  }
  
  getRandomPlaylist(genre) {
    spotifyApi.setAccessToken(this.props.token)

    spotifyApi.searchPlaylists(genre)
    .then((data) => {
      console.log(data, 'its not even reach this point')
      var numberOfPlaylists = (data.body.playlists.items).length
      console.log(numberOfPlaylists)
      this.props.playlist(data.body.playlists.items[Math.floor(Math.random() * numberOfPlaylists)].id)
    }, function(err) {
      console.log('Something went wrong!', err);
    });
  }
  changeHandler = event => {
    this.setState({
      desiredDuration: event.target.value
    });
  }

  playlistHandler = event => {
    console.log(this.state.playlist_type)

    event.preventDefault();

    this.getRandomPlaylist(this.state.playlist_type)
  }

  playlistTypeHandler = event => {
    this.setState({
      playlist_type: event.target.value

    })
  }

  render() {
    return (
      <>
      <form>
      <input id='input' type="text" name="playlist_type" 
      placeholder="Input artist or genre" 
      ref={(c) => this.playlist_type = c}
      onChange={this.playlistTypeHandler} 
      />
      <button type="button" onClick={this.playlistHandler}>
        Get Playlist
      </button>

      <button onClick={() => this.setToken()}>
        Get token
      </button>

    </form>
      <form>
      <input type="duration"
             name="duration"
             placeholder="input playlist length"
             value={this.state.desiredDuration}
             onChange={this.changeHandler}
      />
    </form>
    </>
    );
  }
}
 
export default ThemeSelect;