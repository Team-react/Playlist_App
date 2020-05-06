import React, { Component } from "react";
import SpotifyWebApi from 'spotify-web-api-node';
import PlaylistGenerator from './PlaylistGenerator'


var spotifyApi = new SpotifyWebApi();


 
class ThemeSelect extends Component {
  constructor(props){
    super(props);
    this.state = {
      desiredDuration: null,
      playlist_type: null,
      playlistComplete: false,
      renderGenerator: false,
      errorForDurationInput: false,
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
  
  changeHandler = event => {
    
    var time = (event.target.value)
    // if((time < 0) || (time > 500)){
    //   this.setState({
    //     errorForDurationInput: true,
    //   })
    if(/^[1-9]?[0-9]{1}$|^100$/.test(time)){
      this.setState({
        errorForDurationInput: false,
      })
    } 
    else {
      this.setState({
        errorForDurationInput: true,
      })
    }
    time = parseInt(time * 60000)

    
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

  mountGeneratorHandler = event => {
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
      <input id='input' type="text" class="form-group w-25" name="playlist_type" 
      placeholder="Input artist or genre" 
      onChange={this.playlistTypeHandler} 
      />
    

    </form>
      <form>
      <input type="text" class="form-group w-25"
             name="duration"
             placeholder="Input playlist length (Minutes)"
            //  value={this.state.desiredDuration}
             onChange={this.changeHandler}
      />
    </form>
    {this.state.errorForDurationInput ?
    <div>
      <p>Please enter a valid number</p>

    </div>
    : null
    }
    <div>
    <button type="button" class="btn btn-success" disabled={!this.state.desiredDuration || !this.state.playlist_type } onClick={this.mountGeneratorHandler}>
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