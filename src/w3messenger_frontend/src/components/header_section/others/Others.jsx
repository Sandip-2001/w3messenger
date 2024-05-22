import React, { useState } from 'react';
import AddBackProfile from './AddBackProfile';
import UploadFiles from './UploadFiles';
import Button from '@mui/material/Button';
import { styled, alpha } from '@mui/material/styles';
import Menu from '@mui/material/Menu';
import Divider from '@mui/material/Divider';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ContactUs from './ContactUs';
import PrivacyAndSupport from './PrivacyAndSupport';
import SubmitFeedback from './SubmitFeedback';

function Others() {

  const [anchorEl, setAnchorEl] = useState(null);
  const openOthers = Boolean(anchorEl);
  const handleClickOthers = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseOthers = () => {
    setAnchorEl(null);
  };

  return(
    <div className="search-wrapper">
      <Button
        id="demo-customized-button"
        aria-controls={openOthers ? 'demo-customized-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={openOthers ? 'true' : undefined}
        variant="outlined"
        size="medium" 
        style={{borderRadius: '20px'}}
        disableElevation
        onClick={handleClickOthers}
        endIcon={<KeyboardArrowDownIcon />}
      >
        Others
      </Button>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
            'aria-labelledby': 'demo-customized-button',
        }}
        anchorEl={anchorEl}
        open={openOthers}
        onClose={handleCloseOthers}
      >
        <AddBackProfile />
        <Divider sx={{ my: 0.5 }} />
        <UploadFiles />
        <Divider sx={{ my: 0.5 }} />
        <ContactUs />
        <Divider sx={{ my: 0.5 }} />
        <PrivacyAndSupport />
        <Divider sx={{ my: 0.5 }} />
        <SubmitFeedback />
      </StyledMenu>
    </div>
  );
}

export default React.memo(Others);

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color: theme.palette.mode === 'light' ? '#002E63' : theme.palette.grey[300],
    boxShadow: 'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      backgroundColor: '#7e57c2',
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}));