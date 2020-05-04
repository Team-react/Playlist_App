import React, { Component } from "react";
import SpotifyWebApi from 'spotify-web-api-node';
import PlaylistGenerator from './PlaylistGenerator'


var spotifyApi = new SpotifyWebApi();


 
class ThemeSelect extends Component {
  constructor(props){
    super(props);
    this.state = {
      desiredDuration: 0,
      playlist_type: '',
      playlistComplete: false,
      renderGenerator: false
    }
    this.handleGeneratorMount = this.handleGeneratorMount.bind(this);

  }
//   handleGeneratorUnmount(){
//     this.setState({renderGenerator: false});
// }
handleGeneratorMount(){
  this.setState({renderGenerator: true});

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

  setToken() {
    console.log(this.props.token)
    spotifyApi.setAccessToken(this.props.token)

  }

  playlistIsComplete(){
    this.setState({
      playlistComplete: true

    })
  }
  playlistIsNotComplete(){
    this.setState({
      playlistComplete: false
    })
  }
  
  // getRandomPlaylist(genre) {

  //   spotifyApi.setAccessToken(this.props.token)

    

  //   spotifyApi.searchPlaylists(genre)
  //   .then((data) => {
  //     console.log(data, 'its not even reach this point')
  //     var numberOfPlaylists = (data.body.playlists.items).length
  //     console.log(numberOfPlaylists)
  //     this.props.playlist(data.body.playlists.items[Math.floor(Math.random() * numberOfPlaylists)].id)
  //   }, function(err) {
  //     console.log('Something went wrong!', err);
  //   });
  // }
  changeHandler = event => {
    var time = parseInt(event.target.value) * 60000
    console.log(time)

    this.setState({
      desiredDuration: time
    });
  }

  // playlistHandler = event => {
  //   console.log(this.state.playlist_type)

  //   event.preventDefault();

  //   this.getRandomPlaylist(this.state.playlist_type)
  // }

  playlistTypeHandler = event => {
    this.setState({
      playlist_type: event.target.value

    })
  }

  mountGeneratorHanler = event => {
    this.handleGeneratorMount()

  }

  render() {
    return (
      <>
      <div>

      {this.state.renderGenerator ?

      <PlaylistGenerator
      playListType={this.state.playlist_type}
      desiredDuration={this.state.desiredDuration}
      token={this.props.token}
      playlistIsComplete={this.playlistIsComplete.bind(this)}
      playlistIsNotComplete={this.playlistIsNotComplete.bind(this)}
      playlistComplete={this.state.playlistComplete}
      // unmountGenerator={this.handleGeneratorUnmount.bind(this)}
      
      />
      : null
      }
      </div>
      
      <div>{ !(this.state.renderGenerator) &&
      <div>
      <form>
      <input id='input' type="text" name="playlist_type" 
      placeholder="Input artist or genre" 
      onChange={this.playlistTypeHandler} 
      />
    

    </form>
      <form>
      <input type="text"
             name="duration"
             placeholder="input playlist length"
            //  value={this.state.desiredDuration}
             onChange={this.changeHandler}
      />
    </form>
    <div>
    <button type="button" onClick={this.mountGeneratorHanler}>
            I'm Ready!
    </button>
    </div>

    </div>
  }</div>

    
 
    </>
    )
  }
}
 
export default ThemeSelect;