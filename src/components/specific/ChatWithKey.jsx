import React from 'react';
import { useParams } from 'react-router-dom';
import Chat from '../../Pages/Chat';
const  ChatWithKey = () => {
    const {chatId} = useParams();
return(
        <Chat key={chatId}/>
);
}
export default ChatWithKey;