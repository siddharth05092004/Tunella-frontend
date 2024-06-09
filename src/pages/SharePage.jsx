import { useEffect, useState } from "react";
import Navbar from "./../components/Navbar.jsx";
import PlaylistCard from "../components/PlaylistCard";
import querystring from "querystring";
import toast, { Toaster } from "react-hot-toast";

function SharePage() {
  const [share_page_data, set_share_page_data] = useState([]);

  const redirect_to_spotify =
    "https://accounts.spotify.com/authorize?" +
    querystring.stringify({
      response_type: "token",
      client_id: process.env.REACT_APP_SPOTIFY_CLIENT_ID,
      scope: "playlist-modify-public playlist-modify-private",
      redirect_uri: process.env.REACT_APP_SPOTIFY_REDIRECT_URI_EXPORT,
    });

  const redirect_to_youtube =
    "https://accounts.google.com/o/oauth2/auth?" +
    querystring.stringify({
      client_id: process.env.REACT_APP_YOUTUBE_CLIENT_ID,
      redirect_uri: process.env.REACT_APP_YOUTUBE_REDIRECT_URI_EXPORT,
      scope: "https://www.googleapis.com/auth/youtube.force-ssl",
      response_type: "token",
    });
  console.log(redirect_to_youtube);

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
  }, []);

  return (
    <>
      <div className="poppins-regular bg-primary min-h-screen h-full overflow-hidden">
        <Navbar />
        <Toaster position="bottom-right" />
        <div className="grid grid-cols-1 place-items-center  justify-center items-center">
          <div className="m-6 sm:m-10">
            <div className="m-5 grid grid-cols-1 justify-center text-md sm:text-xl md:text-2xl mt-4 text-secondary">
              <div>
                Following are the playlists. In order to share this page to a
                friend, copy this link:{" "}
                <div
                  className="text-xl underline sm:text-2xl md:text-3xl flex hover:cursor-pointer text-tertiary transition duration-200  hover:text-gray-100 line-clamp-1"
                  onClick={select_url}
                >
                  <img className="w-6 invert"
                    src="/assets/icons/copy.svg"
                    alt=""
                  />
                  {window.location.href}{" "}
                </div>{" "}
              </div>
              <div>
                If you want to export this data to your accounts, copy this code
                and choose platform:{" "}
                <div
                  className="underline text-xl sm:text-2xl md:text-3xl flex hover:cursor-pointer text-tertiary
                   transition duration-200  hover:text-gray-100"
                  onClick={select_code}
                >
                  <img className="w-6 invert"
                    src="/assets/icons/copy.svg"
                    alt=""
                  />
                  {window.location.hash.substring(1)}
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="flex justify-center">
              <div className="text-secondary grid max-w-2xl place-items-center grid-items-center grid-cols-1  md:mx-24 md:grid-cols-2 text-4xl">
                <a
                  href={redirect_to_spotify}
                  className="transition-all duration-300 hover:scale-105 p-4 sm:p-8 flex gap-4 justify-center items-center"
                >
                  <img
                    src="assets/logos/spotify.png"
                    className="w-14 sm:w-16"
                    alt=""
                  />
                  <span>Spotify</span>
                </a>
                <a
                  href={redirect_to_youtube}
                  className="transition-all duration-300 hover:scale-105 p-4 sm:p-8 flex gap-4 justify-center items-center"
                >
                  <img
                    src="assets/logos/youtube.png"
                    className="w-14 sm:w-20"
                    alt=""
                  />
                  <span>YouTube</span>
                </a>
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
      </div>
    </>
  );
}

export default SharePage;
