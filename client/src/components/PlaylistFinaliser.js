import React, { Component } from "react";
import SpotifyWebApi from 'spotify-web-api-node';


var spotifyApi = new SpotifyWebApi();


 
class PlaylistFinaliser extends Component {
  constructor(props){
    super(props)
    this.state = { namedPlaylist: '' }
  }
  dismiss() {
    this.props.unmountFinaliser();
    this.props.overidePlaylist()
    // this.playlistIsNotComplete()
} 
// overidePlaylist(){
//   this.props.overidePlaylist()
// }

playlistIsNotComplete(){
  this.props.playlistIsNotComplete()
}
  
    addSongsToPlaylist(playlistname){
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
            <div>You have reached your desired time limit</div>
            <div>
            <ul className="list-group">
            {this.props.customPlaylist.list_of_tracks.map((value, index) => {
            return <li className="list-group-item list-group-item-action active" key={index}>{value.name} - {value.artist}
            
            <button onClick={() => this.removeFromPlaylist(index)}>
            X
            </button>
            </li>
            })}
            </ul>
         </div>
         <div className="form-group">
         <form>
          <input className="form-control-sm" type="text" name="namedPlaylist" 
          placeholder="Name your playlist" 
          value={this.namedPlaylist} 
          onChange={this.namedPlaylistHandler} />
        </form>
        </div>
        <div>
            <button className="btn btn-outline-primary" onClick={() => this.addSongsToPlaylist(this.state.namedPlaylist)}>
            Create playlist
            </button>
        </div>
        <div>
          <div>Not Finished?</div>
            <button className="btn-primary" onClick={() => this.dismiss()}>
            Return back to Playlist Generator
            </button>
        </div>

            </>
            </div>
    )  
}}

export default PlaylistFinaliser