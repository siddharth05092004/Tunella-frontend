import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function Navbar() {
  useEffect(() => {}, []);

  async function toggle_navbar() {
    const dropdown_navbar = document.getElementById("dropdown_navbar");
    if (dropdown_navbar.classList.contains("hidden")) {
      dropdown_navbar.classList.remove("hidden");
    } else {
      dropdown_navbar.classList.add("hidden");
    }
  }

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        class=" flex flex-wrap sm:justify-start sm:flex-nowrap w-full text-sm py-4 bg-tertiary"
      >
        <nav
          class="max-w-[85rem] w-full mx-auto px-4 flex justify-between sm:flex sm:items-center sm:justify-between"
          aria-label="Global"
        >
          <div class="flex items-center justify-between">
            <div className="flex justify-center gap-4">
              <img
                src="/assets/logos/logo.png"
                alt=""
                className="w-8 md:w-10"
              />
              <a
                class="flex-none poppins-regular text-2xl  md:text-4xl font-semibold text-white"
                href="/"
              >
                Tunella
              </a>
            </div>
          </div>
          <div
            id="navbar-with-collapse"
            class="poppins-regular hidden transition-all duration-[0.1ms] overflow-hidden basis-full grow sm:block"
          >
            <div class="flex flex-col gap-5 mt-5 sm:flex-row sm:items-center sm:justify-end sm:mt-0 sm:ps-5">
              <a
                class="font-medium text-lg md:text-xl  text-green-400 hover:text-green-500"
                href="/spotify-import"
              >
                Spotify Playlists
              </a>
              <a
                class="font-medium text-lg md:text-xl  text-red-400 hover:text-red-500"
                href="/youtube-import"
              >
                Youtube Playlists
              </a>
            </div>
          </div>
          <div className="visible sm:hidden">
            <div
              onClick={toggle_navbar}
              className="border-2 rounded-md p-1 hover:cursor-pointer bg-gray-900 transition-all duration-100 hover:bg-gray-800"
            >
              <img
                src="/assets/icons/hamburger.svg"
                className="invert w-6"
                alt=""
              />
            </div>
            
          </div>
        </nav>
          <div id="dropdown_navbar" className="hidden sm:hidden flex">
              <div>
                <ul className="px-6 pt-3">
                  <li>
                    <a
                      class="font-medium text-lg md:text-xl  text-green-400 hover:text-green-500"
                      href="/spotify-import"
                    >
                      Spotify Playlists
                    </a>
                  </li>
                  <li className="pt-2">
                    <a
                      class="font-medium text-lg md:text-xl  text-red-400 hover:text-red-500"
                      href="/youtube-import"
                    >
                      Youtube Playlists
                    </a>
                  </li>
                </ul>
              </div>
            </div>
      </motion.header>
    </>
  );
}

export default Navbar;
