import React from 'react';
import Avatar from 'material-ui/Avatar';


function ImageAvatars() {
    return (
        <div className="manage-margin d-flex align-items-center flex-wrap">
            <Avatar className="size-100" alt="Remy Sharp" src="http://via.placeholder.com/150x150"/>

            <Avatar className="size-80" alt="Remy Sharp" src="http://via.placeholder.com/150x150"/>

            <Avatar className="size-60" alt="Remy Sharp" src="http://via.placeholder.com/120x120"/>

            <Avatar alt="Adelle Charles" src="http://via.placeholder.com/260x260"/>

            <Avatar className="size-30" alt="Remy Sharp" src="http://via.placeholder.com/128x128"/>
        </div>
    );
}

export default ImageAvatars;