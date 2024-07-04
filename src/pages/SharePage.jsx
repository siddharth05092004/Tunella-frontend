import { useEffect, useState } from "react";
import Navbar from "./../components/Navbar.jsx";
import PlaylistCard from "../components/PlaylistCard";
import querystring from "querystring";
import toast, { Toaster } from "react-hot-toast";
import Footer from "../components/Footer.jsx";
import Loading from "../components/Loading.jsx";

function SharePage() {
  const [share_page_data, set_share_page_data] = useState([]);

  function call_spotify() {
    window.open(
      "https://accounts.spotify.com/authorize?" +
        querystring.stringify({
          response_type: "token",
          client_id: process.env.REACT_APP_SPOTIFY_CLIENT_ID,
          scope: "playlist-modify-public playlist-modify-private",
          redirect_uri: process.env.REACT_APP_SPOTIFY_REDIRECT_URI_EXPORT,
        }),
      "newwin",
      "height=600px,width=500px"
    );
  }
  function call_youtube() {
    window.open(
      "https://accounts.google.com/o/oauth2/auth?" +
        querystring.stringify({
          client_id: process.env.REACT_APP_YOUTUBE_CLIENT_ID,
          redirect_uri: process.env.REACT_APP_YOUTUBE_REDIRECT_URI_EXPORT,
          scope: "https://www.googleapis.com/auth/youtube.force-ssl",
          response_type: "token",
        }),
      "newwin",
      "height=600px,width=500px"
    );
  }

  async function select_code() {
    navigator.clipboard.writeText(window.location.hash.substring(1));
    toast.success("Code Copied");
  }

  async function select_url() {
    navigator.clipboard.writeText(window.location.href);
    toast.success("URL Copied");
  }

  async function get_share_page_data(share_data_id) {
    console.log(process.env.REACT_APP_BACKEND_URI + "/" + share_data_id);
    const response_database = await fetch(
      process.env.REACT_APP_BACKEND_URI + "/" + share_data_id
    );

    const response_database_json = await response_database.json();

    if (response_database_json["error"] == "Can't fetch playlist data") {
      window.location = "playlist-get-error";
    }

    await set_share_page_data(response_database_json["data"]);
  }

  useEffect(() => {
    if (window.location.hash) {
      get_share_page_data(window.location.hash.substring(1));
    } else {
    }

    window.addEventListener("storage", () => {
      if (window.localStorage.getItem("spotify_access_token") != "") {
        if(window.localStorage.getItem("spotify_access_token")=="error")
          {
            toast.error("Cannot login to Spotify!");
          }
          else{
            console.log(window.localStorage.getItem("spotify_access_token"));
            spotify_fetch_playlist_data(window.localStorage.getItem("spotify_access_token"));
          }
        window.localStorage.setItem("spotify_access_token","");

      }
      if (window.localStorage.getItem("youtube_access_token") != "") {
        if(window.localStorage.getItem("youtube_access_token")=="error")
          {
            toast.error("Cannot login to YouTube!");
          }
          else{
            console.log(window.localStorage.getItem("youtube_access_token"));
            fetch_playlist_data(window.localStorage.getItem("youtube_access_token"));
          }
          window.localStorage.setItem("youtube_access_token","");

      }
    });

    const loading_animation = document.getElementById("loading_id");
    
    for (let i = 0; i < loading_animation.childNodes.length; i++) {
      loading_animation.childNodes[i].classList.add('hidden')
    }

  }, []);
    //----------------------------------------Spotify logic

    async function spotify_add_track_to_playlist(
      spotify_access_token,
      spotify_playlist_id,
      original_track_details
    ) {
      
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

    async function add_spotify_playlist(spotify_user_id,spotify_access_token,playlist_data) {
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
        spotify_add_track_to_playlist(spotify_access_token,spotify_playlist_id, key);
      });
    }

    async function add_playlists_to_spotify(spotify_access_token,playlists_data) {
      const response = await fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: "Bearer " + spotify_access_token,
        },
      });
      const user_data = await response.json();
      let spotify_user_id = user_data["id"];
      //   console.log(spotify_user_id)
      // console.log(playlists_data)

      playlists_data.map((key, index) => {
        add_spotify_playlist(spotify_user_id,spotify_access_token,key);
      });

      toast.success(
        "Congrats! Check for the playlist in your Spotify account."
      );
    }

    async function spotify_fetch_playlist_data(spotify_access_token) {

      let playlist_id = window.location.hash.substring(1);

        const response_database = await fetch(
      process.env.REACT_APP_BACKEND_URI + "/" + playlist_id
    );

    let response_database_json = await response_database.json();

    if(response_database_json['error'] == "Can't fetch playlist data"){
      toast.error("Wrong code provided!")
    }
    else{
    response_database_json = await response_database_json["data"];
    // console.log(response_database_json)
    const confirmation = window.confirm(
      `A total of ${response_database_json.length} playlists will be added to your Spotify account`
    );
    if (confirmation) {
      add_playlists_to_spotify(spotify_access_token,response_database_json);
    }}
      }
    

    //----------------------------------------End Spotify Logic


    //----------------------------------------Youtube logic


    
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
  
  
  
  
    async function add_youtube_playlist(youtube_access_token,playlist_data,first_success) {
     
  
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
  
      if(response.status==403){
        window.location="/quota-over"
      }
      else if(first_success){
        first_success = false
      toast.success("Congrats! Check for the playlist in your Youtube account.");}
      let created_playlist_id_response = await response.json();
      created_playlist_id_response = created_playlist_id_response["id"];
      console.log(created_playlist_id_response);
      playlist_data["playlist_track_data"].map((key, index) => {
        if(index < 5){add_track_to_playlist(
          created_playlist_id_response,
          key,
          youtube_access_token
        )}
      });
    }
  
    async function add_playlists_to_youtube(youtube_access_token,playlists_data) {
      await playlists_data.map((key, index) => {
         add_youtube_playlist(youtube_access_token,key,true);
      });
      // console.log("done")
      
    }
  
    async function fetch_playlist_data(youtube_access_token) {
      const playlist_id = window.location.hash.substring(1);
      const response_database = await fetch(
        process.env.REACT_APP_BACKEND_URI + "/" + playlist_id
      );
  
      let response_database_json = await response_database.json();
  
      if(response_database_json['error'] == "Can't fetch playlist data"){
        toast.error("Wrong code provided!")
      }
  else{
      response_database_json = await response_database_json["data"];
      const confirmation = window.confirm(
        `A total of ${response_database_json.length} playlists will be added to your Youtube account`
      );
      if (confirmation) {
        add_playlists_to_youtube(youtube_access_token,response_database_json);
      }}
    }





    //------------------------------------------End Youtube logic
  

  return (
    <>
      <div className="poppins-medium bg-primary h-full overflow-hidden">
        <Navbar />
        <Loading/>
        <Toaster position="bottom-right" />
        <div className="grid grid-cols-1 place-items-center  justify-center items-center">
          <div className="m-6 sm:m-10">
            <div className="m-5 grid grid-cols-1 justify-center text-xl sm:text-2xl md:text-3xl mt-4 text-secondary">
              <div>
                Following are the playlists. In order to share this page to a
                friend, copy this link:{" "}
                <div
                  className="poppins-regular mt-2 justify-center text-xl underline sm:text-2xl md:text-3xl flex hover:cursor-pointer text-tertiary transition duration-200  hover:text-gray-600 line-clamp-1"
                  onClick={select_url}
                >
                  <img
                    className="w-6 invert"
                    src="/assets/icons/copy.svg"
                    alt=""
                  />
                  {window.location.href}{" "}
                </div>{" "}
              </div>
              
            </div>
          </div>
          <div>
            <div className="flex justify-center">
              <div className="text-secondary grid max-w-2xl place-items-center grid-items-center grid-cols-1  md:mx-24 md:grid-cols-2 text-4xl">
                <button
                  onClick={call_spotify}
                  className="transition-all duration-300 hover:scale-105 p-4 sm:p-8 flex gap-4 justify-center items-center"
                >
                  <img
                    src="assets/logos/spotify.png"
                    className="w-14 sm:w-16"
                    alt=""
                  />
                  <span>Spotify</span>
                </button>
                <button
                  onClick={call_youtube}
                  className="transition-all duration-300 hover:scale-105 p-4 sm:p-8 flex gap-4 justify-center items-center"
                >
                  <img
                    src="assets/logos/youtube.png"
                    className="w-14 sm:w-20"
                    alt=""
                  />
                  <span>YouTube</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 m-8 ">
          {Object.keys(share_page_data).map(function (key, index) {
            // console.log(playlist_data[key]["external_urls"]["spotify"])
            return (
              <div
                className="rounded-2xl m-4"
                id={index.toString()}
                // onClick={() => toggle_array_spotify(index)}
              >
                <PlaylistCard
                  description={share_page_data[key]["description"]}
                  key={index}
                  name={share_page_data[key]["name"]}
                  image_url={share_page_data[key]["image_url"]}
                  //   playlist_url={playlist_data[key]["external_urls"]["spotify"]}
                />
              </div>
            );
          })}
        </div>
        <Footer />
      </div>
    </>
  );
}

export default SharePage;
