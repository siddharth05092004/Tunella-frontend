import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import PlaylistCard from "../components/PlaylistCard";
import querystring from 'querystring';
import Footer from "../components/Footer";
import toast, { Toaster } from "react-hot-toast";


function SpotifyImport() {
  let spotify_access_token = "";

  const redirect_to_spotify =
    "https://accounts.spotify.com/authorize?" +
    querystring.stringify({
      response_type: "token",
      client_id: process.env.REACT_APP_SPOTIFY_CLIENT_ID,
      scope: "playlist-read-private playlist-read-collaborative",
      redirect_uri: process.env.REACT_APP_SPOTIFY_REDIRECT_URI_IMPORT,
    });

  const [spotify_selected_array, set_spotify_selected_array] = useState([]);
  const [display_name, set_display_name] = useState("");
  let spotify_user_id = "";
  const [playlist_data, set_playlist_data] = useState([]);

  async function selected_array_builder() {
    let arr_set = [];
    Object.keys(playlist_data).map(function (key, index) {
      arr_set.push(0);
    });
    set_spotify_selected_array(arr_set);
  }

  async function getPlaylists(spotify_access_token) {

    const response = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: "Bearer " + spotify_access_token,
      },
    });
    console.log(response)
    if(response.status==403){
      window.location="/test-credentials"
    }
    const user_data = await response.json();
    console.log(user_data)
    spotify_user_id = user_data["id"];
    set_display_name(user_data["display_name"]);
    const response_playlists = await fetch(
      `https://api.spotify.com/v1/users/${spotify_user_id}/playlists/`,
      {
        headers: {
          Authorization: "Bearer " + spotify_access_token,
        },
      }
    );
    const user_playlists = (await response_playlists.json())["items"];
    await set_playlist_data(user_playlists);
    // const loader = document.getElementById('loading');
    // loader.classList.add('hidden');
    selected_array_builder();
    
  }

  async function getTracks(spotify_playlist_id) {
    // console.log(spotify_playlist_id)
    let playlist_track_data = [];
    const response_tracks = await fetch(
      `https://api.spotify.com/v1/playlists/${spotify_playlist_id}/tracks/`,
      {
        headers: {
          Authorization:
            "Bearer " + window.location.hash.split("&")[0].substring(14),
        },
      }
    );
    const user_tracks = await response_tracks.json();
    console.log(user_tracks)
    await Object.keys(user_tracks["items"]).map(function (key, index) {
      // try {
      if (user_tracks["items"][key]["track"]["name"]) {
        // console.log(user_tracks['items'][key])
        playlist_track_data.push({
          name: user_tracks["items"][key]["track"]["name"],
          artist: user_tracks["items"][key]["track"]["artists"][0]["name"],
          album: user_tracks["items"][key]["track"]["album"]["name"],
          duration: user_tracks["items"][key]["track"]["duration_ms"],
        });
      }
      // } catch (err) {
      //   console.log(err);
      // }
    });
    console.log(playlist_track_data);
    return playlist_track_data;
  }

  async function Share_spotify_playlists() {
    // console.log("hi")
    let spotify_data_to_be_shared = [];
    spotify_selected_array.map(async (element, index) => {
      if (element) {
        let playlist_track_data_on_fulfill = [];
        await getTracks(playlist_data[index]["id"]).then(
          (res) => {
            playlist_track_data_on_fulfill = res;
          }
        );

        let playlist_data_object = {
          image_url: playlist_data[index]["images"][0]["url"],
          name: playlist_data[index]["name"],
          description: playlist_data[index]["description"],
          playlist_track_data: playlist_track_data_on_fulfill,
        };

        await spotify_data_to_be_shared.push(playlist_data_object);
        if(spotify_data_to_be_shared.length == spotify_selected_array.filter(x => x==1).length)
       {  console.log(spotify_data_to_be_shared) 
        const stringified = JSON.stringify({data:spotify_data_to_be_shared});
        ask_for_approval_and_share(stringified,spotify_selected_array.filter(x => x==1).length);
      }
      }
    });

    // console.log(spotify_data_to_be_shared);
    // const database_response = await fetch(process.env.REACT_APP_BACKEND_URI, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     "data": "hi",
    //   }),
    // });

    
    
  }


  async function ask_for_approval_and_share(body_for_request,no_of_playlist){
    const confirmation = window.confirm(`A total of ${no_of_playlist} playlists will be shared. Do you want to continue?`);

    if(confirmation){

      toast.loading("Wait while we generate a code for the data.")
      const database_response = await fetch(process.env.REACT_APP_BACKEND_URI,{method:"POST",
            
      headers: {
          'Content-Type': 'application/json'
        },
      body: body_for_request})
      const database_response_id = await database_response.json();
      console.log(database_response_id["_id"])

      console.log(body_for_request,spotify_selected_array)
      
      window.location = "/share#"+database_response_id["_id"];
    
    }
  }

  function toggle_array_spotify(index) {
    let change_bg_element = document.getElementById(index.toString());

    let arr_after_toggle = spotify_selected_array;
    if (arr_after_toggle[index]) {
      arr_after_toggle[index] = 0;
      change_bg_element.classList.remove("border-red-400");
      change_bg_element.classList.remove("border-4");
    } else {
      arr_after_toggle[index] = 1;
      change_bg_element.classList.add("border-red-400");
      change_bg_element.classList.add("border-4");
    }
    set_spotify_selected_array(arr_after_toggle);
    set_playlist_data(playlist_data);
  }

  useEffect(() => {
    if (window.location.hash.includes("error")) {
      window.location = "/spotify-login-error";
    }
    if (window.location.hash) {
      spotify_access_token = window.location.hash.split("&")[0].substring(14);
      getPlaylists(spotify_access_token);
    }
    else{
      window.location = redirect_to_spotify;
    }
  }, []);

  return (
    <>
      <div className="bg-indigo-600 h-full min-h-screen overflow-hidden">
        <Navbar />
        <Toaster position="top-right"/>
        <div className="m-3 grid grid-cols-1 place-items-center md:flex justify-center items-center">
          <div>
            <div className="justify-center flex mt-10 text-5xl text-gray-100">
              Hi, {display_name}!
            </div>
            <div className="flex justify-center text-2xl mt-4 text-gray-200">
              Following are your playlists we could fetch, select the ones you
              want to export/share.
            </div>
          </div>
          <div>
            <button
              onClick={Share_spotify_playlists}
              className=" hover:scale-105 mt-3 sm:mt-1 p-2 border-4 rounded-xl border-gray-800 bg-green-400 transition-all ease-in duration-150 hover:bg-green-500 text-gray-800 text-4xl"
            >
              Share!
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 m-8">
          {Object.keys(playlist_data).map(function (key, index) {
            // console.log(playlist_data[key]["external_urls"]["spotify"])
            let image_url_alt_src = "/assets/logos/logo.png"
            try{
              image_url_alt_src = playlist_data[key]["images"][0]["url"]
            }
            catch(err){
              // console.log("no image for playlist"+playlist_data[key]["external_urls"]["spotify"])
            }
            return (
              <div
                className="rounded-2xl m-4 transition-all duration-300 hover:scale-105"
                id={index.toString()}
                onClick={() => toggle_array_spotify(index)}
              >
                <PlaylistCard
                  
                  description={playlist_data[key]["description"]}
                  key={index}
                  name={playlist_data[key]["name"]}
                  image_url={image_url_alt_src}
                  playlist_url={playlist_data[key]["external_urls"]["spotify"]}
                />
              </div>
            );
          })}
        </div>
        
      </div>
    </>
  );
}

export default SpotifyImport;
