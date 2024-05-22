import React, { useContext } from 'react';
import { HeaderStyle } from "../../assets/styles";
import Avatar from '@mui/material/Avatar';
import logo from "../../assets/logo1.png";
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Notification from './header_section/notifications/Notification';
import Others from './header_section/others/Others';
import { MyProfileContext, InAppUseStates } from './OtherNecessity';

function Header () {

    const { myProfileDetails } = useContext(MyProfileContext);
    const { setBoolStateInApp } = useContext(InAppUseStates);
    
    return(
        <HeaderStyle>
            <div className="header">
                <img className="logo" alt="logo" src={logo}/>
                <IconButton 
                    color="inherit"
                    sx={{ mr: 2, display: { md: 'none' }}}
                    onClick={()=>
                        setBoolStateInApp(prev => ({...prev, isOpenPersonList: true}))
                    }
                >
                    <MenuIcon fontSize="large" />
                </IconButton>
                <div className="search-profile">
                    <Others />
                    <Notification />
                    <IconButton 
                        onClick={() => 
                            setBoolStateInApp(prev => ({...prev, 
                                isGrowing: true,
                                open: true
                            }))
                        }
                    >
                        <Avatar 
                            className="my-profileImg" 
                            alt="Profile-img" 
                            src={myProfileDetails.imgUrl} 
                        />
                    </IconButton>
                </div>
            </div>
        </HeaderStyle>
    );
}

export default Header;