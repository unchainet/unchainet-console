import React from 'react';

const CardLayout = ({children, styleName, childrenStyle}) => {
    return (
        <div className={`jr-card ${styleName}`}>
            {children}
        </div>
    )
};

export default CardLayout;

