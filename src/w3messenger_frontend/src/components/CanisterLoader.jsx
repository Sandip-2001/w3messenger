import React, { useContext, useEffect, useState } from "react";
import { MyCanisterContext } from "./OtherNecessity";
import { styled } from '@mui/material/styles';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

export const CanisterLoader = ({ children }) => {
  const canisters = useContext(MyCanisterContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let timer;
    if (canisters) {
      timer = setTimeout(() => setLoading(false), 2000);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [canisters]);

  if (loading) {
    return(
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={true}
      >
        <StyledLoading>
          <CircularProgress color="inherit" />
          <p>Loading...</p>
        </StyledLoading>
      </Backdrop>
    );
  }

  return children;
};

const StyledLoading = styled('div')(({ theme }) => ({
  display: `flex`,
  alignItems: `center`,
  justifyContent: `center`,
  flexDirection: `column`,
  '& p': {
    fontFamily: `'Open Sans', sans-serif`,
    opacity: `0.5`,
  },
}));