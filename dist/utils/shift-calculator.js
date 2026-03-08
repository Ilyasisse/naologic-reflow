"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isWithinShift = isWithinShift;
exports.getNextShiftStart = getNextShiftStart;
exports.getCurrentShiftEnd = getCurrentShiftEnd;
exports.calculateEndDateWithShifts = calculateEndDateWithShifts;
/**
 * Returns true if the given datetime falls inside any shift for that weekday.
 */
function isWithinShift(dateTime, shifts) {
    const weekday = dateTime.weekday % 7; // Luxon: Mon=1..Sun=7, convert so Sun=0
    const hour = dateTime.hour + dateTime.minute / 60;
    return shifts.some((shift) => {
        return (shift.dayOfWeek === weekday &&
            hour >= shift.startHour &&
            hour < shift.endHour);
    });
}
/**
 * Finds the next shift start at or after the provided time.
 */
function getNextShiftStart(dateTime, shifts) {
    let cursor = dateTime.startOf("minute");
    for (let i = 0; i < 14; i++) {
        const weekday = cursor.weekday % 7;
        const shiftsToday = shifts
            .filter((shift) => shift.dayOfWeek === weekday)
            .sort((a, b) => a.startHour - b.startHour);
        for (const shift of shiftsToday) {
            const shiftStart = cursor.startOf("day").plus({ hours: shift.startHour });
            const shiftEnd = cursor.startOf("day").plus({ hours: shift.endHour });
            if (cursor <= shiftStart) {
                return shiftStart;
            }
            if (cursor > shiftStart && cursor < shiftEnd) {
                return cursor;
            }
        }
        cursor = cursor.plus({ days: 1 }).startOf("day");
    }
    throw new Error("No upcoming shift found within 14 days");
}
/**
 * Returns the end of the current shift if the datetime is within a shift,
 * otherwise returns null.
 */
function getCurrentShiftEnd(dateTime, shifts) {
    const weekday = dateTime.weekday % 7;
    const matchingShift = shifts.find((shift) => {
        if (shift.dayOfWeek !== weekday)
            return false;
        const shiftStart = dateTime.startOf("day").plus({ hours: shift.startHour });
        const shiftEnd = dateTime.startOf("day").plus({ hours: shift.endHour });
        return dateTime >= shiftStart && dateTime < shiftEnd;
    });
    if (!matchingShift)
        return null;
    return dateTime.startOf("day").plus({ hours: matchingShift.endHour });
}
/**
 * Calculate the real end date by consuming only working minutes inside shifts.
 */
function calculateEndDateWithShifts(startDate, durationMinutes, shifts) {
    if (durationMinutes <= 0)
        return startDate;
    let current = getNextShiftStart(startDate, shifts);
    let remainingMinutes = durationMinutes;
    while (remainingMinutes > 0) {
        const shiftEnd = getCurrentShiftEnd(current, shifts);
        if (!shiftEnd) {
            current = getNextShiftStart(current, shifts);
            continue;
        }
        const availableMinutes = Math.floor(shiftEnd.diff(current, "minutes").minutes);
        if (availableMinutes <= 0) {
            current = getNextShiftStart(current.plus({ minutes: 1 }), shifts);
            continue;
        }
        if (remainingMinutes <= availableMinutes) {
            return current.plus({ minutes: remainingMinutes });
        }
        remainingMinutes -= availableMinutes;
        current = getNextShiftStart(shiftEnd.plus({ minutes: 1 }), shifts);
    }
    return current;
}
