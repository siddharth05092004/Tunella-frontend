import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import querystring from "querystring";
import toast, { Toaster } from "react-hot-toast";
import Footer from "../components/Footer";

function SpotifyExport(props) {
  const redirect_to_spotify =
    "https://accounts.spotify.com/authorize?" +
    querystring.stringify({
      response_type: "token",
      client_id: process.env.REACT_APP_SPOTIFY_CLIENT_ID,
      scope: "playlist-modify-public playlist-modify-private",
      redirect_uri: process.env.REACT_APP_SPOTIFY_REDIRECT_URI_EXPORT,
    });

  let spotify_access_token = "";
  let spotify_user_id = "";

  useEffect(() => {
    if (window.location.hash.includes("error")) {
      window.location = "/spotify-login-error";
    }
    if (window.location.hash) {
      spotify_access_token = window.location.hash.split("&")[0].substring(14);
      check_validity(spotify_access_token);
    }
    else{
      window.location = redirect_to_spotify;
    }

    
    
  }, []);

  async function check_validity(spotify_access_token){
    const response = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: "Bearer " + spotify_access_token,
      },
    });
    if(response.status==403){
      window.location="/test-credentials"
    }
  }

  async function add_track_to_playlist(
    spotify_playlist_id,
    original_track_details
  ) {
    if (window.location.hash) {
      spotify_access_token = window.location.hash.split("&")[0].substring(14);
    }
    let search_track_response = await fetch(
      "https://api.spotify.com/v1/search?q=" +
        querystring.stringify({
          track: original_track_details["name"],
          artist: original_track_details["artist"],
          type: "track",
        }),
      {
        headers: {
          Authorization: "Bearer " + spotify_access_token,
        },
      }
    );
    search_track_response = await search_track_response.json();
    // console.log(JSON.stringify({
    //     "uris":["spotify:track:"+search_track_response['tracks']['items'][0]['id']]
    //   }));

    let spotify_add_track_response = await fetch(
      `https://api.spotify.com/v1/playlists/${spotify_playlist_id}/tracks`,
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + spotify_access_token,
        },
        body: JSON.stringify({
          uris: [
            "spotify:track:" +
              search_track_response["tracks"]["items"][0]["id"],
          ],
        }),
      }
    );
    spotify_add_track_response = spotify_add_track_response.json();
  }

  async function add_spotify_playlist(playlist_data) {
    let playlist_add_response = await fetch(
      `https://api.spotify.com/v1/users/${spotify_user_id}/playlists`,
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + spotify_access_token,
        },
        body: JSON.stringify({
          name: playlist_data["name"],
          description: playlist_data["description"],
        }),
      }
    );
    playlist_add_response = await playlist_add_response.json();
    const spotify_playlist_id = playlist_add_response["id"];
    playlist_data["playlist_track_data"].map((key, index) => {
      add_track_to_playlist(spotify_playlist_id, key);
    });
  }

  async function add_playlists_to_spotify(playlists_data) {
    const response = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: "Bearer " + spotify_access_token,
      },
    });
    const user_data = await response.json();
    spotify_user_id = user_data["id"];
    //   console.log(spotify_user_id)
    // console.log(playlists_data)

    playlists_data.map((key, index) => {
      add_spotify_playlist(key);
    });

    toast.success("Congrats! Check for the playlist in your Spotify account.");
  }


  async function fetch_playlist_data() {
    // console.log("started")
    const playlist_id = document.getElementById("playlist_text_box").value;
    const response_database = await fetch(
      process.env.REACT_APP_BACKEND_URI + "/" + playlist_id
    );

    let response_database_json = await response_database.json();

    if(response_database_json['error'] == "Can't fetch playlist data"){
      toast.error("Wrong code provided!")
    }
    else{
    response_database_json = await response_database_json["data"];
    console.log(response_database_json)
    const confirmation = window.confirm(
      `A total of ${response_database_json.length} playlists will be added to your Spotify account`
    );
    if (confirmation) {
      add_playlists_to_spotify(response_database_json);
    }}
  }

  return (
    <>
      <div className="poppins-regular bg-primary h-full overflow-hidden">
        <Navbar />
        <Toaster position="bottom-right" />
        <div className="m-6 md:m-12 text-gray-100 grid grid-cols-1 grid-items-center place-items-center">
          <p className="max-w-5xl mt-10 text-2xl  sm:mt-20 sm:text-2xl md:text-4xl text-secondary flex justify-center">
            Hi! Enter the code and the playlists will be added to your spotify
            account.
          </p>
          <div className="mt-20 grid grid-cols-1 place-items-center grid-items-center sm:flex justify-center">
            <input
              type="text"
              id="playlist_text_box"
              className="m-8  border   text-lg rounded-lg max-w-xs md:w-screen p-2.5 bg-gray-600 border-gray-300 placeholder-gray-400  focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="m-8 flex justify-center items-center">
            <button
              onClick={fetch_playlist_data}
              className="bg-secondary text-gray-200 text-2xl poppins-medium transition-all duration-150 hover:opacity-95 hover:scale-105 px-10 py-4 rounded-xl"
              ><span className="">Submit</span>
            </button></div>
          </div>
        </div>
        <Footer/>
      </div>
    </>
  );
}

export default SpotifyExport;
