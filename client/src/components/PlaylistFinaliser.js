import React, { Component } from "react";
import SpotifyWebApi from 'spotify-web-api-node';
import './PlaylistFinaliser.css'


var spotifyApi = new SpotifyWebApi();


 
class PlaylistFinaliser extends Component {
  constructor(props){
    super(props)
    this.state = {
       namedPlaylist: '',
       playlistCreated: false
      }
    
  }
  dismiss() {
    this.props.overidePlaylist()
    this.props.unmountFinaliser();
} 


playlistIsNotComplete(){
  this.props.playlistIsNotComplete()
}

playlistCreated(){
  this.setState({
    playlistCreated: true
  })
}

refreshPage() {
  window.location.reload(false);
}

  
    addSongsToPlaylist(playlistname){
      var thisclass = this
        var customPlaylist = this.props.customPlaylist.songs
        var userId
        spotifyApi.setAccessToken(this.props.token)
        //get userID
        spotifyApi.getMe()
        .then(function(data) {
          userId = data.body.id;
          // Create Playlist
          spotifyApi.createPlaylist(userId, playlistname, { public : false })
              .then((data) => {
                var playlistid = data.body.id
                console.log(customPlaylist)
                // Add chosen tracks to thatplaylist
                spotifyApi.addTracksToPlaylist(userId, playlistid, customPlaylist)
                .then(function(data) {
                   console.log(data, 'Added tracks to playlist!');
                   thisclass.playlistCreated()
                   }, function(err) {
                    console.log('Something went wrong!', err);
                   });
    
                }, function(err) {
                console.log('Something went wrong with the playlist creation!', err);
              });
            }, function(err) {
              console.log('Something went wrong!', err);
        });
      };

      removeFromPlaylist(index) {
        var song_checked = this.props.customPlaylist.list_of_tracks;
        var song_values = song_checked.indexOf(this.props.customPlaylist.list_of_tracks[index])
        song_checked.splice(song_values, 1);
          this.setState({list_of_tracks: song_checked});
          var uri_checked = this.props.customPlaylist.songs;
          var uri_values = uri_checked.indexOf(this.props.customPlaylist.songs[index])
          uri_checked.splice(uri_values, 1);
          this.setState({songs: uri_checked});
          console.log(this.props.customPlaylist.songs)
        }

        namedPlaylistHandler = event => {
          this.setState({
            namedPlaylist: event.target.value,
          });
          event.preventDefault();
        }

render() {
  return (
      <div> 
          { this.props.playlistComplete ?
          <h4><div className="text-danger">You have reached your desired time limit</div></h4>
            : null
          }
          <div className='playlistcontainer'>
            <div className='playlist'>
                <div className='playlistname'>
                  <form>
                    <label htmlFor="customPlaylist">Your playlist: </label>
                    <input type="text" id='customPlaylist' name="namedPlaylist" 
                    placeholder="Playlist name" 
                    value={this.namedPlaylist} 
                    onChange={this.namedPlaylistHandler} />
                  </form>
                </div>
                <ul> 
                    {this.props.customPlaylist.list_of_tracks.map((value, index) => {
                      return <ol className="track" key={index}><b>{value.name}</b> by {value.artist}
                      <button type="button" className="crossbtn" onClick={() => this.removeFromPlaylist(index)}>
                      ✗
                      </button>
                      </ol>
                    })}
                </ul>
                <div className='finaliseplaylist'>
                  <button type="button" className="submitbtn" onClick={() => this.addSongsToPlaylist(this.state.namedPlaylist)}>
                    Finish Playlist
                  </button>
                </div>
          </div>
        </div>

      <div>
        {this.state.playlistCreated ? 
        <div>
          Playlist created
            <div>
              <button onClick={this.refreshPage}>Click to make another playlist!</button>
            </div>
          </div>
          :  
          <div>         
            <div className="black-text">Still Not Finished? </div>
            <button type="button" id="notFinished" className="btn btn-danger" onClick={() => this.dismiss()}>
              Return back to Playlist Generator
            </button>
          </div>
        }    
        </div>
      </div>
)}}

export default PlaylistFinaliser