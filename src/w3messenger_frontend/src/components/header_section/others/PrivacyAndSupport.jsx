import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import PrivacyTipOutlinedIcon from '@mui/icons-material/PrivacyTipOutlined';

function PrivacyAndSupport(){

    return(
        <>
            <MenuItem disableRipple>
                <PrivacyTipOutlinedIcon />
                Privacy and Support
            </MenuItem>
        </>
    );
}

export default PrivacyAndSupport;