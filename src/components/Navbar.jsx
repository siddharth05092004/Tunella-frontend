import {useEffect, useState } from "react";

function Navbar() {

  useEffect(()=>{
    
  },[])

  
  return (
    <>
      
      

      <header class="flex flex-wrap sm:justify-start sm:flex-nowrap w-full text-sm py-4 bg-neutral-800">
  <nav class="max-w-[85rem] w-full mx-auto px-4 sm:flex sm:items-center sm:justify-between" aria-label="Global">
    <div class="flex items-center justify-between">
      <div className="flex justify-center gap-4">
      <img src="/assets/logos/logo.png" alt="" className="w-8 md:w-10" />
      <a class="flex-none text-3xl md:text-4xl font-semibold text-white" href="/">Tunella</a></div>
      
    </div>
    <div id="navbar-with-collapse" class="hidden transition-all duration-[0.1ms] overflow-hidden basis-full grow sm:block">
      <div class="flex flex-col gap-5 mt-5 sm:flex-row sm:items-center sm:justify-end sm:mt-0 sm:ps-5">
        <a class="font-medium text-lg md:text-xl  text-green-400 hover:text-green-500" href='/spotify-import'>Spotify Playlists</a>
        <a class="font-medium text-lg md:text-xl  text-red-400 hover:text-red-500" href="/youtube-import">Youtube Playlists</a>
        
      </div>
    </div>
  </nav>
</header>
    </>
  );
}

export default Navbar;
