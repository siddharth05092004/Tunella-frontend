import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import querystring from "querystring";
import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";

function Home(props) {
  useEffect(() => {
    if (props.value == "spotify-login-error") {
      toast.error("Couldn't login to Spotify");
    }
    if (props.value == "youtube-login-error") {
      toast.error("Couldn't login to Youtube");
    }
    if (props.value == "playlist-get-error") {
      toast.error("Can't fetch playlist data");
    }
    if (props.value == "quota-over") {
      toast.error("Youtube Data API quota over");
    }
    if (props.value == "default") {
      window.location = "/default-error"
    }
    if(props.value == "default-error"){
      toast.error("Page Not Found");
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

  const redirect_to_youtube =
    "https://accounts.google.com/o/oauth2/auth?" +
    querystring.stringify({
      client_id: process.env.REACT_APP_YOUTUBE_CLIENT_ID,
      redirect_uri: process.env.REACT_APP_YOUTUBE_REDIRECT_URI_IMPORT,
      scope: "https://www.googleapis.com/auth/youtube.readonly",
      response_type: "token",
    });

  return (
    <>
      <div className="poppins-regular bg-primary text-secondary  ">
        <Navbar />
        <Toaster position="bottom-right" />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.1}}
          viewport={{ once: true }}
          className="m-8 md:m-16"
        >
          <div className="poppins-medium flex justify-center">
            <span className="py-5 text-4xl md:text-6xl ">
              Welcome to Tunella!
            </span>
          </div>
          <div className="flex justify-center">
            <p align="justify" className="py-5 text-xl md:text-2xl max-w-3xl ">
              Tunella is a web app that helps you convert/share your favourite
              playlists across YouTube and Spotify. To get started choose the
              platform you want to import your playlists from. <a href="/test-credentials" className="text-tertiary transition-all duration-200 hover:text-gray-600 underline">Test Credentials</a>
            </p>
          </div>
          <div className="flex justify-center">
            <div className="pt-4  grid max-w-2xl place-items-center grid-items-center grid-cols-1  md:mx-24 md:grid-cols-2 text-4xl">
              <a
                href={redirect_to_spotify}
                className="p-4 transition-all duration-300 hover:scale-105 sm:p-8 flex gap-4 justify-center items-center"
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
        </motion.div>
        <Footer className=" fixed top-0 left-0 right-0"/>
      </div>
    </>
  );
}

export default Home;
