import React, { useState, useContext } from "react";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Checkbox from '@mui/material/Checkbox';
import folder from '../../../../assets/folder.png';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { MyCanisterContext, common_Worker, ContextOfFiles } from '../../OtherNecessity';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import ShareIcon from '@mui/icons-material/Share';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function ImageStorage(props){
    console.log("ImageStorage re-render");
    const { myAccPrincipal } = useContext(MyCanisterContext);
    const { listOfFiles, setListOfFiles } = useContext(ContextOfFiles);

    const imageFileTypes = ["jpeg", "jpg", "png", "svg", "gif"];

    const filteredImages = listOfFiles.filter((item) => {
        return imageFileTypes.includes(item.fileType);
    });

    const hasImages = filteredImages.length > 0;

    const [checked, setChecked] = useState([]);

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];
        if (currentIndex === -1) {
            newChecked.push(value);
        }else{
            newChecked.splice(currentIndex, 1);
        }
        setChecked(newChecked);
    };

    const [open, setOpen] = useState(false);

    const [openSnackCopied, setSnackCopied] = useState(false);

    const deleteImgs = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        const updatedImageFiles = listOfFiles.filter((reqItem, id) => !checked.includes(reqItem.fileId));
        setListOfFiles(updatedImageFiles);
        sessionStorage.setItem('files', JSON.stringify(updatedImageFiles))
        common_Worker.postMessage(
            {
                what_todo: "delete files",
                my_accId: myAccPrincipal,
                array_ofFiles: checked,
            }
        );
    };

    const RenderImageItems = (
        <ImageList sx={{ width: 300, height: 500 }} cols={2} rowHeight={164}>
            {filteredImages.map((item, index) => {
                return(
                    <ImageListItem key={index} className='image-item'>
                        <img
                            src={item.fileUrl}
                            // src={`${item.fileUrl}?w=164&h=164&fit=crop&auto=format`}
                            // srcSet={`${item.fileUrl}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                            alt={item.fileName}
                            loading="lazy"
                        />
                        <div className='image-check'>
                            <Checkbox 
                                style={{color: 'rgba(255,255,255,0.7)'}}
                                onChange={handleToggle(item.fileId)}
                                checked={checked.indexOf(item.fileId) !== -1}
                            />
                            <IconButton 
                                aria-label="copy" 
                                color='inherit'
                                onClick={async () =>{
                                    console.log("The file id of this file is ==> "+item.fileId);
                                    // await navigator.clipboard.writeText(JSON.stringify(item));
                                    props.fileRef.current = JSON.stringify(item);
                                    setSnackCopied(true);
                                }}
                            >
                                <ShareIcon />
                            </IconButton>
                        </div>
                    </ImageListItem>
                );
            })}
        </ImageList>
    );

    return(
        <div style={{color: "white"}}>
            <div className='received-heading'>
                <span id='heading-opacity'>Received Images</span>
                <IconButton onClick={deleteImgs}>
                    <DeleteIcon style={{color: 'rgb(197, 75, 140)'}}/>
                </IconButton>
                <Dialog
                    open={open}
                    onClose={()=>setOpen(false)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        {"Confirm Deletation❗️"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Are you sure about deleting those images?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} autoFocus>
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
            {hasImages ? 
                RenderImageItems
            :
                <div className='folderimg exm'>
                    <img src={folder} alt='folder' width='150' height='150' />
                </div>
            }
            <Snackbar open={openSnackCopied} autoHideDuration={1000} onClose={() => setSnackCopied(false)}>
                <Alert onClose={() => setSnackCopied(false)} severity={"success"} sx={{ width: '100%' }}>
                    Ready to share
                </Alert>
            </Snackbar>
        </div>
    );
}

export default React.memo(ImageStorage);