import React from 'react';
import Parser from 'html-react-parser';

const NotificationItem = ({notification}) => {
    const {title, date, time} = notification;
    const titleParse = decodeURI(title)
    return (
        <li className="media">

            <div className="media-body align-self-center">
              <div style={{display: 'flex', justifyContent: 'flex-start'}}>
                <div style={{flexShrink: '0', minWidth: '65px', top: '-2px', position: 'relative'}}>
                  <p className="sub-heading mb-0"><span className="meta-date"><small>{date}</small></span></p>
                  <p className="sub-heading mb-0"><span className="meta-date"><small>{time}</small></span></p>
                </div>
                <div>
                  <p className="sub-heading mb-0">{Parser(titleParse)}</p>

                </div>
              </div>
            </div>
        </li>
    );
};

export default NotificationItem;
