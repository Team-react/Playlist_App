
<!-- [![Build Status](https://travis-ci.org/Team-react/Playlist_App.svg?colorA=000000&branch=master)](https://travis-ci.org/Team-react/Playlist_App) -->

[![Build Status](https://img.shields.io/travis/Team-react/Playlist_App/master.svg?colorA=000000)](https://travis-ci.org/Team-react/Playlist_App)

<!-- Team-react/Playlist_App -->

<img src="https://img.shields.io/badge/made%20with-React-blue.svg?logo=react&colorA=000000" alt="made with React">

# Spotify App - Road To Discovery

[Link to App](https://road-to-discovery.herokuapp.com/)

![AppImage](https://raw.githubusercontent.com/Thatguy560/CV/master/Assets/Screenshot%202020-05-20%20at%2018.33.52.png)

This application was created using React, Node and the Spotify Web API. This App was created with the sole purpose of being able to make a playlist as quickly and efficiently as possible. If for example, you're going on a road trip and forgot to make a playlist the night before, this app will allow you to quickly generate a brand new playlist with the added merit of being able to discover so many new tracks and artists by utilising a randomizer with the Spotify Web API.

## Getting Started and using the App

### 1) Getting Set Up

- git clone https://github.com/Team-react/Playlist_App
- cd Playlist_App

### 2)  Start Auth Server
- Navigate (cd) to the auth-server directory `cd auth-server`
- Install the dependencies `npm install`
- Run the Server `node authorization_code/app.js`

### 3)  Start Client
- Navigate (cd) to the auth-server directory `cd client`
- Install the dependencies `npm install`
- Run the Server `npm start`

### 4)  Use the App
- Visit `http://localhost:8888/`
- Click 'Log in with Spotify' to Log In

# User Stories

```
As a User,
so I can authorise my Spotify Account with the App,
I'd like to be able to log in with Spotify 
```
```
As a User,
so I can choose what I want in my playlist,
I'd like to be able to input artist or genre in my search
```
```
As a User,
So I know as much about each song as possible,
I'd like to be able to see the artist name, album name and album art
```
```
As a User,
so I know which songs I want to add into my playlist,
I'd like to be able to hear a preview of each song by which artist
```
```
As a User,
so I can have my playlist last for a desired length,
I'd like to be able to input the playlist length
```
```
As a User,
so I can choose which songs I want to have in my playlist,
I'd like to be able to say 'Yes' or 'No' to a song
```
```
As a User,
so I can have a playlist without a default name,
I'd like to be able to name my new Playlist
```
```
As a User,
so in the off chance I change my mind on a song I've said yes to,
I'd like to be able to remove songs from my list of chosen songs.
```
