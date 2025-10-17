export default function BrandTicket({ size = 200, className = "" }) {
    return (
        <div className={`flex justify-center ${className}`}>
            <img
                src="/logo_ticket-help.svg"
                alt="TicketHelp Logo"
                width={size}
                height={size}
                className="object-contain select-none"
                draggable="false"
            />
        </div>
    );
}
