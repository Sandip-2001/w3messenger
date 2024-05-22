import React, { useState, useContext } from "react";
import EditAbout from "./profile/EditAbout";
import EditImage from "./profile/EditImage";
import EditName from "./profile/EditName";
import EditStorage from "./storage/EditStorage";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { InAppUseStates } from '../OtherNecessity';
import { LogOut } from "./profile/LogOut";
import Collapse from '@mui/material/Collapse';

export function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}
  
TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};
  
export function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function ProfileAndStorage(props){
    console.log("ProfileAndStorage re-render");
    const { boolStateInApp, setBoolStateInApp } = useContext(InAppUseStates);

    const [value, setValue] = useState(0);

    const [isNameFocused, setIsNamedFocused] = useState(false);
    const [isAboutFocused, setIsAboutFocused] = useState(false);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleCloseMyProfileStorage = () => {
        setBoolStateInApp(prev => ({...prev, open: false, isGrowing: false,}))
        setIsNamedFocused(false);
        setIsAboutFocused(false);
        setValue(0);
    }

    return(
        <div className="my-profile" >
            <div className='profile-header'>
                <IconButton className='close-myProfile' onClick={handleCloseMyProfileStorage}>
                    <CloseIcon />
                </IconButton>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" centered>
                    <Tab label="Profile" {...a11yProps(0)} style={{color:"white"}}/>
                    <Tab label="Storage" {...a11yProps(1)} style={{color:"white"}}/>
                </Tabs>
            </div>
            <TabPanel value={value} index={0}>
                <EditImage />
                <EditName
                    isNameFocused={isNameFocused}
                    setIsNamedFocused={setIsNamedFocused}
                />
                <EditAbout 
                    isAboutFocused={isAboutFocused}
                    setIsAboutFocused={setIsAboutFocused}
                />
                <Collapse in={boolStateInApp.isGrowing} {...( { timeout: 1400 })}>
                    <LogOut />
                </Collapse>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <EditStorage fileRef={props.fileRef} />
            </TabPanel>
        </div>
    );
}

export default React.memo(ProfileAndStorage);