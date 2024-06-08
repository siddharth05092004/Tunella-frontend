import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import querystring from "querystring";
import toast, { Toaster } from "react-hot-toast";

function YoutubeExport() {
  let youtube_access_token = "";
  const max_tries = 3;

  async function add_track_to_playlist(
    youtube_playlist_id,
    original_track_details,
    youtube_access_token
  ) {
    console.log("started processing");
    let search_track_response = await fetch(
      "https://www.googleapis.com/youtube/v3/search?part=snippet&q=" +
        querystring.stringify({
          track: original_track_details["name"],
          artist: original_track_details["artist"],
          type: "video",
        }),
      {
        headers: {
          Authorization: "Bearer " + youtube_access_token,
        },
      }
    );
    search_track_response = await search_track_response.json();

    // console.log(search_track_response["items"][0]["id"]);

    // console.log(JSON.stringify({
    //     "uris":["spotify:track:"+search_track_response['tracks']['items'][0]['id']]
    //   }));
    const response = await fetch(
      "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${youtube_access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          snippet: {
            playlistId: youtube_playlist_id,
            resourceId: search_track_response["items"][0]["id"],
          },
        }),
      }
    );
  }

  useEffect(() => {
    if (window.location.hash.includes("error")) {
      window.location = "/youtube-login-error";
    }
    if (window.location.hash) {
      youtube_access_token = window.location.hash.split("&")[0].substring(14);
    }
  }, []);

  async function add_youtube_playlist(playlist_data) {
    if (window.location.hash) {
      youtube_access_token = window.location.hash.split("&")[0].substring(14);
    }

    const response = await fetch(
      "https://www.googleapis.com/youtube/v3/playlists?part=snippet",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${youtube_access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          snippet: {
            title: playlist_data["name"],
          },
        }),
      }
    );

    let created_playlist_id_response = await response.json();
    created_playlist_id_response = created_playlist_id_response["id"];
    console.log(created_playlist_id_response);
    playlist_data["playlist_track_data"].map((key, index) => {
      add_track_to_playlist(
        created_playlist_id_response,
        key,
        youtube_access_token
      );
    });
  }

  async function add_playlists_to_youtube(playlists_data) {
    playlists_data.map((key, index) => {
      add_youtube_playlist(key);
    });
    // console.log("done")
    toast.success("Congrats! Check for the playlist in your Spotify account.");
  }

  async function fetch_playlist_data() {
    const playlist_id = document.getElementById("playlist_text_box").value;
    const response_database = await fetch(
      process.env.REACT_APP_BACKEND_URI + "/" + playlist_id
    );

    let response_database_json = await response_database.json();
    response_database_json = await response_database_json["data"];
    const confirmation = window.confirm(
      `A total of ${response_database_json.length} playlists will be added to your Youtube account`
    );
    if (confirmation) {
      add_playlists_to_youtube(response_database_json);
    }
  }

  return (
    <>
      <div className="bg-indigo-900 h-full min-h-screen overflow-hidden">
        <Navbar />
        <Toaster position="bottom-right" />
        <div className="m-6 md:m-12 text-gray-100 grid grid-cols-1 grid-items-center place-items-center">
          <p className="max-w-5xl mt-10 text-2xl font-mono sm:mt-20 sm:text-2xl md:text-4xl text-red-500 flex justify-center">
            Hi! Enter the code and the playlists will be added to your youtube
            account.
          </p>
          <div className="mt-20 grid grid-cols-1 place-items-center grid-items-center sm:flex justify-center">
            <input
              type="text"
              id="playlist_text_box"
              className="m-8  border   text-lg rounded-lg max-w-xs md:w-screen p-2.5 bg-gray-700 border-gray-300 placeholder-gray-400  focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="m-8 flex justify-center items-center">
            <button
              onClick={fetch_playlist_data}
              className="h-16 rounded-xl text-3xl p-1 bg-gradient-to-br from-orange-400 to-red-600 text-gray-100 transition duration-200 hover:bg-green-500 "
              ><span className="transition-all ease-in duration-100 bg-indigo-900  rounded-lg p-2 hover:bg-opacity-0">Submit</span>
            </button></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default YoutubeExport;
