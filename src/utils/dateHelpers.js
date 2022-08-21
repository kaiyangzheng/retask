export const convertUtcToLocal = (utcDate) => {
    if (!utcDate) {
        return "None";
    }
    const date = new Date(utcDate);
    return date.toLocaleDateString();
}

export const getCurrentDate = (separator = '/') => {
    const newDate = new Date();
    let date = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();

    return `${month}${separator}${date}${separator}${year}`;
}

export const getDateDifference = (date1, date2) => {
    let dateObj1 = new Date(date1);
    let dateObj2 = new Date(date2);
    const diffTime = Math.abs(dateObj2 - dateObj1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
}

export const getTimeOfDay = () => {
    const newDate = new Date();
    let hours = newDate.getHours();

    if (hours < 12) {
        return {
            timeOfDay: "morning",
            timeOfDayText: "Good morning",
            emoji: "☀️"
        };
    } else if (hours < 18) {
        return {
            timeOfDay: "afternoon",
            timeOfDayText: "Good afternoon",
            emoji: "🌞"
        }
    } else if (hours < 22) {
        return {
            timeOfDay: "evening",
            timeOfDayText: "Good evening",
            emoji: "🌙"
        }
    } else {
        return {
            timeOfDay: "night",
            timeOfDayText: "Good night",
            emoji: "🌚"
        }
    }
}