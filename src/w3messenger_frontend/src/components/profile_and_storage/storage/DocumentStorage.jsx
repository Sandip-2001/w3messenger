import React, { useState, useContext } from "react";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
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

function DocumentStorage(props){
    console.log("DocumentStorage re-render");
    const { myAccPrincipal } = useContext(MyCanisterContext);
    const { listOfFiles, setListOfFiles } = useContext(ContextOfFiles);

    const imageFileTypes = ["jpeg", "jpg", "png", "svg", "gif"];

    const filteredDocs = listOfFiles.filter((item) => {
        return !imageFileTypes.includes(item.fileType);
    });
    
    const hasDocs = filteredDocs.length > 0;

    const [checked, setChecked] = useState([]);

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
        console.log(checked);
    };

    const [open, setOpen] = useState(false);

    const [openSnackCopied, setSnackCopied] = useState(false);

    const deleteFiles = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        const updatedDocFiles = listOfFiles.filter((reqItem, id) => !checked.includes(reqItem.fileId));
        setListOfFiles(updatedDocFiles);
        sessionStorage.setItem('files', JSON.stringify(updatedDocFiles))
        common_Worker.postMessage(
            {
                what_todo: "delete files",
                my_accId: myAccPrincipal, 
                array_ofFiles: checked,
            }
        );
    };

    const RenderDocItems = (
        <div className='doc-list'>
            {filteredDocs.map((item, index) => {
                return(
                    <div key={index} className="doc-item" >
                        <div className='doc-details' onClick={() => window.open(item.fileUrl, '_blank')}>
                            <h3>{item.fileName}</h3>
                            <span>{item.fileType}  -  {item.fileSize}</span>
                        </div>
                        <div style={{display: 'flex', flexDirection: 'column'}}>
                            <Checkbox
                                onChange={handleToggle(item.fileId)}
                                checked={checked.indexOf(item.fileId) !== -1}
                                style={{color: "white", opacity:'0.5',}}
                                // inputProps={{ 'aria-labelledby': labelId }}
                            />
                            <IconButton 
                                aria-label="copy" 
                                style={{color: "white", opacity:'0.5',}}
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
                    </div>
                );
            })}
        </div>
    );
    
    return(
        <div style={{color: "white"}} className="document-handling">
            <div className='received-heading special-margin'>
                <span id='heading-opacity'>Received Documents</span>
                <IconButton onClick={deleteFiles}>
                    <DeleteIcon style={{color: 'rgb(197, 75, 140)'}} />
                </IconButton>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        {"Confirm Deletation❗️"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Are you sure about deleting those files?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} autoFocus>
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
            {hasDocs ? 
                RenderDocItems
            :
                <div className='folderimg'>
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

export default React.memo(DocumentStorage);