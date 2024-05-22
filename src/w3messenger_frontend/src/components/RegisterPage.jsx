import React, { useState, useRef } from 'react';
import { useForm } from "react-hook-form";
import { RegisterWrapper } from "../../assets/styles";
import logo from "../../assets/logo.png";
import defPic from "../../assets/defImg.png";
import img from '../../assets/midImg.png';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import InfoIcon from '@mui/icons-material/Info';
import PersonIcon from '@mui/icons-material/Person';
import CircularProgress from '@mui/material/CircularProgress';
import { AuthClient } from "@dfinity/auth-client";
import { canisterId, createActor } from "../../../declarations/w3messenger_backend";
import { HttpAgent } from "@dfinity/agent";
import { imageCompressor } from "./ImageCompression";
import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";

export const RegisterPage = () => {
  
  const navigate = useNavigate();

  const [imgFile, setImgFile] = useState(defPic);
  const { register, handleSubmit } = useForm();
  const [isLoading, setLoading] = useState(false);
  const [isHidden, setIsHidden] = useState(true);
  const [remainingNameLen, setNameLen] = useState(8);
  const inputNameText = useRef();
  const [remainingAboutLen, setLen] = useState(120);
  const inputAboutText = useRef();

  async function onSubmit(data){
    setLoading(true);
    try {
      const authClient = await AuthClient.create();
      const identity = await authClient.getIdentity();
      const agent = new HttpAgent({ identity,
        host: "http://localhost:8000"
      });
      await agent.fetchRootKey();
      const authenticatedCanister = createActor(canisterId, {
        agentOptions: {
          identity,
        },
      });

      const response = await fetch(imgFile);
      const previmgBlob = await response.blob();
      const imgBlob = await imageCompressor(previmgBlob);
      const imageArray = await imgBlob.arrayBuffer();
      const imageByteData = [...new Uint8Array(imageArray)];

      const name = data.userName;
      const about = data.about;
      const isExist = await authenticatedCanister.userNameExists(name);
      if(isExist === true){
        setIsHidden(false);
      }else{
        const successMsg = await authenticatedCanister.createAccount(name, about, imageByteData);
        if(successMsg === "Success"){
          await authenticatedCanister.setOnlineStatusTrue();
          localStorage.setItem("isLoggedIn", true);
          navigate("/fetchData");
        }
      }
    } catch(e) {
      alert('Something went wrong! Try again later...');
    }
    setLoading(false);
  }

  return (
    <RegisterWrapper>
      <div className="register-main">
        <div className="register-inner" style={{ backgroundImage: `url(${img})` }}>
          <div className="logo-img">
            <img src={logo} alt="logo" />
          </div>
          <div className="register-content-heading">
            <h1>Register User</h1>
          </div>
          <div className='profile-photo'>
            <img src={imgFile} width={120} height={120}/>
          </div>
          <div className='profile-photo-heading'>
            <p>Profile Photo</p>
            <IconButton color="primary" aria-label="upload picture" component="label">
              <input hidden accept="image/*" type="file" 
                onChange={(event) =>
                  setImgFile(URL.createObjectURL(event.target.files[0]))
                }
              />
              <PhotoCamera />
            </IconButton>
          </div>
          <div className='register-input'>
            <div className='register-username'>
              <h3>Name</h3>
              <TextField 
               {...register("userName", { required: true })}
                className='register-input-username' 
                id="standard-basic" 
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon />
                    </InputAdornment>
                  ),
                }} 
                placeholder="Enter username"
                variant="standard" 
                inputRef={inputNameText}
                inputProps={{ maxLength: 8, autoComplete:"off" }}
                onChange={(event)=>{
                  setNameLen(8-inputNameText.current.value.length)
                  setIsHidden(true);
                }}
              />
              <p>{!isHidden && "Username already exists"}</p>
              <span>{remainingNameLen}</span>
            </div>
            <div className='register-username'>
              <h3>About</h3>
              <TextField 
                {...register("about", { required: true })}
                className='register-input-username' 
                id="standard-basic" 
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <InfoIcon />
                    </InputAdornment>
                  ),
                }} 
                placeholder="About yourself"
                variant="standard" 
                inputRef={inputAboutText}
                inputProps={{ maxLength: 120, autoComplete:"off" }}
                onChange={()=>setLen(120-inputAboutText.current.value.length)}
              />
              <span>{remainingAboutLen}</span>
            </div>
          </div>
          {
            isLoading?
              <CircularProgress />
            :
              <Button 
                className='button' 
                variant="contained" 
                size="large"
                onClick={handleSubmit(onSubmit)}
              >
                Submit
              </Button>
          }
        </div>
      </div>
    </RegisterWrapper>
  );
}