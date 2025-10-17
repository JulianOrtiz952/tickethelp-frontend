export default function BrandTicket({ className = "w-36 h-16" }) {
    return (
        <div className={`inline-flex -mt-10 mb-4 ${className}`}>
            <svg viewBox="0 0 160 90" className="w-full h-full">
                <defs>
                    <clipPath id="ticket-clip">
                        <path d="M10,15 h140 a5,5 0 0 1 5,5 v15 a10,10 0 0 0 0,20 v15 a5,5 0 0 1-5,5 H10 a5,5 0 0 1-5-5 V55 a10,10 0 0 0 0-20 V20 a5,5 0 0 1 5-5 z" />
                    </clipPath>
                </defs>
                <rect width="160" height="90" rx="10" ry="10" fill="#1F5E89" clipPath="url(#ticket-clip)" />
                <g transform="translate(55,22)">
                    <circle cx="25" cy="23" r="22" fill="#FFFFFF" opacity="0.15" />
                    <path d="M11 36 L19 20 a4 4 0 0 1 4-2 h12 a4 4 0 0 1 0 8 h-9 l-5 10"
                        stroke="#FFFFFF" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </g>
                <line x1="80" y1="8" x2="80" y2="82" stroke="#FFFFFF" strokeDasharray="6 6" opacity="0.35" />
            </svg>
        </div>
    );
}
