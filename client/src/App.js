import React,{Component} from 'react';

// import logo from './logo.svg';
import './App.css';
import SpotifyWebApi from 'spotify-web-api-node';

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
      list: {id: ''},
      tracks: {array: []},
      playlist: {array: []}, 
      song: { name: '', artist: '', uri: '', preview_url: '', albumArt: ''},
      customPlaylist: { songs: []}

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
      .then((data) => {
        this.setState({
          nowPlaying: { 
              name: data.body.item.name, 
              albumArt: data.body.item.album.images[0].url
            }
        });
      })
  }

  addToCustomPlaylist() {
    this.state.customPlaylist.songs.push(this.state.song.uri);
    this.getRandomPlaylist("Rock Music")
    this.getTracks();
    console.log(this.state.customPlaylist.songs)
  }

  dontAddToCustomPlaylist() {
    this.getRandomPlaylist("Rock Music")
    this.getTracks();
  }

  getTracks(){
    console.log(this.token)
    spotifyApi.getPlaylist(this.token, this.state.list.id)
      .then((data) => {
        var playlistSize = data.body.tracks.items.length
        var trackInfo = data.body.tracks.items[Math.floor(Math.random() * playlistSize)]
        console.log(data)
        this.setState({
          song: {
            name: trackInfo.track.name,
            artist: trackInfo.track.artists[0].name,
            uri: trackInfo.track.uri,
            albumArt: trackInfo.track.album.images[0].url,
            preview_url: trackInfo.track.preview_url
          }
        })
        console.log(this.state.song)
      }, function(err) {
        console.log('Something went wrong|!', err);
      });
  }


  addSongsToPlaylist(){
    var customPlaylist = this.state.customPlaylist.songs
    var userId
    //get userID
    spotifyApi.getMe()
    .then(function(data) {
      userId = data.body.id;
      // Create Playlist
      spotifyApi.createPlaylist(userId, 'newplaylist', { public : false })
          .then((data) => {
            var playlistid = data.body.id
            console.log(customPlaylist)
            // Add chosen tracks to thatplaylist
            spotifyApi.addTracksToPlaylist(userId, playlistid, customPlaylist)
            .then(function(data) {
               console.log(data, 'Added tracks to playlist!');
               }, function(err) {
                console.log('Something went wrong!', err);
               });

            }, function(err) {
            console.log('Something went wrong with the playlist creation!', err);
          });
        }, function(err) {
          console.log('Something went wrong!', err);
   
  });
    
  }

  test() {
    console.log(this.state.list.id)
  }


  getRandomPlaylist(genre) {
    spotifyApi.searchPlaylists(genre)
    .then((data) => {
      var numberOfPlaylists = (data.body.playlists.items).length
      this.setState({
        list: {
            id: data.body.playlists.items[Math.floor(Math.random() * numberOfPlaylists)].id
          }        
      });
    }, function(err) {
      console.log('Something went wrong!', err);
    });
  }

  render() {
    return (
      <div className="App">
        <a href='http://localhost:8888' > Login to Spotify </a>
        {/* <div>
          Now Playing: { this.state.nowPlaying.name }
        </div> */}
        <div>
          <img src={this.state.nowPlaying.albumArt} style={{ height: 320 }} alt=''/>
        </div>
        <div>
          <div>
          {this.state.song.name}      
          </div>     
          <div>
          {this.state.song.artist}
          </div>   
          <div>
          <img src={this.state.song.albumArt} style={{ height: 320 }} alt=''/>
          </div>  
          <div>
          <audio controls autoPlay src={this.state.song.preview_url}>
          </audio>
          </div>
          <button onClick={() => this.addToCustomPlaylist()}> Yes </button>
          <button onClick={() => this.dontAddToCustomPlaylist()}>No </button>
        </div>
        { this.state.loggedIn &&
        <> 
          <button onClick={() => this.getNowPlaying()}>
            Check Now Playing
          </button>
          <button onClick={() => this.addSongsToPlaylist()}>
            Add this song to playlist
          </button>
          <button onClick={() => this.getRandomPlaylist("Rock Music")}>
            Get playlist id
          </button>
          <button onClick={() => this.getTracks()}>
            Get tracks
          </button>
          <button onClick={() => this.test()}>
            Test
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

