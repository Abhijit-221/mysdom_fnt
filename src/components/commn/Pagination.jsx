import React from 'react'
import './pagination.css'
function Pagination({ page, setPage, totalPages = 1 }) {
    return (
        <div className="um-pagination">
            <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
            >
                Prev
            </button>

            <span>
                Page {page} of {totalPages || 1}
            </span>

            <button
                disabled={page === totalPages || totalPages === 0}
                onClick={() => setPage(page + 1)}
            >
                Next
            </button>
        </div>
    )
}

export default Pagination