import React from 'react';
import Header from '../components/Header';
import LeftMenu from '../components/LeftMenu';
import RightMenu from '../components/RightMenu';

const Layout = ({
    children,
    handleFilterChange,
    SetSearch,
    search,
    isClick,
    likedItems,
    filteredColors,
    sortType,
    setFilteredColors,
    handleOptionOpen,
    allColors,
}) => {
    return (
        <>
            <Header
                name={'Search Colors'}
                handleOptionOpen={handleOptionOpen}
                SetSearch={SetSearch}
                search={search}
                isClick={isClick}
                handleFilterChange={handleFilterChange}
            />
            <LeftMenu handleFilterChange={handleFilterChange} />
            {children} {/* ✅ `ColorList` 또는 `ColorDetail`이 들어감 */}
            <RightMenu
                filteredColors={filteredColors}
                sortType={sortType}
                setFilteredColors={setFilteredColors}
                likedItems={likedItems}
                allColors={allColors}
            />
        </>
    );
};

export default Layout;
