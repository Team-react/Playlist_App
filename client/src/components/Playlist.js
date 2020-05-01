import React, { Component } from "react";
import SpotifyWebApi from 'spotify-web-api-node';


var spotifyApi = new SpotifyWebApi();


 
class Playlist extends Component {
  constructor(props){
    super(props);
    this.state = {
        song: { name: '', artist: '', uri: '', albumArt: '', album: '', songLength: null, preview_url: ''},
        playlistid: ''


      
    }
  }
    


  setToken() {
    console.log(this.props.token)
    spotifyApi.setAccessToken(this.props.token)

  }
  
  getRandomPlaylist(genre) {
  

    spotifyApi.searchPlaylists(genre)
    .then((data) => {
      console.log(data, 'its not even reach this point')
      var numberOfPlaylists = (data.body.playlists.items).length
      console.log(numberOfPlaylists)
      this.setState({
          playlistid: data.body.playlists.items[Math.floor(Math.random() * numberOfPlaylists)].id
      })
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
        </button>
        <button type="button" onClick={this.playlistHandler}>
        Get Playlist
      </button>

        <button onClick={() => this.addSongsToPlaylist()}>
          Add this song to playlist
        </button>

        <button onClick={() => this.getRandomPlaylist('Rock Music')}>
          Get playlist id
        </button>
        
       
         </>
    )
}
}
 
export default Playlist;