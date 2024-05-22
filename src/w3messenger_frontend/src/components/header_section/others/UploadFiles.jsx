import React, { useRef, useState, useContext } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import { MyCanisterContext, ContextOfFiles } from '../../OtherNecessity';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 10,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 5,
      backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
    },
}));

function LinearProgressWithLabel(props) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: '100%', mr: 1 }}>
          <BorderLinearProgress variant="determinate" {...props} />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="text.secondary">{`${Math.round(
            props.value,
          )}%`}</Typography>
        </Box>
      </Box>
    );
}
  
LinearProgressWithLabel.propTypes = {
    value: PropTypes.number.isRequired,
};

function UploadFiles(){

    const { AccActor, myAccPrincipal } = useContext(MyCanisterContext);
    const { listOfFiles, setListOfFiles } = useContext(ContextOfFiles);

    const myAccPrincipalToText =  myAccPrincipal.toText();

    const [progress, setProgress] = useState(0);
    const [currFileNo, setFileNo] = useState('');
    const [noOfFiles, setNoOfFiles] = useState('');
    const [currFileName, setCurrFileName] = useState('');
    const tempFiles = [];

    const [fileList, setFileList] = useState(null);

    const infoMsg = useRef('');
    const severityType = useRef('');

    const handleFileChange = (e) => {
        if(e.target.files.length > 6){
            severityType.current = "info";
            infoMsg.current = 'You have selected more than 6 files';
            setSnackUploaded(true);
        } else {
            for(let i = 0; i < e.target.files.length; i++){
                if(e.target.files[i].size > 30000000){
                    severityType.current = "info";
                    infoMsg.current = 'You have seleted files which is more than 30Mb';
                    setSnackUploaded(true);
                    return;
                }
            }
            setFileList(e.target.files);
        }
    };

    const files = fileList ? [...fileList] : [];

    const [isStartedUploading, setUploading] = useState(false);

    const [openUpload, setOpenUpload] = useState(false);

    const [openSnackUploaded, setSnackUploaded] = useState(false);

    const handleClickOpenUpload = () => {
        setOpenUpload(true);
    };

    const handleCloseUpload = () => {
        setFileList(null);
        setOpenUpload(false);
    };

    const startUploading = async () => {
        if(files.length === 0) {
            severityType.current = "info";
            infoMsg.current = "No files selected.";
            setSnackUploaded(true);
            return;
        }
        setNoOfFiles(files.length);
        setUploading(true);
        for(let i = 0; i < files.length; i++){
            setFileNo(i+1);
            const currFileName = files[i].name;
            setCurrFileName(prev => (currFileName.length > 30) ? currFileName.substring(0, 30)+'...' : currFileName);
            setProgress(0);
            try{
                await upload(files[i]);
            } catch(e) {
                alert('Something went wrong! Try again later...');
            }
        }
        const updatedFiles = [...tempFiles, ...listOfFiles];
        setListOfFiles(updatedFiles);
        sessionStorage.setItem('files', JSON.stringify(updatedFiles));
        tempFiles.splice(0);
        setUploading(false);
        setProgress(0);
        setFileList(null);
        severityType.current = "success";
        infoMsg.current = "All files uploaded Successfully!";
        setSnackUploaded(true);
    }

    const uploadChunk = async({batch_name, chunk}) => AccActor.create_chunk({
        batch_name,
        content : [...new Uint8Array(await chunk.arrayBuffer())]
    });

    const upload = async (file) => {
        if(!file){
            severityType.current = "warning";
            infoMsg.current = "Invalid file";
            setSnackUploaded(true);
            return;
        }

        const new_id = (Math.random() + 1).toString(36).substring(7);
        const spaceRemoved_fileName = file.name.split(" ").join("_");
        const batch_name = spaceRemoved_fileName.substring(0, spaceRemoved_fileName.lastIndexOf(".")) + new_id + spaceRemoved_fileName.substring(spaceRemoved_fileName.lastIndexOf("."));
        const chunks = [];
        const chunkSize = 1500000;

        for(let start = 0; start < file.size; start += chunkSize){
            const chunk = file.slice(start, start + chunkSize);
            chunks.push(uploadChunk({
                batch_name,
                chunk
            }));
        }

        var count = 0;
        chunks.map((item, index) => {
            item.then(function(val){
                cal_progress(++count);
                return val;
            });
        });

        function cal_progress(count){
            const prog = Math.floor((count / chunks.length)*100);
            console.log("Promise completed ==> " + prog + "%");
            setProgress(prog);
        }

        const chunkIds = await Promise.all(chunks);
        console.log(chunkIds);
        await AccActor.commit_batch({
            batch_name,
            chunk_ids: chunkIds.map(({chunk_id}) => chunk_id),
            content_type : file.type
        });

        const file_url = "http://"+myAccPrincipalToText+".localhost:8000/assets/"+batch_name;
        const file_name = file.name;
        let file_size;
        var totalBytes = file.size;
        if(totalBytes < 1000000){
            file_size = Math.floor(totalBytes/1000) + ' KB';
        }else{
            file_size = (totalBytes/1000000).toFixed(1) + ' MB';  
        }
        const file_type = file.name.split('.').pop();
        const asset_details = {
            fileUrl : file_url,
            fileId : batch_name,
            fileName : file_name,
            fileSize : file_size,
            fileType : file_type,
        };

        await AccActor.putAssetsDetails(batch_name, asset_details);

        tempFiles.unshift(asset_details);
    }

    return(
        <>
            <MenuItem onClick={handleClickOpenUpload} disableRipple>
                <UploadFileIcon />
                Upload Files
            </MenuItem>
            <Dialog open={openUpload}>
                <DialogTitle>Upload your files</DialogTitle>
                <SuccessSlider>
                    <DialogContentText>
                        * Supported files are jpeg, jpg, png, pdf, docx, pptx, txt, xlsx, mp3, mp4
                        <br/>
                        * You can select upto 6 files at once
                        <br/>
                        * The maximum size of each file should be less than 30MB
                    </DialogContentText>
                    <div className='file_input'>
                        <Button variant="contained" component="label" disabled={files.length !== 0}>
                            Choose Files
                            <input 
                                hidden 
                                multiple 
                                type="file" 
                                onChange={handleFileChange}
                                accept='.jpeg, .jpg, .png, .pdf, .docx, .pptx, .txt, .xlsx, .mp3, .mp4'
                            />
                        </Button>
                        <div className='file_names'>
                            {files.length === 0 ? 
                                <div className='name_ofTheFile'>
                                    No files choosen
                                </div>
                            :
                                files.map((file, i) => (
                                    <div key={i} className='name_ofTheFile'>
                                        {file.name},
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                    {isStartedUploading && 
                        <div className='progress_render'>
                            <span className='sp_margin file_no_name'>{currFileNo} / {noOfFiles}</span>
                            <span className='file_no_name'>{currFileName}</span>
                            <LinearProgressWithLabel value={progress} />
                        </div>
                    }
                </SuccessSlider>
                {!isStartedUploading && 
                    <DialogActions>
                        <Button onClick={handleCloseUpload}>Cancel</Button>
                        <Button onClick={startUploading}>Upload</Button>
                    </DialogActions>
                }
                <Snackbar open={openSnackUploaded} autoHideDuration={3000} onClose={() => setSnackUploaded(false)}>
                    <Alert onClose={() => setSnackUploaded(false)} severity={severityType.current} sx={{ width: '100%' }}>
                        {infoMsg.current}
                    </Alert>
                </Snackbar>
            </Dialog>
        </>
    );
}

export default React.memo(UploadFiles);

const SuccessSlider = styled(DialogContent)(({ theme }) => ({
    '& .file_input': {
        marginTop: `10px`,
        display: `flex`,
        '& .file_names': {
            border: `1px solid #e5e5e5`,
            height: `40px`,
            width: `380px`,
            padding: `0 6px`,
            marginLeft: `6px`,
            display: `flex`,
            alignItems: `center`,
            overflow: `scroll`,
            '& .name_ofTheFile': {
                fontFamily: `'Roboto', sans-serif`,
                margin: `0 6px`,
                whiteSpace: `nowrap`,
            },
            '&::-webkit-scrollbar':{
                display:`none`,
            }
        },
    },
    '& .progress_render': {
        marginTop: `10px`,
        '& .file_no_name': {
            fontFamily: `'Open Sans', sans-serif`,
        },
        '& .sp_margin': {
            marginRight: `10px`,
        },
    },
}));