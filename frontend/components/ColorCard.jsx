import React from 'react';

const ColorCard = ({ palette }) => {
    return (
        <div className="p-4 border rounded-lg shadow-md">
            <div className="flex gap-2">
                {palette.colors.map((color, index) => (
                    <div key={index} className="w-12 h-12 rounded" style={{ backgroundColor: color.hex }}></div>
                ))}
            </div>
            <p className="mt-2 text-sm">Types: {palette.types.join(', ')}</p>
        </div>
    );
};

export default ColorCard;
