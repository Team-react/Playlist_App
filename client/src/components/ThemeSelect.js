import React, { Component } from "react";
import SpotifyWebApi from 'spotify-web-api-node';


var spotifyApi = new SpotifyWebApi();


 
class ThemeSelect extends Component {
  constructor(props){

    super(props);

    this.state = {
      desiredDuration: 0,
      playlist_type: '',
      list: {id: ''}
    }

    
  }
  
  getRandomPlaylist(genre) {
    spotifyApi.searchPlaylists(genre)
    .then((data) => {
      console.log('its not even reach this point')
      var numberOfPlaylists = (data.body.playlists.items).length
      console.log(numberOfPlaylists)
      // this.setState({
      //   list: {
      //       id: data.body.playlists.items[Math.floor(Math.random() * numberOfPlaylists)].id
      //     }        
      // });
      // this.props.playlist(data.body.playlists.items[Math.floor(Math.random() * numberOfPlaylists)].id)
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

  render() {
    return (
      <>
      <form>
      <input type="text" name="playlist_type" 
      placeholder="Input artist or genre" 
      value={this.playlist_type} 
      onChange={this.playlistHandler} />
      <button onClick={() => this.getRandomPlaylist(this.state.playlist_type) }>
        Get Playlist
      </button>

    </form>
      {/* <button onClick={() => this.getTracks()}>
        Get tracks
      </button>
      <button onClick={() => this.test()}>
        Test
      </button> */}
      <form>
      <input type="duration"
             name="duration"
             placeholder="input playlist length"
             value={this.state.desiredDuration}
             onChange={this.changeHandler}
      />
    </form>
    </>
    );
  }
}
 
export default ThemeSelect;