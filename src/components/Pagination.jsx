export default function Pagination({ page, totalPages, onPage }) {
    if (totalPages <= 1) return null;

    const go = p => () => onPage(Math.min(Math.max(1, p), totalPages));

    return (
        <div className="inline-flex items-center gap-1">
            <button onClick={go(page - 1)} className="px-2 py-1 border rounded disabled:opacity-50" disabled={page <= 1}>‹</button>
            {Array.from({ length: totalPages }).map((_, i) => {
                const p = i + 1;
                const active = p === page ? "bg-blue-600 text-white" : "bg-white";
                return (
                    <button key={p} onClick={go(p)} className={`px-3 py-1 border rounded ${active}`}>
                        {p}
                    </button>
                );
            })}
            <button onClick={go(page + 1)} className="px-2 py-1 border rounded disabled:opacity-50" disabled={page >= totalPages}>›</button>
        </div>
    );
}