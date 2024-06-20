import React from 'react';
import moment from "moment";
import { useSelector } from 'react-redux';
import { fileFormat } from '../../utils/utility';
import RenderAttachment from './RenderAttachment';
const  MessageComponent = ( { message }) => {
   const user = useSelector(state=>state.auth.user)
   const {groupChat} = useSelector(state=>state.chat)
   // console.log(message)
   const {content, attachments=[] ,createdAt,sender } = message;
   const timeAgo = moment(createdAt).fromNow();
   const sameUser = {
      alignSelf:"flex-end",
      backgroundColor:"#EDEADE"
   } 
   const diffUser = {
      alignSelf:"flex-start",
      backgroundColor:"#353935",
      color:"white"
   }
return(
         <>
         {/* {index} */}
         <div className='  inline-block max-w-full   p-[1em]  text-left rounded-2xl text-black ' style={sender._id===user._id?sameUser:diffUser}>
            {sender._id!==user._id && groupChat && <h1 className='text-[0.8rem] text-gray-400'>~{sender.name}</h1>}
            {content && content}
            {
               attachments.length>0 && attachments.map((attachment , index)=>{
                  const url = attachment.url;
                  const file = fileFormat(url);
                  return (
                     <div key={index}>
                        <a href={url}
                        //_blank tells the browser that link should open in the new tab
                        target="_blank"
                        download
                        style={{color:"black"}}
                        >
                           {RenderAttachment(file,url)}
                        </a>
                     </div>
                  )
               })
            }
            <p className='mt-[1em]   text-xs' 
            style={{color:`${sender._id===user._id?"black":"white"}` , opacity:"0.5"}}>{timeAgo}</p>
            </div>               
         </>
);
}
export default MessageComponent;