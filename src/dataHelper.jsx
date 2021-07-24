import Dexie from 'dexie';

class LocalDataHelper {
    constructor() {
        this.initialized = false;
    }

    static stripTIme(date) {
        var stripped_date = new Date(date);
        stripped_date.setHours(0);
        stripped_date.setMinutes(0);
        stripped_date.setSeconds(0);
        stripped_date.setMilliseconds(0);
        return stripped_date;
    }

    async initializeIfNeeded() {
        if (this.initialized) return;
        console.log("Initializing LocalDataHelper");
        this.db = new Dexie("HabitsDatabase");
        this.db.version(1).stores({
            habits: "habit_name",
            status: "timestamp,date,habit_name"
        });
        try {
            await this.db.open();
        }
        catch (e) {
            console.error("Could not open database:\n" + e.stack);
        }
        const habit_count = await this.db.habits.toCollection().count();
        if (habit_count === 0) {
            console.log("No current habits. Resetting database.");
            // Create sample habits.
            const creation_timestamp = Date.now();
            const creation_date = LocalDataHelper.stripTIme(creation_timestamp);
            await this.db.habits.bulkAdd([
                { habit_name: "Morning Meditation", time_created: creation_timestamp },
                { habit_name: "Kriya", time_created: creation_timestamp },
                { habit_name: "Padmasadhna", time_created: creation_timestamp },
                { habit_name: "Exercise", time_created: creation_timestamp },
                { habit_name: "Evening Meditation", time_created: creation_timestamp }
            ]);
            // demo.
            await this.db.status.bulkAdd([
                { timestamp: creation_timestamp + 1, date: creation_date, habit_name: "Kriya", completed: true },
                { timestamp: creation_timestamp + 2, date: creation_date, habit_name: "Padmasadhna", completed: true },
            ]);
        }
        this.initialized = true;
    }

    // Get a list of the active habits.
    async getActiveHabits() {
        await this.initializeIfNeeded();
        return this.db.habits.toArray().then(function (arr) {
            return arr.map((habit) => { return habit.habit_name; })
        });
    }

    // Get the updates for all active habits for the provided date and next 6 days.
    async getWeekUpdates(startDate) {
        await this.initializeIfNeeded();
        //TODO: handle if db not open
        // Calculate time range of interest.
        var startTime = new Date(startDate);
        startTime.setDate(startTime.getDate() - startTime.getDay());
        startTime = LocalDataHelper.stripTIme(startTime);
        var endTime = new Date(startTime);
        endTime.setDate(endTime.getDate() + 7);
        console.log("Looking for statuses between", startTime, " and ", endTime);
        // Get habits.
        const active_habits = await this.getActiveHabits();
        // Get updates in the time range of interest.
        const updates = await this.db.status.where("date").between(startTime, endTime);
        console.log("this week updates:", await updates.toArray());
        // Parse format.
        var updates_formatted = {}
        for (var j = 0; j < active_habits.length; j++) {
            var habit_updates = await updates.filter((u) => { return u.habit_name == active_habits[j]; });
            var week_status = [false, false, false, false, false, false, false];
            for (var i = 0; i < 7; i++) {
                var current_date = new Date(startTime);
                current_date.setDate(current_date.getDate() + i);
                // Get latest update in this date
                var habit_updates_today = await habit_updates.filter((u) => { return u.date.getTime() === current_date.getTime(); }).sortBy("timestamp");
                var completed = false;
                if (habit_updates_today.length > 0) {
                    completed = habit_updates_today[habit_updates_today.length - 1].completed;
                }
                //console.log("on day ", i, " (", current_date.getMonth() + 1, "/", current_date.getDate(), "), ", active_habits[j], " was completed:", completed);
                week_status[i] = completed;
            }
            updates_formatted[active_habits[j]] = week_status;
        }
        return updates_formatted;
    }

    // Write or update a completion status.
    async writeUpdate(date, habit_name, completed) {
        console.log("called writeUpdate with ", { date: date, habit_name: habit_name, completed: completed });
        await this.initializeIfNeeded();
        const timestamp = Date.now();
        await this.db.status.add({ timestamp: timestamp, date: date, habit_name: habit_name, completed: completed });
    }

    // Add a habit.
    async addHabit(habit_name) {
        const creation_timestamp = Date.now();
        //TODO: try-catch and return result failed because .. if failed. otherwise return success.
        try {
            await this.db.habits.add({ habit_name: habit_name, time_created: creation_timestamp });
        }
        catch (e) {
            //TODO: Assuming failure here must be because the key exists.
            console.error(e);
            return false;
        }
        return true;
    }
}

export default LocalDataHelper;