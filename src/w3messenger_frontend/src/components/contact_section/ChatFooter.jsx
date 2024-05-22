import React from 'react';
import { ContentWrapper } from "../../../assets/styles";
import FeedbackIcon from '@mui/icons-material/Feedback';

function ChatFooter () {

    console.log("ChatFooter re-render")
    
    return(
        <ContentWrapper>
            <div className="chat-footer">
                <div className="contact-us">
                    <p>Contact Us</p>
                </div>
                <div className="privacy-support">
                    <p>Privacy and Support</p>
                </div>
                <div className="feedback">
                    <div className="feedback-items">
                        <FeedbackIcon/>
                        <p>Submit Feedback</p>
                    </div>
                </div>
            </div>
        </ContentWrapper>
    );
};

export default React.memo(ChatFooter);