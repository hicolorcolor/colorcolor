import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from '../context/UserIdContext';
import { FilterProvider } from '../context/FilterContext';
import { LayerProvider } from '../context/LayerContext';
import MediaQueryContext from '../context/MediaQueryContext';

import Home from '../page/Home';
import ColorList from '../components/ColorList';
import ColorDetail from '../components/ColorDetail';
import UserLike from '../page/UserLike';
import ScrollToTop from '../components/ScrollToTopjsx';

function App() {
    return (
        <Router>
            <UserProvider>
                <ScrollToTop />
                <LayerProvider>
                    <MediaQueryContext>
                        <FilterProvider>
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/colors" element={<ColorList />} />
                                <Route path="/color/:id" element={<ColorDetail />} />
                                <Route path="/colors/userLike" element={<UserLike />} />
                            </Routes>
                        </FilterProvider>
                    </MediaQueryContext>
                </LayerProvider>
            </UserProvider>
        </Router>
    );
}

export default App;
