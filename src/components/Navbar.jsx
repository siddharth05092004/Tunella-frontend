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
      <div class="sm:hidden">
        <button type="button" class="hs-collapse-toggle p-2 inline-flex justify-center items-center gap-x-2 rounded-lg border  shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none bg-transparent border-neutral-700 text-white hover:bg-white/10" data-hs-collapse="#navbar-with-collapse" aria-controls="navbar-with-collapse" aria-label="Toggle navigation">
          <svg class="hs-collapse-open:hidden flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" x2="21" y1="6" y2="6"/><line x1="3" x2="21" y1="12" y2="12"/><line x1="3" x2="21" y1="18" y2="18"/></svg>
          <svg class="hs-collapse-open:block hidden flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>
    </div>
    <div id="navbar-with-collapse" class="hidden transition-all duration-[0.1ms] overflow-hidden basis-full grow sm:block">
      <div class="flex flex-col gap-5 mt-5 sm:flex-row sm:items-center sm:justify-end sm:mt-0 sm:ps-5">
        <a class="font-medium text-lg md:text-xl  text-green-400 hover:text-green-500" href='/spotify-import'>Spotify Playlists</a>
        <a class="font-medium text-lg md:text-xl  text-red-400 hover:text-red-500" href="/youtube-import">Youtube Playlists</a>
        
      </div>
    </div>
  </nav>
</header>
<script src="./node_modules/preline/dist/preline.js">
</script>
    </>
  );
}

export default Navbar;
