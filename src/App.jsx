import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";


import SpotifyImport from './pages/SpotifyImport.jsx';
import SpotifyTokenHandler from "./pages/SpotifyTokenHandler.jsx";
import YoutubeTokenHandler from "./pages/YoutubeTokenHandler.jsx";
import YoutubeImport from './pages/YoutubeImport.jsx';
import SharePage from "./pages/SharePage.jsx";
import Home from './pages/Home.jsx';
import TestCredentials from './pages/TestCredentials.jsx';

function App() {

  return (
    <>
       <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home value="plain"/>}/>
        <Route path="/spotify-login-error" element={<Home value="spotify-login-error"/>}/>
        <Route path="/youtube-login-error" element={<Home value="youtube-login-error"/>}/>
        <Route path="/playlist-get-error" element={<Home value="playlist-get-error"/>}/>
        <Route path="/quota-over" element={<Home value="quota-over"/>}/>
        
        <Route path="/spotify-import" element={<SpotifyImport/>} />
        <Route path="/spotify-export" element={<SpotifyTokenHandler/>} />
        <Route path="/youtube-import" element={<YoutubeImport/>} />
        <Route path="/youtube-export" element={<YoutubeTokenHandler/>} />
        <Route path="/share" element={<SharePage/>} />

        <Route path="/test-credentials" element={<TestCredentials/>} />

        <Route path="/default-error" element={<Home value="default-error"/>}/>

        <Route path="*" element={<Home value = "default"/>} />

        
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
