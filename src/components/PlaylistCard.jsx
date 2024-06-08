import { useEffect } from "react";
import { motion } from "framer-motion"

function PlaylistCard(props) {


  return (
    <>
      <motion.div
          initial={{ opacity: 0, scale:0.80,y:50}}
          whileInView={{ opacity: 1, scale:1,y:0 }}
          transition={{ duration: 0.1 }}
          viewport={{ once: true }} className={`  h-full bg-gray-900 text-gray-300 rounded-xl  flex overflow-hidden hover:cursor-pointer` }>
      
          <img src={props.image_url} className="w-12" alt="" />
          <div className=" p-3 ">
        <h1 className="text-xl text-blue-300">{props.name}</h1>
        <p className="line-clamp-1">{props.description?props.description:"No description recieved"}</p></div>
      </motion.div>
    </>
  );
}

export default PlaylistCard;
