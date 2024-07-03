import { useEffect } from "react";

function SpotifyTokenHandler(){
    useEffect(() => {
        if (window.location.hash.includes("error")) {
            window.localStorage.setItem("spotify_access_token","error");
        }
        if (window.location.hash) {
          let spotify_access_token = window.location.hash.split("&")[0].substring(14);
          check_validity(spotify_access_token);
        }
        else{
          window.location = "/";
        }
        window.addEventListener('storage', () => {
            console.log("Change to local storage!");
            // ...
        })

        
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
        else{
            window.localStorage.setItem("spotify_access_token",spotify_access_token);
            window.close();
        }
      }


}

export default SpotifyTokenHandler;