import React,{Component} from 'react';

// import logo from './logo.svg';
import './App.css';
import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();

class App extends Component {
  constructor(){
    super();
    const params = this.getHashParams();
    const token = params.access_token;
    if (token) {
      spotifyApi.setAccessToken(token)
    }
    this.state = {
      loggedIn: token ? true : false,
      nowPlaying: { name: 'not checked', albumArt: ''}
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

  getNowPlaying(){
    spotifyApi.getMyCurrentPlaybackState()
      .then((response) => {
        this.setState({
          nowPlaying: { 
              name: response.item.name, 
              albumArt: response.item.album.images[0].url
            }
        });
      })
  }

  addSongsToPlaylist(){
    spotifyApi.addTracksToPlaylist('1sAU2tCGTBeSfydCXu3bln', ["spotify:track:3d9DChrdc6BOeFsbrZ3Is0", "spotify:track:6I9VzXrHxO9rA9A5euc8Ak", "spotify:track:5FZxsHWIvUsmSK1IAvm2pp", "spotify:track:60a0Rd6pjrkxjPbaKzXjfq"])
    .then(function(data) {
      console.log('Added tracks to playlist!');
    }, function(err) {
      console.log('Something went wrong!', err);
    });
  }

  getSpotifySong(genre) {
    spotifyApi.searchPlaylists(genre)
    .then(function(data) {
      var list = data.playlists.items[0].id
      spotifyApi.getPlaylist(list)
      .then(function(data) {
        console.log(data.tracks.items[Math.floor(Math.random() * 100)].track.name);
      }, function(err) {
        console.log('Something went wrong|!', err);
      });
    }, function(err) {
      console.log('Something went wrong!', err);
    });
  }

  render() {
    return (
      <div className="App">
        <a href='http://localhost:8888' > Login to Spotify </a>
        <div>
          Now Playing: { this.state.nowPlaying.name }
        </div>
        <div>
          <img src={this.state.nowPlaying.albumArt} style={{ height: 150 }} alt=''/>
        </div>
        { this.state.loggedIn &&
        <>
          <button onClick={() => this.getNowPlaying()}>
            Check Now Playing
          </button>
          <button onClick={() => this.addSongsToPlaylist()}>
            Add this song to playlist
          </button>
          <button onClick={() => this.getSpotifySong("Rock")}>
            Get track
          </button>
         </>  
        }
      </div>
    );
  }
}

export default App;

