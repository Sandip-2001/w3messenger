import React, { useContext } from 'react';
import ChatHeader from './ChatHeader';
// import ChatFooter from './ChatFooter';
import ListOfConnects from "./ListOfConnects";
import List from '@mui/material/List';
import { MyConnectionsContext } from '../OtherNecessity';

function ConnectionListSection() {

    const { listOfConnects } = useContext(MyConnectionsContext);

    const handleMouseEnter = async () => {
        
    }; 

    return(
        <div className='chat-profiles'>
            <ChatHeader />
            <List className='chat-section' onMouseEnter={handleMouseEnter}>
                {listOfConnects.map((connect, index) =>{
                    return(
                        <ListOfConnects 
                            key={index}
                            connect={connect}
                            ind={index}
                        />
                    );
                })}
            </List>
            {/* <ChatFooter /> */}
        </div>
    );
}

export default ConnectionListSection;