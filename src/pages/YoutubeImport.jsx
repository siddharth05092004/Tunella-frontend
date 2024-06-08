import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import PlaylistCard from "../components/PlaylistCard";
import querystring from "querystring";
import Footer from "../components/Footer";
import toast, { Toaster } from "react-hot-toast";

function YoutubeImport() {
  let youtube_access_token = "";
  const [youtube_user_name, set_youtube_user_name] = useState("");
  const [playlist_data, set_playlist_data] = useState([]);
  const [youtube_selected_array, set_youtube_selected_array] = useState([]);

  const redirect_to_youtube = 'https://accounts.google.com/o/oauth2/auth?' + querystring.stringify({
    client_id: process.env.REACT_APP_YOUTUBE_CLIENT_ID,
    redirect_uri: process.env.REACT_APP_YOUTUBE_REDIRECT_URI_IMPORT,
    scope: 'https://www.googleapis.com/auth/youtube.readonly',
    response_type: 'token'
  });

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

      // console.log(body_for_request,spotify_selected_array)
      
      window.location = "/share#"+database_response_id["_id"];
    
    }
  }


  function toggle_array_youtube(index) {
    let change_bg_element = document.getElementById(index.toString());

    let arr_after_toggle = youtube_selected_array;
    if (arr_after_toggle[index]) {
      arr_after_toggle[index] = 0;
      change_bg_element.classList.remove("border-red-400");
      change_bg_element.classList.remove("border-4");
    } else {
      arr_after_toggle[index] = 1;
      change_bg_element.classList.add("border-red-400");
      change_bg_element.classList.add("border-4");
    }
    set_youtube_selected_array(arr_after_toggle);
    set_playlist_data(playlist_data);
  }


  useEffect(() => {
    if (window.location.hash.includes("error")) {
      window.location = "/youtube-login-error";
    }

    if (window.location.hash) {
      youtube_access_token = window.location.hash.split("&")[0].substring(14);
      // console.log(youtube_access_token);
      get_youtube_user_name();
      get_playlist_data();
    }
    else{
      window.location = redirect_to_youtube;
    }
  }, []);

  async function get_playlist_data(){
    let playlist_response = await fetch(
      "https://www.googleapis.com/youtube/v3/playlists?" +
        querystring.stringify({
          mine: true,
          part: "snippet",
          access_token: youtube_access_token,
        })
    );
    playlist_response = await playlist_response.json();
    playlist_response = playlist_response['items']
    set_playlist_data(playlist_response);
  }

  async function getTracks(youtube_playlist_id) {
    // console.log(youtube_playlist_id)
    let playlist_track_data = [];
    if (window.location.hash) {
      youtube_access_token = window.location.hash.split("&")[0].substring(14);
    }
    const response_tracks = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?` + querystring.stringify({
        part:"snippet",
        playlistId:youtube_playlist_id,
        access_token:youtube_access_token,
        maxResults:50
      })
    );
    const user_tracks = await response_tracks.json();
    // console.log(user_tracks)
    await Object.keys(user_tracks["items"]).map(function (key, index) {
      try {
      if (user_tracks["items"][key]["snippet"]["title"]) {
        // console.log(user_tracks['items'][key])
        playlist_track_data.push({
          name: user_tracks["items"][key]["snippet"]["title"],
          artist: user_tracks["items"][key]["snippet"]["videoOwnerChannelTitle"],
          album: "",
          duration:0
        });
      }
      } catch (err) {
        console.log(err);
      }
    });
  //   console.log(playlist_track_data);
    return playlist_track_data;
  }


  async function Share_youtube_playlists(){
    let youtube_data_to_be_shared = [];
    youtube_selected_array.map(async (element, index) => {
      if (element) {
        let playlist_track_data_on_fulfill = [];
        await getTracks(playlist_data[index]["id"]).then(
          (res) => {
            playlist_track_data_on_fulfill = res;
          }
        );

        let playlist_data_object = {
          image_url: playlist_data[index]['snippet']['thumbnails']['default']['url'],
          name: playlist_data[index]['snippet']['title'],
          description: playlist_data[index]['snippet']['description'],
          playlist_track_data: playlist_track_data_on_fulfill,
        };

        await youtube_data_to_be_shared.push(playlist_data_object);
        if(youtube_data_to_be_shared.length == youtube_selected_array.filter(x => x==1).length)
       {  console.log(youtube_data_to_be_shared) 
        const stringified = JSON.stringify({data:youtube_data_to_be_shared});
        ask_for_approval_and_share(stringified,youtube_selected_array.filter(x => x==1).length);
      }
      }
    });
  }

  async function get_youtube_user_name() {
    let user_channel_response = await fetch(
      "https://www.googleapis.com/youtube/v3/channels?" +
        querystring.stringify({
          mine: true,
          part: "snippet",
          access_token: youtube_access_token,
        })
    );
    user_channel_response = await user_channel_response.json();
    set_youtube_user_name(
      user_channel_response["items"][0]["snippet"]["title"]
    );
  }

  return (
    <>
      {/* <div className="bg-blue-300 h-full overflow-hidden">
        <Navbar />
        <div className="grid grid-cols-1 place-items-center md:flex justify-center items-center">
          <div>
            <div className="justify-center flex mt-10 text-5xl text-gray-800">
              Hi, {youtube_user_name}!
            </div>
            <div className="flex justify-center text-2xl mt-4 text-gray-900">
              Following are your playlists we could fetch, select the ones you
              want to export/share.
            </div>
          </div>
          <div>
            <button
              onClick={Share_youtube_playlists}
              className="p-2 border-4 rounded-xl border-gray-800 bg-red-800 transition-all ease-in duration-150 hover:bg-red-700 text-gray-200 text-4xl"
            >
              Share!
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 m-8">
          {Object.keys(playlist_data).map(function (key, index) {
            // console.log(playlist_data[key])
            let image_url_alt_src = "/assets/logos/logo.png"
            try{
              image_url_alt_src = playlist_data[key]['snippet']['thumbnails']['default']['url']
            }
            catch(err){
              console.log("no image for playlist"+playlist_data[key]["id"])
            }
            return (
              <div
                className="rounded-2xl m-4"
                id={index.toString()}
                onClick={() => toggle_array_youtube(index)}
              >
                 <PlaylistCard
                  description={playlist_data[key]['snippet']['description']}
                  key={index}
                  name={playlist_data[key]['snippet']['title']}
                  image_url={image_url_alt_src}
                  playlist_url=""
                />
              </div>
            );
          })}
        </div>
      </div> */}


<div className="bg-indigo-600 h-full min-h-screen overflow-hidden">
        <Navbar />
        import toast, { Toaster } from "react-hot-toast";
        <div className="m-3 grid grid-cols-1 place-items-center md:flex justify-center items-center">
          <div>
            <div className="justify-center flex mt-10 text-5xl text-gray-100">
              Hi, {youtube_user_name}!
            </div>
            <div className="flex justify-center text-2xl mt-4 text-gray-200">
              Following are your playlists we could fetch, select the ones you
              want to export/share.
            </div>
          </div>
          <div>
            <button
              onClick={Share_youtube_playlists}
              className="hover:scale-105  mt-3 sm:mt-1 p-2 border-4 rounded-xl border-gray-800 bg-red-800 transition-all ease-in duration-150 hover:bg-red-700 text-gray-200 text-4xl"
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
              image_url_alt_src =playlist_data[key]['snippet']['thumbnails']['default']['url']
            }
            catch(err){
              // console.log("no image for playlist"+playlist_data[key]["external_urls"]["spotify"])
            }
            return (
              <div
                className="rounded-2xl m-4 transition-all duration-300 hover:scale-105"
                id={index.toString()}
                onClick={() => toggle_array_youtube(index)}
              >
                <PlaylistCard
                  description={playlist_data[key]['snippet']['description']}
                  key={index}
                  name={playlist_data[key]['snippet']['title']}
                  image_url={image_url_alt_src}
                  playlist_url=""
                />
              </div>
            );
          })}
        </div>
        
      </div>
    







    </>
  );
}

export default YoutubeImport;
