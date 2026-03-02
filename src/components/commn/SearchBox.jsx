import React from 'react'

function SearchBox({search, setSearch,setPage}) {
    return (
        <div>
            {/* Search */}
            <div className="um-search-container">
                <input
                    type="text"
                    placeholder="Search user..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                    }}
                />
            </div>
        </div>
    )
}

export default SearchBox