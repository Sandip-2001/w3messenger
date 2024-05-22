import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import FeedbackOutlinedIcon from '@mui/icons-material/FeedbackOutlined';

function SubmitFeedback(){

    return(
        <>
            <MenuItem disableRipple>
                <FeedbackOutlinedIcon />
                Submit Feedback
            </MenuItem>
        </>
    );
}

export default SubmitFeedback;