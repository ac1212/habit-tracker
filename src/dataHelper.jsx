import Dexie from 'dexie';
import moment from 'moment';

class LocalDataHelper {
    constructor() {
        this.initialized = false;
    }

    static stripTime(date) {
        var stripped_date = new Date(date);
        stripped_date.setHours(0);
        stripped_date.setMinutes(0);
        stripped_date.setSeconds(0);
        stripped_date.setMilliseconds(0);
        return stripped_date;
    }

    async initializeIfNeeded() {
        if (this.initialized) return;
        this.db = new Dexie("HabitsDatabase");
        this.db.version(1).stores({
            habits: "habit_name",
            status: "[date+habit_name],date,habit_name,&timestamp"
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
            const creation_date = LocalDataHelper.stripTime(creation_timestamp);
            const creation_date2 = LocalDataHelper.stripTime(creation_timestamp+ 8*24*60*60*1000);
            await this.db.habits.bulkAdd([
                { habit_name: "Morning Meditation", time_created: creation_timestamp },
                { habit_name: "Kriya", time_created: creation_timestamp },
                { habit_name: "Padmasadhna", time_created: creation_timestamp },
                { habit_name: "Exercise", time_created: creation_timestamp },
                { habit_name: "Evening Meditation", time_created: creation_timestamp }
            ]);
            // demo.
            await this.db.status.bulkAdd([
                { date: creation_date, habit_name: "Kriya", timestamp: creation_timestamp + 1, completed: true },
                { date: creation_date, habit_name: "Padmasadhna", timestamp: creation_timestamp + 2, completed: true },
                { date: creation_date2, habit_name: "Padmasadhna", timestamp: creation_timestamp + 3, completed: true },
            ]);
        }
        this.initialized = true;
    }

    // Get a list of the active habits.
    async getActiveHabits() {
        await this.initializeIfNeeded();
        const habits = await this.db.habits.toArray();
        return habits.map((habit) => { return habit.habit_name; });
    }

    // Return true if there are active habit updates before this date.
    async olderUpdatesExist(date) {
        const active_habits = await this.getActiveHabits();
        return await this.db.status.where("habit_name").anyOf(active_habits).and(function (s) { return s.date < date;}).count() > 0;
    }

    // Return true if there are active habit updates after this date.
    async newerUpdatesExist(date) {
        const active_habits = await this.getActiveHabits();
        return await this.db.status.where("habit_name").anyOf(active_habits).and(function (s) { return s.date > date;}).count() > 0;
    }

    // Get the updates for all active habits for the provided date and next 6 days.
    async getWeekUpdates(startDate) {
        await this.initializeIfNeeded();
        //TODO: handle if db not open
        // Calculate time range of interest.
        var startTime = new Date(startDate);
        startTime.setDate(startTime.getDate() - startTime.getDay());
        startTime = LocalDataHelper.stripTime(startTime);
        var endTime = new Date(startTime);
        endTime.setDate(endTime.getDate() + 7);
        // Get habits.
        const active_habits = await this.getActiveHabits();
        // Get updates in the time range of interest.
        const updates = await this.db.status.where("date").between(startTime, endTime).toArray();
        // Initialize parsed output.
        var updates_formatted = {}
        active_habits.forEach((active_habit) => { updates_formatted[active_habit]= [false, false, false, false, false, false, false]; });
        // Fill in all updates.
        for (const update of updates) {
            if (update.habit_name in updates_formatted) {
                // Calculate difference from start date.
                const dayOfWeek = moment(update.date).diff(moment(startTime),'days');
                // Update cell.
                updates_formatted[update.habit_name][dayOfWeek] = update.completed;
            }
        }
        return updates_formatted;
    }

    // Write or update a completion status.
    async writeUpdate(date, habit_name, completed) {
        await this.initializeIfNeeded();
        const timestamp = Date.now();
        // Check for existing status for this habit on this day.
        var existing_update = await this.db.status.where({habit_name: habit_name, date: date}).first();
        if (typeof existing_update !== 'undefined') { // If there is an existing older status, update it.
            if (existing_update.timestamp<timestamp) {
              await this.db.status.put({ timestamp: timestamp, date: date, habit_name: habit_name, completed: completed });
            }
        } else { // No existing status. Add.
            await this.db.status.add({ timestamp: timestamp, date: date, habit_name: habit_name, completed: completed });
        }
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

    // Delete a habit.
    async deleteHabit(habit_name) {
        try {
            await this.db.habits.delete(habit_name);
            // Clean out all associated updates.
            await this.db.status.where("habit_name").equals(habit_name).delete();
        }
        catch (e) {
            console.error(e);
            return false;
        }
        return true;
    }
}

export default LocalDataHelper;