import React, { Component } from "react";
import SpotifyWebApi from 'spotify-web-api-node';
import PlaylistFinaliser from './PlaylistFinaliser.js'


var spotifyApi = new SpotifyWebApi();


 
class PlaylistGenerator extends Component {
  constructor(props){
    super(props);
    this.state = {
        song: { name: '', artist: '', uri: '', albumArt: '', album: '', songLength: null, preview_url: ''},
        playlistid: '',
        customPlaylist: { songs:[], playlistDuration:[], list_of_tracks:[]},
        currentDuration: 0,
        playlistComplete: false
        




      
    }
  }
  getTracks(){
    document.getElementById("myaudio").volume = 0.1
    spotifyApi.setAccessToken(this.props.token)
 
     console.log(this.state.playlistid)
     spotifyApi.getPlaylist(this.props.token, this.state.playlistid)
       .then((data) => {
         
         var playlistSize = data.body.tracks.items.length
         var trackInfo = data.body.tracks.items[Math.floor(Math.random() * playlistSize)]
         if(trackInfo.track.preview_url == null){
           console.log("WE SKIPPED THIS ONE")
           return this.dontAddToCustomPlaylist()
         }
        //  console.log(data)
        //  console.log(trackInfo.track.duration_ms)
 
         this.setState({
           song: {
             name: trackInfo.track.name,
             artist: trackInfo.track.artists[0].name,
             uri: trackInfo.track.uri,
             albumArt: trackInfo.track.album.images[0].url,
             album: trackInfo.track.album.name,
             preview_url: trackInfo.track.preview_url,
             songLength: (trackInfo.track.duration_ms).toFixed(2)
           }
         })
        //  console.log(this.state.song)
       }, function(err) {
         console.log('Something went wrong|!', err);
       });
   }
   calculatePlaylistDurationTotal() {
    var arr = this.state.customPlaylist.playlistDuration
    var total = 0
    for(var i = 0; i < arr.length; i++) {
      total += parseFloat(arr[i])
    }
    // console.log(total)
    this.setState({ currentDuration: total });
    if(this.state.currentDuration >= this.props.desiredDuration) {
      this.setState({playlistComplete: true})
    }
  }
   addToCustomPlaylist() {
    this.state.customPlaylist.songs.push(this.state.song.uri)
    this.state.customPlaylist.playlistDuration.push(this.state.song.songLength)
    this.state.customPlaylist.list_of_tracks.push({name: this.state.song.name, artist: this.state.song.artist});
 
    this.getRandomPlaylist(this.props.playListType)
    this.getTracks();
    
    this.calculatePlaylistDurationTotal()
    this.checkPlaylistComplete()
    console.log(this.state.currentDuration)
   
  }

  dontAddToCustomPlaylist() {
    this.getRandomPlaylist(this.props.playListType)
    this.getTracks();
  }
    
 
  // componentDidUpdate(){
  // this.interval = setInterval(() =>   this.checkPlaylistComplete())}

  checkPlaylistComplete(){

    if(this.state.currentDuration >= this.props.desiredDuration) {
      this.setState({playlistComplete: true})
  
    }
    this.interval = setInterval(() =>   this.checkPlaylistComplete())
  }
  

  setToken() {
    console.log(this.props.token)
    spotifyApi.setAccessToken(this.props.token)

  }
  
  getRandomPlaylist(genre) {
  
    spotifyApi.setAccessToken(this.props.token)

    spotifyApi.searchPlaylists(genre)
    .then((data) => {
      var numberOfPlaylists = (data.body.playlists.items).length
      this.setState({
          playlistid: data.body.playlists.items[Math.floor(Math.random() * numberOfPlaylists)].id
      })
      console.log("successfully got a playlist by genre")
    }, function(err) {
      console.log('Error searching for playlist by genre', err);
    });
  }
  changeHandler = event => {
    var time = parseInt(event.target.value) * 60000
    console.log(time)
    this.setState({
      desiredDuration: time
    });
  }

  playlistHandler = event => {
    console.log(this.props.playListType)

    event.preventDefault();

    this.getRandomPlaylist(this.props.playListType)
  }

//   playlistTypeHandler = event => {
//     this.setState({
//       playlist_type: event.target.value

//     })
//   }

  render() {
    return (
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
          Track Length: {Math.floor(this.state.song.songLength/(1000*60)%60)+":"+("0"+Math.floor(this.state.song.songLength/1000%60)).slice(-2)}
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
        </button>
        <button type="button" onClick={this.playlistHandler}>
        Get Playlist
      </button>

        <button onClick={() => this.addSongsToPlaylist()}>
          Add this song to playlist
        </button>

        <PlaylistFinaliser
        token={this.props.token}
        playlistComplete={this.state.playlistComplete}
        customPlaylist={this.state.customPlaylist}
        
       />
         </>
    )
}
}
 
export default PlaylistGenerator;