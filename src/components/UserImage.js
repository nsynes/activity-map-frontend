import React from 'react';
import './UserImage.css';

const UserImage = (props) => {

    var photoPath = props.photo.length > 0 ? props.photo : 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D';

    return (
        <div style={{float:'right'}}>
            <img
                id='user-image'
                alt='User'
                draggable='false'
                src={photoPath}/>
            <button
                id='logout-button'
                onClick={() => window.location.href = "http://localhost:3001/auth/logout"}>Log Out</button>
        </div>
    )
}


export default UserImage;