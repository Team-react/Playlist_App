import React, { Component } from "react";
import SpotifyWebApi from 'spotify-web-api-node';
import PlaylistFinaliser from './PlaylistFinaliser.js'
import './PlaylistGenerator.css'


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
    this.getRandomPlaylist = this.getRandomPlaylist.bind(this)
  }

  //Method to erase state of song that is currently playing
  wipeSong(){
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
    
    this.getRandomPlaylist(this.props.playListType)
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
 
     spotifyApi.getPlaylist(this.props.token, this.state.playlistid)
       .then((data) => {
         
         var playlistSize = data.body.tracks.items.length
         var trackInfo = data.body.tracks.items[Math.floor(Math.random() * playlistSize)]
         if(trackInfo.track.preview_url == null){
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
   
  }

  dontAddToCustomPlaylist() {
    this.getRandomPlaylist(this.props.playListType) 
  }

  stopInterval(){
    clearInterval(this.interval)
  }

  componentDidMount(){
    this.getRandomPlaylist(this.props.playListType)

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
      // console.log('Error searching for playlist by genre', err);
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
    { !this.state.renderFinaliser === true ?
      <div class='container'>
        <div class='middle'>
          <div class='card'>
            <img class="rounded-lg" src={this.state.song.albumArt} alt='' width='475px' height='475px'/>
            <div class='info'>
              <h1>{(this.state.song.name).substring(0,30)}</h1>
              <h2>{this.state.song.artist}</h2>
              <b>Track Length:</b> {Math.floor(this.state.song.songLength/(1000*60)%60)+":"+("0"+Math.floor(this.state.song.songLength/1000%60)).slice(-2)}
              <div>
              <audio class='player' controls  autoPlay id="myaudio" src={this.state.song.preview_url} ></audio>
            </div> 
            </div>
          </div>
          <div>
            <button type="button" class="yesbtn" onClick={() => this.addToCustomPlaylist()}>✓</button>
          </div>
          <div>
            <button type="button" class="nobtn" onClick={() => this.dontAddToCustomPlaylist()}>✗</button>
          </div>
          <div>
            <button type="button" class="btn btn-light" onClick={() => this.unoveridePlaylist()}>
              I'm Done!
            </button>
          </div>
        </div>
      </div>
      : null
    }
  </div>
  
       <div>
       {this.state.renderFinaliser === true ?
        <PlaylistFinaliser
        token={this.props.token}
        playlistComplete={this.props.playlistComplete}
        customPlaylist={this.state.customPlaylist}
        playlistIsNotComplete={this.props.playlistIsNotComplete}
        unmountFinaliser={this.handleFinaliserUnmount}
        overidePlaylist={this.overidePlaylist}
        getRandomPlaylist={this.getRandomPlaylist}
        playlistType={this.props.playlistType}
       />
       : null}
       </div>
        </>
        )
      }}

export default PlaylistGenerator;