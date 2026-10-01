'use client';

import { useEffect, useState } from 'react';

export type EventType = 'BlackWeek' | 'KingasBday' | 'None';

export interface EventInfo {
    type: EventType;
    discount: number;
}

const NO_EVENT: EventInfo = { type: 'None', discount: 0 };

export function getEvent(now: Date): EventInfo {
    const blackWeekBegin = new Date(now.getFullYear(), 10, 15); // November 15
    const blackWeekEnd = new Date(now.getFullYear(), 11, 24); // December 24

    // Check if we're in Black Week period
    if (now >= blackWeekBegin && now <= blackWeekEnd) {
        return {
            type: 'BlackWeek',
            discount: 30
        };
    }

    const kingasBdayBegin = new Date(2026, 1, 13); // February 13 2026
    const kingasBdayEnd = new Date(2026, 1, 15); // February 15 2026
    if (now >= kingasBdayBegin && now <= kingasBdayEnd) {
        return {
            type: 'KingasBday',
            discount: 24
        };
    }

    return NO_EVENT;
}

/**
 * The page is statically generated, so the date is read after mount -
 * otherwise the build date would decide which prices get server-rendered.
 */
export function useEvent(): EventInfo {
    const [event, setEvent] = useState<EventInfo>(NO_EVENT);

    useEffect(() => {
        setEvent(getEvent(new Date()));
    }, []);

    return event;
}
