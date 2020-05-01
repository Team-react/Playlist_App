import React,{Component} from 'react';
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
      song: { name: '', artist: '', uri: '', albumArt: '', album: '', songLength: null, preview_url: ''},
      customPlaylist: { songs:[], playlistDuration:[], list_of_tracks:[], artist_names:[] },
      desiredDuration: 0,
      currentDuration: 0,
      playlistComplete: false,
      playlist_type: ''

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
    this.state.customPlaylist.playlistDuration.push(this.state.song.songLength)
    this.state.customPlaylist.list_of_tracks.push({name: this.state.song.name, artist: this.state.song.artist})
    // this.state.customPlaylist.artist_names.push(this.state.song.artist) 
 
    this.getRandomPlaylist(this.state.playlist_type)
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

  getTracks(){
   document.getElementById("myaudio").volume = 0.1

    console.log(this.token)
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

  displayPlaylist() {
    var trackstobedisplayed = this.state.customPlaylist.list_of_tracks
    var artiststobedisplayed = this.state.customPlaylist.artist_names
    trackstobedisplayed.forEach(item => console.log(item));
    artiststobedisplayed.forEach(item => console.log(item));
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

  changeHandler = event => {
    this.setState({
      desiredDuration: event.target.value
    });
  }

  playlistHandler = event => {
    this.setState({
      playlist_type: event.target.value
    });
  }

  // playlistHandler2 = event => {
  //   this.getRandomPlaylist(this.state.playlist_type)
  //   };
  

  render() {
    return (
      <div className="App">
{/* 
        const { data } = this.state.customPlaylist;

        let playlist = data.map(list_of_tracks => {
          console.log(list_of_tracks)
        }) */}
        <a href='http://localhost:8888' > Login to Spotify </a>
        <div>
          <img src={this.state.nowPlaying.albumArt} style={{ height: 320 }} alt=''/>
        </div>
        { this.state.loggedIn &&
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

          {/* <button onClick={() => this.getNowPlaying()}>
            Check Now Playing
          </button> */}
          <button onClick={() => this.addSongsToPlaylist()}>
            Add this song to playlist
          </button>
          <button onClick={() => this.getRandomPlaylist('Rock Music')}>
            Get playlist id
          </button>
          <form>
          <input type="text" name="playlist_type" 
          placeholder="Input artist or genre" 
          value={this.playlist_type} 
          onChange={this.playlistHandler} />
          <button onClick={() => this.getRandomPlaylist(this.state.playlist_type) }>
            Get Playlist
          </button>

        </form>
          <button onClick={() => this.getTracks()}>
            Get tracks
          </button>
          <button onClick={() => this.test()}>
            Test
          </button>
          <button onClick={() => this.displayPlaylist()}>
            Display Playlist
          </button>
          <form>
          <input type="duration"
                 name="duration"
                 placeholder="input playlist length"
                 value={this.state.desiredDuration}
                 onChange={this.changeHandler}
          />
        </form>
         <div>
            <ul>
            {this.state.tracks.array.map((value, index) => {
            return <li key={index}>{value.name}</li>
            })}
            </ul>
         </div>
         </>
        }
            <div>
            <ul>
            {this.state.customPlaylist.list_of_tracks.map((value, index) => {
            return <li key={index}>{value.name} : {value.artist}</li>
            })}
            </ul>
         </div>
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

