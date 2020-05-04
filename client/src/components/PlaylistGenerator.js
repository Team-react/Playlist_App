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
        renderChild: false,
        playlistOveride: false

        // playlistComplete: false           
    }
    this.playlistHandler = this.playlistHandler.bind(this);
    this.handleChildUnmount = this.handleChildUnmount.bind(this);
    this.handleChildmount = this.handleChildmount.bind(this);
    this.overidePlaylist = this.overidePlaylist.bind(this);
    this.wipeSong = this.wipeSong.bind(this);





  }
  wipeSong(){
    console.log("TRYING TO WIPE SONGS")

    this.setState({
      song: { name: '', artist: '', uri: '', albumArt: '', album: '', songLength: null, preview_url: ''},
    })
  }
  handleChildmount(){
    this.setState({renderChild: true});
  
  }
  handleChildUnmount(){
    this.setState({renderChild: false});
}
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
  this.handleChildmount()

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
   
   calculatePlaylistDurationTotal() {
     if(this.state.playlistOveride === false){
    var arr = this.state.customPlaylist.playlistDuration
    var total = 0
    for(var i = 0; i < arr.length; i++) {
      total += parseFloat(arr[i])
    }
    
    this.setState({ currentDuration: total });
    // if(this.state.currentDuration >= this.props.desiredDuration) {
    //   // this.setState({playlistComplete: true})
    //   this.props.playlistIsComplete()
      
    //   this.wipeSong()
    //   this.dismiss()
    // }
  }
  }
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

  componentWillUnmount(){
    this.stopInterval()
    console.log("HI I HAVE JUST UNMOUNT")

  }

  componentDidMount(){
    document.getElementById("myaudio").volume = 0.1

    console.log("HI I HAVE MOUNTED")
    this.interval = setInterval(() =>   this.checkPlaylistComplete())
  }

  dismiss() {
    this.props.unmountMe();
  } 



     

  checkPlaylistComplete(){

    if(this.state.playlistOveride === false){

    


    if(this.state.currentDuration >= this.props.desiredDuration) {
      // this.setState({playlistComplete: true})
      this.props.playlistIsComplete()
      this.wipeSong()
      this.handleChildmount()
      this.stopInterval()

  
    }
    console.log("BLA")
  }
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
          <div>
          <button onClick={() => this.addToCustomPlaylist()}> Yes </button>
          <button onClick={() => this.dontAddToCustomPlaylist()}>No </button>
          </div>
          <button type="button" onClick={this.playlistHandler}>
            Initiate Algorithm
          </button>
          <button type="button" onClick={() => this.unoveridePlaylist()}>
            unmountme
          </button>
          </div>
          : null
        }
          </div>
          

  
       <div>
       {this.state.renderChild ?
        <PlaylistFinaliser
        token={this.props.token}
        playlistComplete={this.props.playlistComplete}
        customPlaylist={this.state.customPlaylist}
        playlistIsNotComplete={this.props.playlistIsNotComplete}
        unmountMe={this.handleChildUnmount}
        overidePlaylist={this.overidePlaylist}

        
       />
       : null}
       </div>

        </>
    )
}
}
 
export default PlaylistGenerator;