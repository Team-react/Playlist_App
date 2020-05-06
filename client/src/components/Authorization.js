import React, { Component } from "react";
import SpotifyWebApi from 'spotify-web-api-node';

var spotifyApi = new SpotifyWebApi();

class Authorization extends Component {
  constructor(props){
    super(props);
    const params = this.getHashParams();
    this.token = params.access_token;
    if (this.token) {
      spotifyApi.setAccessToken(this.token)
    }
  }

  // getName() {
  //   var displayName = ''
  //   spotifyApi.setAccessToken(this.token)
  //   spotifyApi.getMe()
  //     .then(function(data) {
  //         displayName = data.body.display_name
  //         // console.log(data.body.display_name)
  //     }, function(err) {
  //       console.log('Something went wrong!', err);
  //     });
  //     return displayName
  // }

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

  render() {
    return (
        <div>
          <div>
            <a href='http://localhost:8888' > Login to Spotify </a>
          </div>
        </div>
    );
  }
}
 
export default Authorization;