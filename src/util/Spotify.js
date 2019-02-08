let accessToken;
let expiresIn;

const clientId = '0901414427de416a843b06bac1073429';
//const redirectURI = "https://jammmingjo.surge.sh";
const redirectURI = "http://localhost:3000/";

const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    } else if (window.location.href.match(/access_token=([^&]*)/) && window.location.href.match(/expires_in=([^&]*)/)) {
      accessToken = window.location.href.match(/access_token=([^&]*)/)[1];
      expiresIn = window.location.href.match(/expires_in=([^&]*)/)[1];
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');

      return accessToken;
    } else {
      window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
    }
  },

  search(term) {
    let accessToken = this.getAccessToken()
    console.log(accessToken);
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).then(response => {
      return response.json();
    }).then(jsonResponse => {
        if (jsonResponse) {
          return jsonResponse.tracks.items.map(track => ({
              id: track.id,
              name: track.name,
              artist: track.artists[0].name,
              album: track.album.name,
              uri: track.uri
          }));
        } else {
          return {};
        }
    })
  },

  //Step 89
  savePlaylist(playlistName, trackURIs) {
      if (!playlistName || !trackURIs) {
        return;
      }

      let accessToken = this.getAccessToken();
      let userId;
      let playlistId;

      return fetch(`https://api.spotify.com/v1/me`, {
        headers: {Authorization: `Bearer ${accessToken}`}
      }).then(response => response.json()).then(jsonResponse => {
        if (jsonResponse) {
          userId = jsonResponse.id
        }
      }).then(() =>
        fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({name: playlistName})
        }).then(response => response.json()).then(jsonResponse => {
          if (jsonResponse) {
            playlistId = jsonResponse.id
          }
        }).then(() => {
          fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({uris: trackURIs})
          }).then(response => response.json()).then(jsonResponse => {
            if (jsonResponse) {
              console.log("Playlist saved!")
            }
          })
        })
      )


  }

};

export default Spotify;
