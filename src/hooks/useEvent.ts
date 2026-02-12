'use client';

export type EventType = 'BlackWeek' | 'KingasBday' | 'None';

export interface EventInfo {
    type: EventType;
    discount: number;
}

export function useEvent(): EventInfo {
    const now = new Date();
    const blackWeekBegin = new Date(now.getFullYear(), 10, 15); // November 15
    const blackWeekEnd = new Date(now.getFullYear(), 11, 24); // December 24

    // Check if we're in Black Week period
    if (now >= blackWeekBegin && now <= blackWeekEnd) {
        return {
            type: 'BlackWeek',
            discount: 30
        };
    }

    const kingasBdayBegin = new Date(2026, 1, 12); // February 13 2026
    const kingasBdayEnd = new Date(2026, 1, 15); // February 15 2026
    if (now >= kingasBdayBegin && now <= kingasBdayEnd) {
        return {
            type: 'KingasBday',
            discount: 24
        };
    }

    return {
        type: 'None',
        discount: 0
    };
}
