import React from 'react';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import IconButton from '@mui/material/IconButton';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
// import axios from 'axios';
// import fileDownload from 'js-file-download';
// import { saveAs } from 'file-saver';
import docIcon from "../../../assets/doc.png";
// import gifIcon from "../../../assets/gif.png";
// import jpegIcon from "../../../assets/jpeg.png";
// import jpgIcon from "../../../assets/jpg.png";
// import m4aIcon from "../../../assets/m4a.png";
// import mp3Icon from "../../../assets/mp3.png";
// import mp4Icon from "../../../assets/mp4.png";
// import pdfIcon from "../../../assets/pdf.png";
// import pngIcon from "../../../assets/png.png";
// import pptIcon from "../../../assets/ppt.png";
// import pptxIcon from "../../../assets/pptx.png";
// import svgIcon from "../../../assets/svg.png";
// import txtIcon from "../../../assets/txt.png";
// import xlsIcon from "../../../assets/xls.png";
// import docxIcon from "../../../assets/docx.png";
// import xlsxIcon from "../../../assets/xlsx.png";
// import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ShareIcon from '@mui/icons-material/Share';
import PreviewIcon from '@mui/icons-material/Preview';
import Slide from '@mui/material/Slide';
// import Grow from '@mui/material/Grow';
import Linkify from 'react-linkify';

function CircularProgressWithLabel(props) {
    return (
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <CircularProgress variant="determinate" {...props} />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="caption" component="div" color="white">
            {`${Math.round(props.value)}%`}
          </Typography>
        </Box>
      </Box>
    );
}

CircularProgressWithLabel.propTypes = {
    value: PropTypes.number.isRequired,
};

const download_file = (fileURL) => {
    console.log("Downloading...");
    console.log(fileURL);
    // axios.get(fileURL, {
    //   responseType: 'blob',  
    // }).then((res) => {
    //     fileDownload(res.data, batch_name)
    // });
    // saveAs(fileURL, batch_name);
    // fetch(fileURL)
    //   .then((response) => response.blob())
    //   .then((blob) => {
    //     const url = URL.createObjectURL(blob);
    //     const link = document.createElement('a');
    //     link.href = url;
    //     link.download = 'file.pdf';
    //     document.body.appendChild(link);
    //     link.click();
    //     document.body.removeChild(link);
    // });
    console.log("Download complete.")
}

const renderTextWithLinks = (text) => {
    if(text === undefined){
      return;
    }
    const regex = /((?:https?:\/\/|www\.)[^\s]+)/g;
    const matches = text.match(regex);
  
    if (matches) {
      return (
        <Linkify>
          {text.split(regex).map((part, index) => {
            if (matches.includes(part)) {
              return (
                <a 
                    href={part} 
                    key={index} 
                    target="_blank" 
                    rel="noreferrer" 
                    style={{color: '#4fc3f7', textDecoration: 'none'}}
                >
                  {part}
                </a>
              );
            }
            return part;
          })}
        </Linkify>
      );
    }
  
    return <>{text}</>;
};

function RenderChat (props) {

    console.log("RenderChat re-render");
    const chat = props.chat;
    let floatLR;
    let dr;
    let cl;
    let fileCl;
    let memeCl;
    let insideFileCl;
    let showdownload = false;
    let for_loading = props.indToText + 1;

    const handleToggle = (value) => () => {
        const currentIndex = props.checked.indexOf(value);
        const newChecked = [...props.checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        props.setChecked(newChecked);
        console.log(props.checked);
    };

    if(chat.isSender){
        floatLR = "float_right";
        cl = "send-message message";
        dr = 'left';
        fileCl = "send-file file";
        memeCl = "send-meme meme_img";
        insideFileCl = "file-icon-div";
    }else{
        floatLR = "float_left";
        cl = "received-message message";
        dr = 'right';
        fileCl = "rec-file file";
        memeCl = "rec-meme meme_img";
        insideFileCl = "file-icon-div rec-file-icon-div"
        showdownload = true;
    }

    let outerCl = "clear_both " + floatLR;

    switch(chat.typeOfMsg){
        case "Text" :
            return(
                <div 
                    className={outerCl}
                    style={{opacity: (props.sendingState.loading[for_loading]) && '0.6'}}    
                >
                    {props.openCheckBox &&
                        <Slide direction={dr} in={props.openCheckBox} container={props.messageEl.current}>
                            <span className={floatLR}>
                                <Checkbox
                                    onChange={handleToggle(props.indToText)}
                                    checked={props.checked.indexOf(props.indToText) !== -1}
                                    style={{color: "white", opacity:'0.5',}}
                                />
                            </span>
                        </Slide>
                    }
                    {/* <Grow timeout= {400 } in={true}> */}
                        <div className={cl}>
                            <p>{renderTextWithLinks(chat.msg)}
                                <br />
                                <span>{chat.time_date.msgTime}</span>
                            </p>
                        </div>
                    {/* </Grow> */}
                </div>
            );
        case "Text_File" :
            return(
                <div 
                    className={outerCl}
                    style={{opacity: (props.sendingState.loading[for_loading]) && '0.6'}}     
                >
                    {props.openCheckBox &&
                        <Slide direction={dr} in={props.openCheckBox} container={props.messageEl.current}>
                            <span className={floatLR}>
                                <Checkbox
                                    onChange={handleToggle(props.indToText)}
                                    checked={props.checked.indexOf(props.indToText) !== -1}
                                    style={{color: "white", opacity:'0.5',}}
                                />
                            </span>
                        </Slide>
                    }
                    <div className={fileCl}>
                        <div className={insideFileCl}>
                            <div className='inside-file-icon-div'>
                                <div className='filePreview' onClick={() => window.open(chat.file[0].fileUrl, '_blank')}>
                                    <img src={docIcon} alt="file-type-icon" className='file-icon'/>
                                    <PreviewIcon className='preview_icon'/>
                                </div>
                                <div className='file-details'>
                                    <h4>{(chat.file[0].fileName.length > 30) ? chat.file[0].fileName.substring(0, 30)+'...' : chat.file[0].fileName}</h4>
                                    <p>{chat.file[0].fileSize}  -  {chat.file[0].fileType}</p>
                                </div>
                            </div>
                            {showdownload ?
                                <div style={{display: 'flex', flexDirection: 'column'}}>
                                    <IconButton className='download-icon' 
                                        onClick={() => download_file(chat.file[0].fileUrl)}
                                    >
                                        <FileDownloadOutlinedIcon fontSize="large"/>
                                    </IconButton>
                                    <IconButton 
                                        aria-label="copy" 
                                        style={{color: "white", opacity:'0.5',}}
                                        onClick={async () =>{
                                            // await navigator.clipboard.writeText('qweq');
                                            props.fileRef.current = JSON.stringify(chat.file[0]);
                                            props.severityType.current = 'success';
                                            props.returnMsgTxt.current = 'Ready to share';
                                            props.setOpensnack(true);
                                        }}
                                    >
                                        <ShareIcon />
                                    </IconButton>
                                </div>
                            :""}
                        </div>
                        <p className='msgWithFile'>{renderTextWithLinks(chat.msg)}</p>
                        <div className='message-time'>
                            <span>{chat.time_date.msgTime}</span>
                        </div>
                    </div>
                </div>
            );
        case "Meme" :
            return(
                <div 
                    className={outerCl}
                    style={{opacity: (props.sendingState.loading[for_loading]) && '0.6'}}     
                >
                    {props.openCheckBox &&
                        <Slide direction={dr} in={props.openCheckBox} container={props.messageEl.current}>
                            <span className={floatLR}>
                                <Checkbox
                                    onChange={handleToggle(props.indToText)}
                                    checked={props.checked.indexOf(props.indToText) !== -1}
                                    style={{color: "white", opacity:'0.5',}}
                                />
                            </span>
                        </Slide>
                    }
                    <div className={memeCl}>
                        <img alt='meme' src={chat.memeUrl} />
                        <div className='meme-time'>
                            <span>{chat.time_date.msgTime}</span>
                        </div>
                    </div>
                </div>
            );
        case "Added" :
            return(
                <div className='clear_both'>
                    <div className='delNotf'>
                        <p style={{color: '#1976d2'}}>⚠️ {props.chatUser} has added you in chat list</p>
                    </div>
                </div>
            );
        case "Deleted" :
            return(
                <div className='clear_both'>
                    <div className='delNotf'>
                        <p>⚠️ {props.chatUser} has deleted you from chat list, {props.chatUser} won't be able to receive any messages from you</p>
                    </div>
                </div>
            );
    }

}

export default React.memo(RenderChat);