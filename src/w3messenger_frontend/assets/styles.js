import styled from "styled-components";

export const SigninWrapper = styled.section`
    background-color: rgb(147, 112, 219);
    .signin-main{
        height: 100vh;
        width: 100vw;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        .signin-inner{
            background-color: rgb(255, 255, 255, 0.85);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: 60vw;
            height: auto; 
            margin-top: 4%;
            padding: 3% 2%;
            border-radius: 4px;
            box-shadow: 0px 10px 18px rgba(0, 0, 0, 0.2);
            .logo-img{
                display: inline-block;
                text-align: center;
                img{
                    width: 70%;
                }
            }
            .signin-content-inner{
                text-align: center;
                display: inline-block;
                margin-top: 2%;
                h4{
                    font-family: 'Roboto', sans-serif;
                    font-weight: 400;
                    letter-spacing: 2px;
                    font-size: 1.1em;
                }
                h3{
                    font-family: 'Montserrat', sans-serif;
                    font-size: 1.3em;
                }
                button{
                    font-family: 'Open Sans', sans-serif;
                    background-color: rgb(147, 112, 219);
                    color: rgb(255, 255, 255);
                    width: 30%;
                    margin-top: 4%;
                    box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.3);
                    transition: all 0.3s ease 0s;
                }
                button:hover {
                    background-color: rgb(147, 112, 219, 0.8);
                    color: rgb(0, 0, 0, 0.8);
                    transform: translateY(-7px);
                }
            }
        }
    }

    @media screen and (max-width: 500px) {
        button{
            font-size: 8px;
        }
    }
`;

export const RegisterWrapper = styled.section`
    background-color: #EEEEFF;
    ${'' /* background-color: rgb(147, 112, 219); */}
    .register-main{
        height: 100vh;
        width: 100vw;
        display: flex;
        justify-content: center;
        align-items: center;
        .register-inner{
            background-color: rgb(147, 112, 219, 0.4);
            background-repeat: no-repeat;
            background-position: bottom 10px center;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: 550px;
            height: auto; 
            padding: 3% 2%;
            border-radius: 4px;
            box-shadow: 0px 10px 18px rgba(0, 0, 0, 0.2);
            .logo-img{
                display: inline-block;
                text-align: center;
                img{
                    width: 80%;
                }
            }
            .register-content-heading{
                text-align: center;
                margin-top: 2%;
                h1{
                    font-family: 'Roboto', sans-serif;
                    font-weight: 400;
                    letter-spacing: 2px;
                    font-size: 1.5em;
                }
            }
            .profile-photo{
                img{
                    border: 0.2px solid black;
                    border-radius: 50%;
                    background-color: rgb(255, 255, 255, 0.7);
                }
            }
            .profile-photo-heading{
                display: flex;
                p{
                    font-family: 'Montserrat', sans-serif;
                    font-weight: 400;
                    font-size: 1em;
                    color: rgb(223, 115, 255);
                    letter-spacing: 1px;
                }
            }
            .register-input{
                width: 100%;
                padding: 2% 4%;
                margin: 0 2%;
                border-radius: 4px;
                .register-username{
                    margin-top: 1%;
                    margin-bottom: 4%;
                    h3{
                        font-family: 'Montserrat', sans-serif;
                        font-weight: 400;
                        font-size: 1.1em;
                        margin: 2% 0 4%;
                        color: rgb(0, 0, 0);
                        letter-spacing: 1px;
                    }
                    p{
                        display: inline-block;
                        width: 80%;
                        margin: 0;
                        color: red;
                        font-size: 0.8em;
                        font-family: 'Poppins', sans-serif;
                    }
                    .register-input-username{
                        width: 100%;
                    }
                    .register-input-username:focus, .register-input-username:active {
                        background: transparent;
                    }
                    .css-1ptx2yq-MuiInputBase-root-MuiInput-root{
                        font-family: 'Open Sans', sans-serif;
                        font-weight: 400;
                        margin-bottom: 2%;
                        padding-bottom: 1%;
                    }
                    .css-1ptx2yq-MuiInputBase-root-MuiInput-root:before{
                        border-bottom: 1px solid black;
                    }
                    span{
                        float: right;
                        font-family: 'Montserrat', sans-serif;
                        letter-spacing: 1px;
                    }
                }
            }
            .button{
                font-family: 'Open Sans', sans-serif;
                background-color: rgb(147, 112, 219);
                color: rgb(255, 255, 255);
                border-radius: 6px;
                margin-top: 2%;
                box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.3);
                transition: all 0.3s ease 0s;
                -webkit-tap-highlight-color: transparent;
            }
            .button:hover {
                background-color: rgb(147, 112, 219, 0.8);
                color: rgb(0, 0, 0, 0.8);
                transform: translateY(-7px);
            }
        }
    }

    @media screen and (max-width: 570px) {
        .register-main{
            .register-inner{
                width: 350px;
            }
        }
    }
`;

export const HeaderStyle = styled.section`
    .header{
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 10vh;
        border-bottom: 1px groove rgb(128,128,128,0.2);
        .logo{
            height: 3em;
            ${'' /* margin-top: 1%; */}
            margin-left: 1%;
        }
        .search-profile{
            display: flex;
            justify-content: center;
            align-items: center;
            ${'' /* margin-top: 1%; */}
            margin-right: 1%;
            .menu-container{
                position: relative;
                .dropdown-menu{
                    display: flex;
                    flex-flow: column;
                    position: absolute;
                    top: 50px;
                    right: 0px;
                    background-color: rgb(120, 81, 169);  
                    border-radius: 8px;
                    padding: 10px 20px;
                    width: 400px;
                    ${'' /* max-width: 400px; */}
                    max-height: 70vh;
                    z-index: 1111;
                    .notf-head{
                        flex: 0 1 auto;
                        padding: 5px 2px 10px;
                        h3{
                            color: #9db6d1;
                            font-family: 'Lato', sans-serif;
                            margin: 0;
                            letter-spacing: 1px;
                        }
                    }
                    .no-notf{
                        color: black;
                        font-family: 'Lato', sans-serif;
                        letter-spacing: 1px;
                        opacity: 0.6;
                    }
                    .notfs{
                        flex: 1 1 auto;
                        overflow: scroll;
                    }
                    .notfs::-webkit-scrollbar {
                        display: none;
                    }
                    .css-3bmhjh-MuiPaper-root-MuiPopover-paper {
                        box-shadow: none;
                    }
                    .notification{
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        background-color: rgb(147, 112, 219, 0.7);
                        border-radius: 5px;
                        margin: 6px 0 6px;
                        .add-button{
                            background: #475cbf;
                            margin: 0 4px 0;
                        }
                        .delete-button{
                            background: rgb(255, 0, 0, 0.3);
                            margin: 0 4px 0;
                        }
                        .mobile-view{
                            display: none;
                        }
                    }
                    
                }
                .dropdown-menu::before{
                    content: '';
                    display: block;
                    position: absolute;
                    top: -5px;
                    right: 15px;
                    height: 20px;
                    width: 20px;
                    background: rgb(120, 81, 169);
                    transform: rotate(45deg);
                }

                .dropdown-menu.active{
                    opacity: 1;
                    visibility: visible;
                    transform: translateY(0);
                    transition: 500ms ease;
                }

                .dropdown-menu.inactive{
                    opacity: 0;
                    visibility: hidden;
                    transform: translateY(-20px);
                    transition: 500ms ease;
                }
            }
        }
    }

    @media screen and (max-width: 900px) {
        .logo{
            display: none;
        }
    }
    @media screen and (max-width: 470px) {
        .header .search-profile .menu-container .dropdown-menu{
            width: 290px;
        }
        .header .search-profile .menu-container .dropdown-menu .notification .mobile-view {
            display: block;
            margin-left: 6px;
            margin-right: -6px;
        }
        .add-button, .delete-button{
            display: none;
        }
    }
`;

export const ContentWrapper = styled.section`
    .chat-profiles{
        box-sizing: border-box;
        height: 90vh;
        display: flex;
        flex-flow: column;
        .chat-header{
            display: flex; 
            flex: 0 1 auto;
            justify-content: space-between;
            align-items: center;
            background-color: rgb(147, 112, 219, 0.1);
            height: 3.5em;
            .close-chats{
                ${'' /* margin-top: 2%;  */}
                margin-left: 2%; 
                display: flex; 
                justify-content: center;
                align-items: center;
                ${'' /* display: inline-block; */}
                h3{
                    font-family: 'Open Sans', sans-serif;
                    font-size: 1.5em;
                    margin: 0;
                }
            }
            .add-icon{
                ${'' /* margin-top: 2%;  */}
                margin-right: 2%; 
                color: rgb(147, 112, 219);
            }
            .add-icon: hover{
                background-color: rgba(25, 118, 210, 0.4);
            }
        }
        .chat-section{
            flex: 1 1 auto;
            overflow: scroll;
            .is-chat-loader{
                margin-top: 5%;
                text-align: center;
                p{
                    font-family: 'Roboto', sans-serif;
                    font-weight: 300;
                    font-size: 0.9em;
                    color: white;
                    opacity: 0.5;
                    margin: 3% 0 3%;
                    letter-spacing: 1px;
                }
            }
            .message{
                font-family: 'Roboto', sans-serif;
                font-weight: 300;
                color: white;
                opacity: 0.7;
                margin: 0;
            }
            .chat-item:hover{
                cursor: pointer;
                background-color: rgb(147, 112, 219, 0.1);
            }
            .active{
                background-color: rgb(147, 112, 219, 0.1);
            }
            .divider{
                opacity: 0.2;
                margin: 1% 6% 1% 18%;
            }
        }
        ${'' /* .chat-section::-webkit-scrollbar {
            display: none;
        }
        .chat-section {
            -ms-overflow-style: none;
            scrollbar-width: none;
        } */}

        ${'' /* .chat-footer{
            flex: 0 1 80px;
            .contact-us, .privacy-support, .feedback{
                height: 3.5em;
                background-color: rgb(147, 112, 219, 0.1);
                border-radius: 8px;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                margin: 2% 4% 3%;
                transition: 0.5s;
                p{
                    font-family: 'Montserrat', sans-serif;
                    font-weight: 400;
                    font-size: 1.15em;
                    margin: 0;
                    margin-left: 4%;
                }
            }
            
            .feedback{
                margin: 2% 4% 2%;
                .feedback-items{
                    width: 100%;
                    display: flex;
                    margin-left: 4%;
                    p{
                        margin-left: 2%;
                    }
                }
            }

            .contact-us:hover, .privacy-support:hover, .feedback:hover{
                cursor: pointer;
                opacity: 0.7;
                transform: scale(1.06);
            }
        } */}
    }

    .person{
        box-sizing: border-box;
        height: 90vh;
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: auto 1fr auto;
        border-left: 1px groove rgb(128,128,128,0.2);
        border-right: 1px groove rgb(128,128,128,0.2);
        position: relative;
        .reload-person{
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            overflow-y: scroll;
            .reload-img{
                img{
                    width: 100%;
                    height: auto; 
                    filter: brightness(70%);
                }
            }
            .reload-about{
                text-align: center;
                p{
                    font-family: 'Montserrat', sans-serif;
                    font-weight: 300;
                    opacity: 0.3;
                    ${'' /* margin: 1%; */}
                }
            }
            .backend-technology{
                margin: 1%;
                img{
                    width: 100%;
                    height: auto;
                    filter: brightness(40%);
                }
            }
        }

        .person-header{
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: rgb(147, 112, 219, 0.1);
            height: 3.5em;
            .person-name{
                display: flex;
                justify-content: flex-start;
                align-items: center;
                letter-spacing: 1px;
                h2{
                    font-family: 'Open Sans', sans-serif;
                    font-weight: 400;
                    font-size: 1.4em;
                }
                p{
                    font-family: 'Open Sans', sans-serif;
                    font-weight: 300;
                    font-size: 0.8em;
                }
                h2, p {
                    margin: 0;
                    transition: transform 0.3s ease-in-out;
                }

                .name-container {
                    display: flex;
                    align-items: flex-start;
                    justify-content: center;
                    flex-direction: column;
                }

                .name-container.show h2 {
                    transform: translateY(-3px);
                }

                .name-container.show p {
                    opacity: 1;
                    transition: opacity 0.6s ease-in-out;
                }
            }
        }

        .loading_state{
            display: flex;
            align-items: center;
            justify-content: center; 
        }

        .lds-ellipsis {
            display: inline-block;
            position: relative;
            width: 80px;
            height: 50px;
        }

        .lds-ellipsis div {
            position: absolute;
            top: 33px;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: #fff;
            animation-timing-function: cubic-bezier(0, 1, 1, 0);
        }

        .lds-ellipsis div:nth-child(1) {
            left: 8px;
            animation: lds-ellipsis1 0.6s infinite;
        }

        .lds-ellipsis div:nth-child(2) {
            left: 8px;
            animation: lds-ellipsis2 0.6s infinite;
        }

        .lds-ellipsis div:nth-child(3) {
            left: 32px;
            animation: lds-ellipsis2 0.6s infinite;
        }

        .lds-ellipsis div:nth-child(4) {
            left: 56px;
            animation: lds-ellipsis3 0.6s infinite;
        }

        @keyframes lds-ellipsis1 {
            0% {
                transform: scale(0);
            }
            100% {
                transform: scale(1);
            }
        }

        @keyframes lds-ellipsis3 {
            0% {
                transform: scale(1);
            }
            100% {
                transform: scale(0);
            }
        }
        
        @keyframes lds-ellipsis2 {
            0% {
                transform: translate(0, 0);
            }
            100% {
                transform: translate(24px, 0);
            }
        }

        .scroll_to_bottom {
            margin-top: -4rem;
            margin-left: auto;
            margin-right: 1rem;
            z-index: 1;
        }

        .chats{
            overflow-y: scroll;
            padding-top: 2%;
            .backdrop-preview{
                background-color: rgb(0, 0, 0, 0.3);
                width: 100%;
                height: 100%;
                .close-backdrop{
                    margin: 10px;
                    color: rgb(147, 112, 219);
                }
                .inside-backdrop-div{
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    h1{
                        font-family: 'Montserrat', sans-serif;
                        font-weight: 400;
                        letter-spacing: 1px;
                        font-size: 1.6em;
                    }
                    .backdrop-preview-details{
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        margin: 12px 6px 10px;
                        padding: 6px;
                        h3, p{
                            font-family: 'Montserrat', sans-serif;
                            font-weight: 400;
                            letter-spacing: 1px;
                            margin: 2px;
                            padding: 2px;
                        }
                        h3{
                            font-size: 1.2em;
                            word-wrap: break-word;
                            word-break: break-all;
                        }
                        p{
                            font-size: 0.8em;
                            opacity: 0.8;
                        }
                    }
                }
            }

            .forDate{
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 10px 0;
                position: sticky;
                top: 0;
                z-index: 1;
                span{
                    ${'' /* background-color: #36454F; */}
                    background-color: #28282B;
                    border: none;
                    border-radius: 10px;
                    padding: 5px 8px;
                    font-family: 'Roboto', sans-serif;
                    font-size: 13px;
                    letter-spacing: 1px;
                    ${'' /* color: #e8eaf6; */}
                    color: rgb(255, 255, 255, 0.6);
                }
            }

            .clear_both{
                clear: both;
                width: 100%;
            }
            .delNotf{
                display: flex;
                align-items: center;
                justify-content: center;
                text-align: center;
                margin: 20px auto;
                p{
                    width: 75%;
                    background-color: rgb(120, 81, 169, 0.5);
                    font-family: 'Montserrat', sans-serif;
                    font-weight: 500;
                    font-size: 0.85em;
                    padding: 6px;
                    border-radius: 4px;
                    letter-spacing: 1px;
                    color: rgba(197, 75, 140, 0.8);
                }
                a{
                    color: #3f51b5;
                    cursor: pointer;
                    text-decoration: none;
                }
            }
            .float_left{
                float: left;
            }
            .float_right{
                float: right;
            }
            .message p{
                border-radius: 5px;
                padding: 8px; 
                margin: 8px 18px;
                max-width: 70%;
                font-family: 'Montserrat', sans-serif;
                font-weight: 400;
                font-size: 0.95em;
                white-space: pre-wrap;
                word-wrap: break-word;
                word-break: break-all;
                span{
                    float: right;
                    font-family: 'Montserrat', sans-serif;
                    font-weight: 500;
                    opacity: 0.5;
                    font-size: 0.8em;
                    letter-spacing: 1px;
                    margin-top: 5px;
                    margin-left: 16px;
                }
            }
            .received-message p, .rec-meme, .rec-file{
                ${'' /* background-color: rgb(255, 255, 255, 0.1);  */}
                background-color: #3f51b5; 
                float: left;
                position: relative;
            }
            .send-message p, .send-meme, .send-file{
                ${'' /* background-color: rgb(120, 81, 169, 0.6);   */}
                background-color: #7e57c2; 
                float: right;
                position: relative;
            }
            .meme_img{
                border-radius: 5px;
                padding: 5px; 
                ${'' /* padding-bottom: 4px; */}
                margin: 8px 18px;
            }
            .meme_img img{
                max-width: 275px;
                ${'' /* max-height: 250px; */}
                height: auto;
                display: block;
            }
            .meme-time{
                ${'' /* margin: 5px 0 2px; */}
                ${'' /* padding-right: 5px; */}
                margin-top: 5px;
                float: right;
                font-family: 'Montserrat', sans-serif;
                font-weight: 500;
                opacity: 0.5;
                font-size: 0.8em;
                letter-spacing: 1px;
            }
            .meme-time span:nth-child(1){
                margin-right: 8px;
            }
            .file{
                max-width: 70%;
                border-radius: 10px;
                margin: 6px 18px;
            }
        
            .file-icon-div{
                ${'' /* background-color: rgb(120, 81, 169, 0.8);   */}
                background-color: #9575cd;
                border-radius: 5px;
                padding: 10px; 
                margin: 8px;
                position: relative;
                font-family: 'Montserrat', sans-serif;
                font-weight: 500;
                letter-spacing: 1px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px;
                .inside-file-icon-div{ 
                    display: flex;
                    align-items: center;
                }
                .file-details{
                    margin: 0 25px 0 6px;
                    p{
                        font-size: 0.8em;
                        opacity: 0.8;
                    }
                    h4{
                        font-size: 0.98em;
                        margin: 0;
                        display: block;
                        word-wrap: break-word;
                        word-break: break-all;
                    }
                }
                .filePreview{
                    position: relative;
                    display: inline-block; 
                    .file-icon{
                        height: 80px;
                        width: 80px;
                        cursor: pointer;
                        -webkit-tap-highlight-color: transparent;
                    }
                    .preview_icon{
                        position: absolute; 
                        top: 50%; 
                        left: 50%; 
                        transform: translate(-50%, -50%); 
                        display: none;
                        -moz-user-select: none;
                        -khtml-user-select: none;
                        -webkit-user-select: none;
                        pointer-events: none;
                    }
                }
                .filePreview:hover .preview_icon {
                    display: block;
                }
                .filePreview:hover .file-icon {
                    filter: brightness(50%);
                    transition: filter 0.25s ease;
                }
            }
            .msgWithFile{
                margin: 5px 5px 0 8px;
                font-family: 'Montserrat', sans-serif;
                font-weight: 400;
                font-size: 0.95em;
                white-space: pre-wrap;
                word-wrap: break-word;
                word-break: break-all;
            }
            .rec-file-icon-div{
                ${'' /* background-color: rgb(120, 81, 169, 0.4);   */}
                background-color: #5c6bc0;  
            }
            .download-icon{
                color: white;
            }
            .message-time{
                margin: 5px 0 5px;
                padding-right: 5px;
                float: right;
                font-family: 'Montserrat', sans-serif;
                font-weight: 500;
                opacity: 0.5;
                font-size: 0.8em;
                letter-spacing: 1px;
                span{
                    margin: 0 5px 0;
                }
            }
            .send-message p::after, .send-file::after, .send-meme::after{
                content: '';
                position: absolute;
                top: 0;
                right: -13px;
                border-right:13px solid transparent;
                border-left:13px solid transparent;
                border-top:13px solid #7e57c2;
                border-top-right-radius: 4px;
            }
            .received-message p::after, .rec-file::after, .rec-meme::after{
                content: '';
                position: absolute;
                top: 0;
                left: -13px;
                border-right:13px solid transparent;
                border-left:13px solid transparent;
                border-top:13px solid #3f51b5;
                border-top-left-radius: 4px;
            }
        }
    
        ${'' /* .chats::-webkit-scrollbar {
            display: none;
        }
        .chats {
            -ms-overflow-style: none; 
            scrollbar-width: none;
        }  */}

        .chat-sending{
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            height: auto;
            background-color: rgb(147, 112, 219, 0.1);
            padding: 2% 0 2%;
            margin-top: 2%;
            .input-message{
                width: 70%;
                background: rgb(147, 112, 219, 0.2);
                border: 1px solid grey;
                border-radius: 5px;
                outline: 0;
            }
            .MuiInputBase-input{
                color: rgb(255, 255, 255, 0.8);
                letter-spacing: 1px;
                font-family: 'Open Sans', sans-serif;
            }
            .input-message::placeholder{
                font-family: 'Open Sans', sans-serif;
                font-weight: 300;
                opacity: 0.7;
                color: rgb(255, 255, 255, 0.8);
            }
            .attach-file{
                color: rgb(147, 112, 219);
                font-size: 1.6em;
                margin-left: 6%;
                cursor: pointer;
            }
            .send-message{
                color: rgb(147, 112, 219);
                font-size: 1.6em;
                margin-right: 6%;
                cursor: pointer;
            }
        }
    }
    @media screen and (max-width: 900px) {
        .person{
            border: none;
        }
    }
`;

export const AboutPersonStyled = styled.div`
    .about-person{
        box-sizing: border-box;
        height: 90vh;
        overflow-y: scroll;
        .about-person-header{
            display: flex;
            padding: 3%;
            border-bottom: 1px groove rgb(128,128,128,0.6);
            .close-about-person{
                margin-right: 2%;
                color: rgb(255, 255, 255, 0.8);
            }
            h3{
                font-family: 'Open Sans', sans-serif;
                color: rgb(255, 255, 255, 0.8);
            }
        }
        .person-info{
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background-color: rgb(147, 112, 219, 0.1);
            .name-id{
                margin: 2% 0 4%;
                text-align: center;
                .name{
                    font-family: 'Montserrat', sans-serif;
                    font-weight: 400;
                    font-size: 1.8em;
                    margin: 0;
                    color: white;
                    word-wrap: break-all;
                }
                p{
                    font-family: 'Montserrat', sans-serif;
                    font-weight: 300;
                    font-size: 0.85em;
                    margin: 4% 0 4%;
                    opacity: 0.5;
                }
            }
        }
        .about-info{
            background-color: rgb(147, 112, 219, 0.1);
            margin: 3% 0 3%;
            padding: 2%;
            .about-inner{
                margin-top: 2%;
                margin-left: 4%;
                h4{
                    font-family: 'Montserrat', sans-serif;
                    font-weight: 400;
                    font-size: 0.9em;
                    opacity: 0.5;
                    margin: 0;
                }
                p{
                    font-family: 'Montserrat', sans-serif;
                    font-weight: 400;
                    font-size: 0.9em;
                    margin: 2% 0 2%;
                    opacity: 0.8;
                    color: white;
                    word-wrap: break-all;
                }
            }
            .inner{
                margin-left: 4%;
            }
        }
        .about-footer{
            .block-delete{
                height: 3.5em;
                background-color: rgb(147, 112, 219, 0.1);
                border-radius: 8px;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                margin: 2% 4% 2%;
                transition: 0.5s;
                .block-delete-person{
                    width: 100%;
                    display: flex;
                    margin-left: 4%;
                    color: rgb(197, 75, 140);
                    p{
                        font-family: 'Montserrat', sans-serif;
                        font-weight: 400;
                        font-size: 1.15em;
                        margin: 0;
                        margin-left: 2%;
                    }
                }
            }
            .block-delete:hover{
                cursor: pointer;
                opacity: 0.7;
                transform: scale(1.06);
            }
        }
    }
`;

export const StyledPaperMyProfile = styled.div`
    .my-profile{
        .css-19kzrtu {
            padding: 0px;
        }
        .outer-prog{
            ${'' /* background-color: #e3edf7;
            height: 300px; */}
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }
        .skill{
            width: 160px;
            height: 160px;
            position: relative;
            margin: 10% 5%;
        }

        .outer{
            background-color: rgba(227, 237, 247, 0.95);
            ${'' /* background-color: #e3edf7; */}
            height: 160px;
            width: 160px;
            padding: 20px;
            box-shadow: 6px 6px 10px -1px rgba(0, 0, 0, 0.15), -6px -6px 10px -1px rgba(255, 255, 255, 0.2);
            border-radius: 50%;
        }

        .inner{
            background: linear-gradient(to right, #110825, #04060a);
            height: 120px;
            width: 120px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: inset 4px 4px 6px -1px rgba(0, 0, 0, 0.2), inset -4px -4px 6px -1px rgba(255, 255, 255, 0.2), 
            -0.5px -0.5px 0px rgba(255, 255, 255, 1), 0.5px 0.5px 0px rgba(0, 0, 0, 0.15),
            0px 12px 10px -10px rgba(0, 0, 0, 0.05);
        }

        #number{
            font-weight: 600;
            color: rgba(255, 255, 255, 0.6);
            ${'' /* color: #555; */}
            font-size: 30px;
        }

        circle{
            fill: none;
            stroke: url(#GradientColor);
            stroke-width: 20px;
            stroke-dasharray: 450;
            stroke-dashoffset: 450;
            animation: anim 2s linear forwards;
        }

        @keyframes anim{
            100%{
                stroke-dashoffset: 360;
            }
        }

        #circle-svg{
            position: absolute;
            top: 0;
            left: 0;
        }

        .profile-header{
            display: flex;
            align-items: center;
            position: sticky;
            top: 0;
            z-index: 1;
            padding: 3%;
            background: linear-gradient(to right, #110825, #04060a);
            border-bottom: 1px groove rgb(128,128,128,0.6);
            .close-myProfile{
                margin-right: 12%;
                color: rgb(255, 255, 255, 0.8);
            }
            h3{
                font-family: 'Open Sans', sans-serif;
                color: rgb(255, 255, 255, 0.8);
            }
        }
        .profile-img{
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 10% 0 10%;
            .profile-img-inner{
                display: inline-block;
                cursor: pointer;
                position: relative;
                -webkit-tap-highlight-color: transparent;
                .edit-photo{
                    padding: 0 4% 0;
                    text-align: center;
                    position: absolute;
                    top: 30%;
                    left: 0;
                    display: none;
                    -moz-user-select: none;
                    -khtml-user-select: none;
                    -webkit-user-select: none;
                    pointer-events: none;
                    opacity: 0.85;
                    p{
                        font-family: 'Montserrat', sans-serif;
                        font-weight: 500;
                        margin: 0;
                    }
                }
            }

            .profile-img-inner:hover .edit-photo {
                display: block;
            }
            .profile-img-inner:hover .profile-pic{
                filter: brightness(40%);
                transition: filter 0.25s ease;
            }
        }
        .profile-name-about{
            background-color: rgb(147, 112, 219, 0.1);
            padding: 4% 2% 4% 4%;
            margin: 4% 0 4%;
            .profile-name-about-heading{
                display: flex;
                justify-content: space-between;
                font-family: 'Montserrat', sans-serif;
                h4{
                    font-weight: 400;
                    font-size: 0.95em;
                    margin: 0 0 3%;
                    color: rgb(223, 115, 255, 0.5);
                    letter-spacing: 1px;
                } 
                span{
                    color: rgb(255, 255, 255, 0.6);
                    margin-right: 10px;
                    letter-spacing: 1px;
                }
            }
            .profile-name-about-inner{ 
                display: flex;
                justify-content: space-between;
                .your-name{
                    font-family: 'Open Sans', sans-serif;
                    font-weight: 400;
                    font-size: 1.4em;
                    letter-spacing: 1px;
                    margin: 0;
                    color: white;
                }
                .input-your-name{
                    padding: 0 0 6px;
                    width: 20rem;
                }
                .edit-name-icon{
                    color: rgb(223, 115, 255, 0.6);
                }
                .your-about{
                    font-family: 'Montserrat', sans-serif;
                    font-weight: 300;
                    font-size: 0.8em;
                }
                .edit-about-icon{
                    margin-top: -12px;
                }
            }
            p{
                margin: 0;
                ${'' /* margin-top: -4%; */}
                color: rgb(197, 75, 140);
                font-size: 0.72em;
                font-family: 'Poppins', sans-serif;
            }
        }
        .profile-name-submit{
            margin-top: 4%;
            text-align: center;
            button{
                background-color: rgb(147, 112, 219, 0.4);
                border: none;
                border-radius: 6px;
                font-family: 'Open Sans', sans-serif;
                font-size: 1.1em;
                letter-spacing: 1px;
                text-align: center;
                padding: 4%;
                color: rgb(255, 255, 255, 0.8);
                width: 40%;
                cursor: pointer;
                box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.3);
                transition: all 0.3s ease 0s;
                -webkit-tap-highlight-color: transparent;
            }
            button:hover {
                ${'' /* background-color: rgb(147, 112, 219, 0.8);
                color: rgb(0, 0, 0, 0.8); */}
                transform: translateY(-5px);
            }
        }

        .image-doc{
            border-radius: 5px;
            border: 1px solid rgba(255, 255, 255, 0.6);
            background: linear-gradient(to right, #110825, #04060a);
            z-index: 1;
            position: sticky;
            top: 75px;
        }

        .image-item{
            position: relative;
        }

        .image-check{
            position: absolute;
            top: 0;
            right: 0;
            display: flex;
            flex-direction: column;
        }

        .document-handling{
            padding: 0 10px;
            ${'' /* opacity: 0.88; */}
        }

        .doc-list{
            margin: 6px 0;
            width: 300px;
            height: 500px;
            overflow: scroll;
        }

        .folderimg{
            width: 300px;
            padding: 5% 2%;
            display: flex;
            align-items: center;
            justify-content: center; 
            img{
                filter: brightness(50%);
            }
        }

        .exm{
            margin-top: 15px;
        }

        .doc-item{
            display: flex;
            align-items: center;
            justify-content: space-between;
            background-color: rgb(147, 112, 219, 0.1);
            margin: 8px 0;
            font-family: 'Montserrat', sans-serif;
            letter-spacing: 1px;
            border-radius: 4px;
            padding: 0 8px;
            cursor: pointer;
            .doc-details{
                padding: 10px 6px;
                -webkit-tap-highlight-color: transparent;
            }
            h3{
                font-size: 16px;
                margin: 0;
                opacity: 0.8;
                font-weight: 400;
            }
            span{
                font-size: 12px;
                opacity: 0.6;
                font-weight: 400;
            }
        }
        .doc-item:hover {
            background-color: rgb(147, 112, 219, 0.2);
        }

        .received-heading{
            width: 300px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 15px;
            span{
                font-family: 'Montserrat', sans-serif;
                font-weight: 400;
                font-size: 1em;
            }
        }

        #heading-opacity{
            opacity: 0.9;
        }

        #del-icon{
            color: rgba(255,255,255,0.8);
        }

        .special-margin{
            margin-bottom: 15px;
        }

        .tab-back{
            background-color: rgba(0, 255, 0, 0.5);
        }
    }
`;

export const StyledPaperAddPerson = styled.div`
    .addPerson{
        .addPerson-header{
            display: flex;
            padding: 3%;
            border-bottom: 1px groove rgb(128,128,128,0.6);
            .close-addPerson{
                margin-right: 2%;
                color: rgb(255, 255, 255, 0.8);
            }
            h3{
                font-family: 'Open Sans', sans-serif;
                color: rgb(255, 255, 255, 0.8);
            }
        }

        .addPerson-id{
            background-color: rgb(147, 112, 219, 0.1);
            padding: 2% 2% 2% 5%;
            margin: 8% 0 2%;
            position: relative;
            h3{
                font-family: 'Montserrat', sans-serif;
                font-weight: 400;
                font-size: 1.3em;
                ${'' /* opacity: 0.5; */}
                margin: 2% 0 4%;
                color: rgb(223, 115, 255);
                letter-spacing: 1px;
            }
            .addPerson-id-input{
                width: 18rem;
            }
            .css-1ptx2yq-MuiInputBase-root-MuiInput-root{
                color: white;
                font-family: 'Open Sans', sans-serif;
                font-weight: 300;
                margin-bottom: 4%;
                padding-bottom: 1%;
            }
            .css-1ptx2yq-MuiInputBase-root-MuiInput-root:before{
                border-bottom: 1px solid white;
            }
            .cancel_button{
                position: absolute;
                top: 45%;
                right: 8%;
            }
        }

        .addPerson-button{
            display: flex;
            justify-content: flex-end;
            align-items: center; 
            margin: 8% 0 2%;
            .lodeingIcon{
                margin-right: 10%;
            }
            button{
                background-color: rgb(223, 115, 255, 0.8);
                color: rgb(255, 255, 255, 0.8);
                letter-spacing: 1px;
                border: none;
                border-radius: 5px;
                padding: 3% 2% 3%;
                margin-right: 5%;
                width: 6em;
                font-family: 'Roboto', sans-serif;
                font-weight: 400;
                font-size: 1.18em;
                cursor: pointer;
                ${'' /* box-shadow: 5px 8px 13px rgba(223, 115, 255, 0.3); */}
                transition: 0.5s;
            }
            button:hover{
                transform: scale(1.06);
                opacity: 0.85;
            }
        }
        .search-result{
            text-align: center;
            margin: 10% 0 2%;
            font-family: 'Poppins', sans-serif;
            font-size: 0.8em;
            .found{
                color: green;
                margin: 4% 0;
                .added-icon{
                    font-size: 5em;
                    animation: zoom-in-zoom-out 2s ease-out infinite;
                }
                @keyframes zoom-in-zoom-out {
                    0% {
                        transform: scale(1, 1);
                    }
                    50% {
                        transform: scale(1.3, 1.3);
                    }
                    100% {
                        transform: scale(1, 1);
                    }
                }
                p{
                    margin-top: 2%;
                    padding: 6px 15px;
                }
            }
            .not-found{
                color: rgb(197, 75, 140);
            }
            .result{
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                background-color: rgb(147, 112, 219, 0.1);
                margin: 4% 6%;
                padding-top: 2%;
                .name-about{
                    padding: 0 4%;
                    h2{
                        font-family: 'Montserrat', sans-serif;
                        font-weight: 400;
                        font-size: 2.2em;
                        margin: 4% 0;
                        color: white;
                        ${'' /* word-wrap: break-all; */}
                    }
                    p{
                        font-family: 'Montserrat', sans-serif;
                        font-weight: 300;
                        font-size: 1.2em;
                        margin: 4% 0;
                        opacity: 0.5;
                    }
                }
                button{
                    text-align: center;
                    width: 100%;
                    background-color: rgb(223, 115, 255, 0.8);
                    color: rgb(255, 255, 255, 0.8);
                    letter-spacing: 2px;
                    border: none;
                    padding: 6% 2%;
                    margin-top: 4%;
                    font-family: 'Roboto', sans-serif;
                    font-weight: 400;
                    font-size: 1.5em;
                    cursor: pointer;
                }
            }
        }
    }
`;