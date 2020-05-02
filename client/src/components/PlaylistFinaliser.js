import React, { Component } from "react";
import SpotifyWebApi from 'spotify-web-api-node';


var spotifyApi = new SpotifyWebApi();


 
class PlaylistFinaliser extends Component {
  constructor(props){
    super(props)
    this.state = {
      




      
    }}
  
    addSongsToPlaylist(){
        var customPlaylist = this.props.customPlaylist.songs
        var userId
        spotifyApi.setAccessToken(this.props.token)
        //get userID
        spotifyApi.getMe()
        .then(function(data) {
          userId = data.body.id;
          // Create Playlist
          spotifyApi.createPlaylist(userId, 'newplaylist', { public : false })
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
    



  

  render() {
    return (
        <div>{ this.props.playlistComplete && 
            <>
            <div>You have reached your desired time limit</div>
            <button onClick={() => this.addSongsToPlaylist()}>
                Create playlist
            </button>
            </>
            }</div>
    )  
}}

 
export default PlaylistFinaliser