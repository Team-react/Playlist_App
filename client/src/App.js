import React,{Component} from 'react';
import './App.css';
import SpotifyWebApi from 'spotify-web-api-node';
import Authorization from './components/Authorization'
import ThemeSelect from './components/ThemeSelect';
// import Playlist from './components/Playlist'

var spotifyApi = new SpotifyWebApi();
var authorization = new Authorization();
var themeSelect = new ThemeSelect()

class App extends Component {
  constructor(props){
    super(props);
    // const params = this.getHashParams();
    // const token = params.access_token;


    this.token = authorization.token
    this.list = themeSelect.state.list
  
    this.state = {
      loggedIn: this.token ? true : false,
      list: {id: ''},
      tracks: {array: []},
      // playlist: {array: []}, 
      song: { name: '', artist: '', uri: '', albumArt: '', album: '', songLength: null, preview_url: ''},
      customPlaylist: { songs:[], playlistDuration:[]},
      desiredDuration: 0,
      currentDuration: 0,
      playlistComplete: false,
      playlist_type: ''

    }
  }

  calculatePlaylistDurationTotal() {
    var arr = this.state.customPlaylist.playlistDuration
    var total = 0
    for(var i = 0; i< arr.length; i++) {
      total += parseFloat(arr[i])
    }
    // console.log(total)
    this.setState({ currentDuration: total });
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
    this.state.customPlaylist.songs.push(this.state.song.uri)
    this.state.customPlaylist.playlistDuration.push(this.state.song.songLength);
 
    themeSelect.getRandomPlaylist(this.state.playlist_type)
    this.getTracks();
    console.log(this.state.customPlaylist.songs)
    this.calculatePlaylistDurationTotal()
    if(this.state.currentDuration >= this.state.desiredDuration) {
      this.setState({playlistComplete: true})
    }
  }

  dontAddToCustomPlaylist() {
    this.getRandomPlaylist(this.state.playlist_type)
    this.getTracks();
  }

  updateList(id){
    this.setState({
      list: {id: id}
    })
  }

  getTracks(){
   document.getElementById("myaudio").volume = 0.1
   spotifyApi.setAccessToken(this.token)

    console.log(this.token)
    console.log(this.state.list.id)
    spotifyApi.getPlaylist(this.token, this.state.list.id)
      .then((data) => {
        
        var playlistSize = data.body.tracks.items.length
        var trackInfo = data.body.tracks.items[Math.floor(Math.random() * playlistSize)]
        if(trackInfo.track.preview_url == null){
          console.log("WE SKIPPED THIS ONE")
          return this.dontAddToCustomPlaylist()
        }
        console.log(data)
        console.log(trackInfo.track.duration_ms)

        this.setState({
          song: {
            name: trackInfo.track.name,
            artist: trackInfo.track.artists[0].name,
            uri: trackInfo.track.uri,
            albumArt: trackInfo.track.album.images[0].url,
            album: trackInfo.track.album.name,
            preview_url: trackInfo.track.preview_url,
            songLength: (trackInfo.track.duration_ms / 60000).toFixed(2)
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
  };

  test() {
    // console.log(this.state.customPlaylist.songs)
    // console.log(this.state.song.songLength)
    // console.log(this.state.customPlaylist.playlistDuration)
    console.log(this.state.getRandomPlaylist)
    console.log(this.state.list.id)
  }

  render() {
    return (
      <div className="App">
          <div>
            <Authorization/>
          </div>
        {/* { this.state.loggedIn &&
        <>
        <div>
          <div>
          {this.state.song.name}      
          </div>     
          <div>
          By: {this.state.song.artist}
          </div>
          <div>
          Album: {this.state.song.album}
          </div>  
          <div>
          <img src={this.state.song.albumArt} style={{ height: 320 }} alt=''/>
          </div>
          <div>
          Track Length: {Math.floor(this.state.song.songLength*60000/(1000*60)%60)+":"+("0"+Math.floor(this.state.song.songLength*60000/1000%60)).slice(-2)}
          </div>  
          <div>
          <audio controls  autoPlay id="myaudio" src={this.state.song.preview_url}>
          </audio>
          </div>
          <button onClick={() => this.addToCustomPlaylist()}> Yes </button>
          <button onClick={() => this.dontAddToCustomPlaylist()}>No </button>
        </div>
        <button onClick={() => this.getTracks()}>
          Get tracks
        </button> */}

        <button onClick={() => this.addSongsToPlaylist()}>
          Add this song to playlist
        </button>

        <button onClick={() => this.getRandomPlaylist('Rock Music')}>
          Get playlist id
        </button>
          <ThemeSelect
          playlist={this.updateList.bind(this)} token={this.token}
          />
         {/* <div>
            <ul>
            {this.state.tracks.array.map((value, index) => {
            return <li key={index}>{value.name}</li>
            })}
            </ul>
         </div> */}
         {/* </> */}
        }
        { this.state.playlistComplete && 
        <>
        <div>You have reached your desired time limit</div>
        <button onClick={() => this.addSongsToPlaylist()}>
            Create playlist
        </button>
        </>
        }
      </div>
    );
  }
}

export default App;

