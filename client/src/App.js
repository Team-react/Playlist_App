import React,{Component} from 'react';
import 'bootswatch/dist/minty/bootstrap.min.css'; // Added this :boom:
import "bootswatch/dist/cosmo/bootstrap.min.css";
import './App.css';
// import SpotifyWebApi from 'spotify-web-api-node';
import Authorization from './components/Authorization'
import ThemeSelect from './components/ThemeSelect';

// import { Button } from 'react-bootstrap';
// import Playlist from './components/Playlist'
// var spotifyApi = new SpotifyWebApi();
var authorization = new Authorization();
var themeSelect = new ThemeSelect()

class App extends Component {
  constructor(props){
    super(props);

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

