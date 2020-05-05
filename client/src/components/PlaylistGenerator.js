import React, { Component } from "react";
import SpotifyWebApi from 'spotify-web-api-node';
import PlaylistFinaliser from './PlaylistFinaliser.js'
import '/Users/student/Projects/RoadToDiscovery/Playlist_App/client/src/backgroundimage.css'

var spotifyApi = new SpotifyWebApi();

class PlaylistGenerator extends Component {
  constructor(props){
    super(props);
    this.state = {
        song: { name: '', artist: '', uri: '', albumArt: '', album: '', songLength: null, preview_url: ''},
        playlistid: '',
        customPlaylist: { songs:[], playlistDuration:[], list_of_tracks:[]},
        currentDuration: 0,
        renderFinaliser: false,
        playlistOveride: false
           
    }
    this.playlistHandler = this.playlistHandler.bind(this);
    this.handleFinaliserUnmount = this.handleFinaliserUnmount.bind(this);
    this.handleFinaliserMount = this.handleFinaliserMount.bind(this)
    this.overidePlaylist = this.overidePlaylist.bind(this);
    this.wipeSong = this.wipeSong.bind(this);
  }

  //Method to erase state of song that is currently playing
  wipeSong(){
    console.log("TRYING TO WIPE SONGS")

    this.setState({
      song: { name: '', artist: '', uri: '', albumArt: '', album: '', songLength: null, preview_url: ''},
    })
  }
  //Methods that mount and unmount playlist finaliser
  handleFinaliserMount(){
    this.setState({renderFinaliser: true});
  
  }
  handleFinaliserUnmount(){
    this.setState({renderFinaliser: false});
}

//Methods that sets the state of playlistoveride
overidePlaylist(){

  this.setState({
    playlistOveride: true
  })

}

unoveridePlaylist(){
  this.setState({
    playlistOveride: false
  })
  this.wipeSong()
  this.handleFinaliserMount()
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
      
       }, function(err) {
         console.log('Something went wrong|!', err);
       });
   }
   //Totals up current duration of the songs
   calculatePlaylistDurationTotal() {
     if(this.state.playlistOveride === false){
    var arr = this.state.customPlaylist.playlistDuration
    var total = 0
    for(var i = 0; i < arr.length; i++) {
      total += parseFloat(arr[i])
    }
    
    this.setState({ currentDuration: total });
  }}
   addToCustomPlaylist() {
    this.state.customPlaylist.songs.push(this.state.song.uri)
    this.state.customPlaylist.playlistDuration.push(this.state.song.songLength)
    this.state.customPlaylist.list_of_tracks.push({name: this.state.song.name, artist: this.state.song.artist});
    this.getRandomPlaylist(this.props.playListType)
  
    this.calculatePlaylistDurationTotal()
    this.checkPlaylistComplete()
    console.log(this.state.currentDuration)
   
  }

  dontAddToCustomPlaylist() {
    this.getRandomPlaylist(this.props.playListType) 
  }

  stopInterval(){
    clearInterval(this.interval)
  }

  componentDidMount(){

    console.log("HI I HAVE MOUNTED")
    this.interval = setInterval(() =>   this.checkPlaylistComplete())
  }

  checkPlaylistComplete(){
    if(this.state.playlistOveride === false){
      if(this.state.currentDuration >= this.props.desiredDuration) {
        this.props.playlistIsComplete()
        this.wipeSong()
        this.handleFinaliserMount()
        this.stopInterval()
      }
  }}
  
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
      if(this.props.playlistComplete === false || this.state.playlistOveride === true){
        this.getTracks()
      }
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
  
  render() {
    return (
    <>
    <div>
    
    { !(this.props.playlistComplete) || this.state.playlistOveride === true ?
        <div>
          {/* <div> */}
          {/* <h1><span class="underline">{this.state.song.name}</span></h1> */}
          {/* </div>      */}
          <div>
          <h1><span class="underline">{this.state.song.name}</span></h1>
          <b>By:</b> {this.state.song.artist}
          </div>
          <div>
          <b>Album:</b> {this.state.song.album}
          </div>  
          <div>
          <img src={this.state.song.albumArt} style={{ height: 350 }} alt=''/>
          </div>
          <div>
          <b>Track Length:</b> {Math.floor(this.state.song.songLength/(1000*60)%60)+":"+("0"+Math.floor(this.state.song.songLength/1000%60)).slice(-2)}
          </div>  
          <div>
          <audio controls  autoPlay id="myaudio" src={this.state.song.preview_url}>
          </audio>
          </div>
          { !(this.state.song.name === '') && 
          <div>
          <button type="button" class="btn btn-success" onClick={() => this.addToCustomPlaylist()}> Add (+) </button>
          <button type="button" class="btn btn-danger" onClick={() => this.dontAddToCustomPlaylist()}>Don't Add (-) </button>
          </div>
          }
          <button type="button" class="btn btn-light" onClick={this.playlistHandler}>
            Load New Tracks
          </button>
          <button type="button" class="btn btn-light" onClick={() => this.unoveridePlaylist()}>
          I'm Done!
          </button>
          </div>
          : null
    }
          </div>
    

  
       <div>
       {this.state.renderFinaliser ?
        <PlaylistFinaliser
        token={this.props.token}
        playlistComplete={this.props.playlistComplete}
        customPlaylist={this.state.customPlaylist}
        playlistIsNotComplete={this.props.playlistIsNotComplete}
        unmountFinaliser={this.handleFinaliserUnmount}
        overidePlaylist={this.overidePlaylist}
       />
       : null}
       </div>
        </>
        )
      }}

    //   export const BackgroundImage = () => {
    //     return (
    //       <>
    //         <img className="backgroundImage" src={this.state.song.albumArt}/>
    //       </>
    //     )
    // }

export default PlaylistGenerator;