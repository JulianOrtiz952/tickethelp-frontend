import React, { useEffect, useState } from "react";
import { fetchNotifications } from "../api/notificationsService";
import { Link } from "react-router-dom";

export default function NotificationBell() {
    const [count, setCount] = useState(0);

    useEffect(() => {
        (async () => {
            try {
                const data = await fetchNotifications({ leidas: "false", limit: 5 });
                const list = data.notifications ?? data;
                setCount(Array.isArray(list) ? list.length : (list.total_notifications ?? 0));
            } catch (_) { }
        })();
    }, []);

    return (
        <Link to="/notificaciones" className="relative inline-flex items-center">
            <span className="material-icons">notifications</span>
            {count > 0 && (
                <span className="absolute -top-1 -right-1 text-xs bg-red-600 text-white rounded-full px-1.5">
                    {count}
                </span>
            )}
        </Link>
    );
}
