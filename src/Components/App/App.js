import React from 'react';
import './App.css';

import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistName: "New Playlist",
      playlistTracks: []
    };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  // Step 41: adds a song to the playlist state
  addTrack(newTrack) {
    const inPlaylist = this.state.playlistTracks.find(track => {
      return track.id === newTrack.id;
    });
    if (!inPlaylist) {
      const newPlaylist = this.state.playlistTracks.concat(newTrack);
      this.setState({playlistTracks: newPlaylist});
    }
  }

  //Step 49
  removeTrack(track) {
    const newPlaylist = this.state.playlistTracks.filter(tracks => {
      return tracks.id !== track.id;
    })
    this.setState({playlistTracks: newPlaylist});
  }

  //Step 57: enable user to update name of their playlist
  updatePlaylistName(newName) {
    this.setState({
      playlistName: newName
    })
  }

  //Step 63: enable user to save playlist to their Spotify account
  savePlaylist(){
    console.log('saving playlist');
    let trackURIs = this.state.playlistTracks.map(track => track.uri);
    let playlistName = this.state.playlistName;
    Spotify.savePlaylist(playlistName, trackURIs).then(response => {
      if (response) {
        this.setState({
          playlistName: 'New Playlist',
          playlistTracks: []
        });
      }
    })


  }

  //Step 67: enable user to enter search and receive response from SPOTIFY
  search(searchTerm) {
    Spotify.search(searchTerm).then(tracks => {
      this.setState({
        searchResults: tracks
      });
    })
  }

  componentDidMount(){
    Spotify.getAccessToken();
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search}/>
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
            <Playlist
              playlistName = {this.state.playlistName}
              playlistTracks = {this.state.playlistTracks}
              onRemove = {this.removeTrack}
              onNameChange = {this.updatePlaylistName}
              onSave = {this.savePlaylist} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
