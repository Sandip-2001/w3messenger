import React, { useState } from "react";
import DocumentStorage from "./DocumentStorage";
import ImageStorage from "./ImageStorage";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { TabPanel } from "../ProfileAndStorage"
import { a11yProps } from "../ProfileAndStorage"


function EditStorage(props){
    console.log("EditStorage re-render");

    const [valueFor, setValueFor] = useState(0);

    const handleChangeFor = (event, newValue) => {
        setValueFor(newValue);
    };

    return(
        <div className='outer-prog'>
            {/* <div className="skill">
                <div className="outer">
                    <div className="inner">
                        <div id="number">65%</div>
                    </div>
                </div>
                <svg id='circle-svg' xmlns="http://www.w3.org/2000/svg" version="1.1" width="160px" height="160px">
                    <defs>
                        <linearGradient id="GradientColor">
                            <stop offset="0%" stopColor="#DA22FF" />
                            <stop offset="100%" stopColor="#9733EE" />
                        </linearGradient>
                    </defs>
                    <circle cx="80" cy="80" r="70" strokeLinecap="round" />
                </svg>
            </div> */}
            <div className='image-doc'>
                <Tabs value={valueFor} onChange={handleChangeFor} TabIndicatorProps={{style: {background: "none"}}} aria-label="basic tabs example" centered>
                    <Tab label="Images" {...a11yProps(0)} style={{color:"white"}} className={valueFor === 0 ? "tab-back" : ""} />
                    <Tab label="Documents" {...a11yProps(1)} style={{color:"white"}} className={valueFor === 1 ? "tab-back" : ""} />
                </Tabs>
            </div>
            <TabPanel value={valueFor} index={0}>
                <ImageStorage fileRef={props.fileRef} />
            </TabPanel>
            <TabPanel value={valueFor} index={1}>
                <DocumentStorage fileRef={props.fileRef} />
            </TabPanel>
        </div>
    );
}

export default React.memo(EditStorage);