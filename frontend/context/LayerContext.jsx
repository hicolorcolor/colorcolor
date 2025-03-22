import React, { createContext, useContext, useState, useEffect } from 'react';

// ✅ LayerContext 생성
export const LayerContext = createContext();

export const useLayerContext = () => useContext(LayerContext);

export const LayerProvider = ({ children }) => {
    const [layerStyle, setLayerStyle] = useState(false);
    const [dark, setDark] = useState(localStorage.getItem('darkMode') === 'true');

    useEffect(() => {
        document.body.classList.toggle('darkMode', dark);
        document.body.classList.toggle('normal', !dark);
        localStorage.setItem('darkMode', dark);
    }, [dark]);

    return (
        <LayerContext.Provider value={{ layerStyle, setLayerStyle, dark, setDark }}>{children}</LayerContext.Provider>
    );
};
