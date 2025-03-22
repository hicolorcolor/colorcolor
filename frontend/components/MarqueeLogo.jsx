import React from 'react';
import './MarqueeLogo.css';

const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];

const MarqueeLogo = () => {
    return (
        <div className="marquee-wrapper">
            <div className="marquee-content">
                {[...colors, ...colors].map((color, index) => (
                    <div key={index} className="color-box" style={{ backgroundColor: color }} />
                ))}
            </div>
        </div>
    );
};

export default MarqueeLogo;
