import React,{Component} from 'react';

// import logo from './logo.svg';
import './App.css';


// var bodyParser = require('body-parser');
var SpotifyWebApi = require('spotify-web-api-node');

var spotifyApi = new SpotifyWebApi();



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
        this.setState({
          tracks: {array: this.state.tracks.array.concat(data.tracks.items[Math.floor(Math.random() * 10)].track)}
        })
      }, function(err) {
        console.log('Something went wrong|!', err);
      });
    }
    
    
    

  addSongsToPlaylist(){
    // Create a private playlist
    

      // Create Playlist
      spotifyApi.createPlaylist('willj_grace','pblablab', { public : false })
          .then(function(body) {
            console.log('IT  WORKED!', body);

            }, function(err) {
            console.log('Something went wrong with the playlist creation!', err);
          });
    
    
  };
  //   this.setState({
  //     playlist: {array: this.state.playlist.array.concat(this.state.tracks.array[Math.floor(Math.random() * this.state.tracks.array.length)].uri)}
  //   })
  //   console.log(this.state.playlist.array)
  //   spotifyApi.addTracksToPlaylist('0ELkWwGl7q8DmfSzVmSH58', [this.state.playlist.array.slice(-1)[0]])
  //   .then(function(data) {
  //     console.log('Added tracks to playlist!');
  //   }, function(err) {
  //     console.log('Something went wrong!', err);
  //   });
  

  getSpotifySong(genre) {
    spotifyApi.searchPlaylists(genre)
    .then((data) =>  {
      console.log('sdfsdfsdfsdf', data.body)
      // this.setState({
         
      //     // list: {
      //     //   id: data.playlists.items[Math.floor(Math.random() * 10)].id
      //     // }        
      // // spotifyApi.getPlaylist(list)
      // // .then(function(data) {
      // //   console.log(data.tracks.items[Math.floor(Math.random() * 100)].track.name);
      // // }, function(err) {
      // //   console.log('Something went wrong|!', err);
      // });
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

