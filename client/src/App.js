import React,{Component} from 'react';
import 'bootswatch/dist/minty/bootstrap.min.css'; // Added this :boom:
import "bootswatch/dist/cosmo/bootstrap.min.css";

import './App.css';
// import SpotifyWebApi from 'spotify-web-api-node';
import Authorization from './components/Authorization'
import ThemeSelect from './components/ThemeSelect';
import Button from 'react-bootstrap/Button';
// import { Button } from 'react-bootstrap';
// import Playlist from './components/Playlist'

// var spotifyApi = new SpotifyWebApi();
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
      // list: {id: ''},
      // tracks: {array: []},
      // playlist: {array: []}, 
      // song: { name: '', artist: '', uri: '', albumArt: '', album: '', songLength: null, preview_url: ''},
      // customPlaylist: { songs:[], playlistDuration:[]},
      // desiredDuration: 0,
      // currentDuration: 0,
      // playlistComplete: false,
      // playlist_type: ''

    }
  }

  // calculatePlaylistDurationTotal() {
  //   var arr = this.state.customPlaylist.playlistDuration
  //   var total = 0
  //   for(var i = 0; i< arr.length; i++) {
  //     total += parseFloat(arr[i])
  //   }
  //   // console.log(total)
  //   this.setState({ currentDuration: total });
  // }

  // getNowPlaying(){
  //   spotifyApi.getMyCurrentPlaybackState()
  //     .then((data) => {
  //       this.setState({
  //         nowPlaying: { 
  //             name: data.body.item.name, 
  //             albumArt: data.body.item.album.images[0].url
  //           }
  //       });
  //     })
  // }

  



  // addSongsToPlaylist(){
  //   var customPlaylist = this.state.customPlaylist.songs
  //   var userId
  //   //get userID
  //   spotifyApi.getMe()
  //   .then(function(data) {
  //     userId = data.body.id;
  //     // Create Playlist
  //     spotifyApi.createPlaylist(userId, 'newplaylist', { public : false })
  //         .then((data) => {
  //           var playlistid = data.body.id
  //           console.log(customPlaylist)
  //           // Add chosen tracks to thatplaylist
  //           spotifyApi.addTracksToPlaylist(userId, playlistid, customPlaylist)
  //           .then(function(data) {
  //              console.log(data, 'Added tracks to playlist!');
  //              }, function(err) {
  //               console.log('Something went wrong!', err);
  //              });

  //           }, function(err) {
  //           console.log('Something went wrong with the playlist creation!', err);
  //         });
  //       }, function(err) {
  //         console.log('Something went wrong!', err);
  //   });
  // };

  // test() {
  //   // console.log(this.state.customPlaylist.songs)
  //   // console.log(this.state.song.songLength)
  //   // console.log(this.state.customPlaylist.playlistDuration)
  //   console.log(this.state.getRandomPlaylist)
  //   console.log(this.state.list.id)
  // }

  render() {
    return (

      
      <>
      <div className="App">
      { !(this.state.loggedIn) &&

          <div>
            <Authorization/>
          </div>
  }
          { (this.state.loggedIn) &&

        <div>
          <ThemeSelect
           token={this.token}
          />
        </div>
  }
      </div>
      </>
  
      
        
       
    );
  }
}

export default App;

