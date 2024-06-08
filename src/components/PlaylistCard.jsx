import { useEffect } from "react";

function PlaylistCard(props) {


  return (
    <>
      <div className={`h-full bg-gray-900 text-gray-300 rounded-xl  flex overflow-hidden hover:cursor-pointer` }>
      
          <img src={props.image_url} className="w-12" alt="" />
          <div className=" p-3 ">
        <h1 className="text-xl text-blue-300">{props.name}</h1>
        <p className="line-clamp-1">{props.description?props.description:"No description recieved"}</p></div>
      </div>
    </>
  );
}

export default PlaylistCard;
