import React, { Component } from "react";
import SpotifyWebApi from 'spotify-web-api-node';


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
    // this.props.getRandomPlaylist(this.props.playlistType)
    this.props.overidePlaylist()
    this.props.unmountFinaliser();
    // this.playlistIsNotComplete()
} 
// overidePlaylist(){
//   this.props.overidePlaylist()
// }

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
      console.log(this.props.token)
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
            <>
            { this.props.playlistComplete ?
            <h4><div class="text-danger">You have reached your desired time limit</div></h4>
             : null
            }
            <h2><div class="black-text">Here is your finished playlist</div></h2>
            <div>
            <ul> 
            {this.props.customPlaylist.list_of_tracks.map((value, index) => {
            return <ol class="list-group-item d-list-item" key={index}><b>{value.name}</b> by <b>{value.artist}</b>
            <button type="button" class="btn btn-outline-danger" onClick={() => this.removeFromPlaylist(index)}>
            X
            </button>
            </ol>
            })}
            </ul>
         </div>
         <form>
          <input type="text" name="namedPlaylist" 
          placeholder="Name your new playlist" 
          value={this.namedPlaylist} 
          onChange={this.namedPlaylistHandler} />
        </form>
        <div>
        <button type="button" class="btn btn-success" onClick={() => this.addSongsToPlaylist(this.state.namedPlaylist)}>
            Create playlist
            </button>
        </div>
        <div>
          {this.state.playlistCreated ? 
          <div>
          <div> Playlist created </div>
          <div class="black-text">Want to create another one?</div>
          <div>
          <button onClick={this.refreshPage}>Click to make another playlist!</button>
         </div>
         </div>

        :  
        <div>         
        <div class="black-text">Still Not Finished? </div>
        <button type="button" class="btn btn-danger" onClick={() => this.dismiss()}>
            Return back to Playlist Generator
        </button>
        </div>
      }
        
        </div>

        

            </>
            </div>
    )  
}}

export default PlaylistFinaliser