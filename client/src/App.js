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
      tracks: {array: []},
      playlist: {array: []}, 
      song: { name: '', artist: '', uri: '', albumArt: ''},

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

console.log(data.tracks.items[Math.floor(Math.random() * 10)].track)
        var trackInfo = data.tracks.items[Math.floor(Math.random() * 10)]
        this.setState({
          tracks: {array: this.state.tracks.array.concat(data.tracks.items[Math.floor(Math.random() * 10)].track)},
          song: {
            name: trackInfo.track.name,
            artist: trackInfo.track.artists[0].name,
            uri: trackInfo.track.uri,
            albumArt: trackInfo.track.album.images[0].url
          }

        })
      }, function(err) {
        console.log('Something went wrong|!', err);
      });
  }

  addSongsToPlaylist(){
    this.setState({
      playlist: {array: this.state.playlist.array.concat(this.state.tracks.array[Math.floor(Math.random() * this.state.tracks.array.length)].uri)}
    })
    console.log(this.state.playlist.array)
    spotifyApi.addTracksToPlaylist('0ELkWwGl7q8DmfSzVmSH58', [this.state.playlist.array.slice(-1)[0]])
    .then(function(data) {
      console.log('Added tracks to playlist!');
    }, function(err) {
      console.log('Something went wrong!', err);
    });
  }

  getRandomPlaylist(genre) {
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
        <div>
          <div>
          {this.state.song.name}      
          </div>     
          <div>
          {this.state.song.artist}
          </div>   
          <div>
          <img src={this.state.song.albumArt} style={{ height: 150 }} alt=''/>
          </div>  
          <button>
            Yes
          </button>
          <button>
            No
          </button>
        </div>
        { this.state.loggedIn &&
        <>
          <button onClick={() => this.getNowPlaying()}>
            Check Now Playing
          </button>
          <button onClick={() => this.addSongsToPlaylist()}>
            Add this song to playlist
          </button>
          <button onClick={() => this.getRandomPlaylist("Rock")}>
            Get playlist id
          </button>
          <button onClick={() => this.getTracks()}>
            Get tracks
          </button>
        
         <div>
  
            <ul>
            {this.state.tracks.array.map((value, index) => {
            return <li key={index}>{value.name}</li>
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

