import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import querystring from "querystring";
import { useEffect } from "react";
import toast, { Toaster } from 'react-hot-toast';

function Home(props) {
  useEffect(() => {
    if (props.value == "spotify-login-error") {
      toast.error("Couldn't login to Spotify")
    }
    if (props.value == "youtube-login-error") {
      toast.error("Couldn't login to Youtube")
    }
    if (props.value == "playlist-get-error") {
      toast.error("Can't fetch playlist data")
    }
    
  }, []);

  const redirect_to_spotify =
    "https://accounts.spotify.com/authorize?" +
    querystring.stringify({
      response_type: "token",
      client_id: process.env.REACT_APP_SPOTIFY_CLIENT_ID,
      scope: "playlist-read-private playlist-read-collaborative",
      redirect_uri: process.env.REACT_APP_SPOTIFY_REDIRECT_URI_IMPORT,
    });

    const redirect_to_youtube = 'https://accounts.google.com/o/oauth2/auth?' + querystring.stringify({
      client_id: process.env.REACT_APP_YOUTUBE_CLIENT_ID,
      redirect_uri: process.env.REACT_APP_YOUTUBE_REDIRECT_URI_IMPORT,
      scope: 'https://www.googleapis.com/auth/youtube.readonly',
      response_type: 'token'
    });

  return (
    <>
      <div className="bg-indigo-900 text-gray-200 h-screen">
        <Navbar />
        <Toaster position="bottom-right"/>
        <div className="m-8 md:m-16">
          <div className="flex justify-center">
          <span className="py-5 text-5xl md:text-6xl ">
            Welcome to Tunella!
          </span></div>
          <div className="flex justify-center">
            <p align="justify" className="py-5 text-xl max-w-3xl font-mono">
              Tunella is a web app that helps you convert/share your favourite
              playlists across YouTube and Spotify. To get started choose the
              platform you want to import your playlists from.
            </p>
          </div>
          <div className="pt-8 flex justify-center text-4xl">
            <a href={redirect_to_spotify} className="px-8 sm:px-16">
              <img src="assets/logos/spotify.png" className="w-14 sm:w-20" alt="" />
            </a>
            <a href={redirect_to_youtube} className="px-8 sm:px-16">
              <img src="assets/logos/youtube.png" className="w-14 sm:w-24" alt="" />
            </a>
          </div>
          <Footer/>
        </div>
      </div>
    </>
  );
}

export default Home;
