import React,{Component} from 'react';

// import logo from './logo.svg';
import './App.css';
import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();

class App extends Component {
  constructor(props){
    super(props);
    const params = this.getHashParams();
    const token = params.access_token;
    if (token) {
      spotifyApi.setAccessToken(token)
    }
    this.state = {
      loggedIn: token ? true : false,
      nowPlaying: { name: 'not checked', albumArt: ''},
      list: {id: null},
      tracks: {array: []}

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

  getTracks(){
    spotifyApi.getPlaylist(this.state.list.id)
      .then((data) => {
        console.log(this.state.tracks.array)

console.log(data.tracks.items[Math.floor(Math.random() * 10)].track.name)
        this.setState({
          tracks: {array: this.state.tracks.array.concat(data.tracks.items[Math.floor(Math.random() * 10)].track.name)}
        })
      }, function(err) {
        console.log('Something went wrong|!', err);
      });
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
    .then((data) =>  {
      this.setState({
         
          list: {
            id: data.playlists.items[Math.floor(Math.random() * 10)].id
          }        
      // spotifyApi.getPlaylist(list)
      // .then(function(data) {
      //   console.log(data.tracks.items[Math.floor(Math.random() * 100)].track.name);
      // }, function(err) {
      //   console.log('Something went wrong|!', err);
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
            Get playlist id
          </button>
          <button onClick={() => this.getTracks()}>
            Get tracksss
          </button>
        
         <div>
  
            <ul>
            {this.state.tracks.array.map((value, index) => {
            return <li key={index}>{value}</li>
            })}
            </ul>
         

           
         </div>
         
         </>
        }
      </div>
    );
  }
}

export default App;

