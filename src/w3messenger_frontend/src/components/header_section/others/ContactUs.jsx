import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import ContactSupportOutlinedIcon from '@mui/icons-material/ContactSupportOutlined';

function ContactUs(){

    return(
        <>
            <MenuItem disableRipple>
                <ContactSupportOutlinedIcon />
                Contact Us
            </MenuItem>
        </>
    );
}

export default ContactUs;