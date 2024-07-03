import { useEffect } from "react";

function YoutubeTokenHandler(){
    useEffect(() => {
        if (window.location.hash.includes("error")) {
            window.localStorage.setItem("youtube_access_token","error");
        }
        if (window.location.hash) {
            window.localStorage.setItem("youtube_access_token",window.location.hash.split("&")[0].substring(14));
            window.close()
        }
        else{
          window.location = "/";
        }
        window.addEventListener('storage', () => {
            console.log("Change to local storage!");
            // ...
        })

        
      }, []);

      


}

export default YoutubeTokenHandler;