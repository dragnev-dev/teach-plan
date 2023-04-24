import SQLite from 'react-native-sqlite-storage';

export default class DatabaseService {
  private static database: SQLite.SQLiteDatabase;

  private static async init() {
    if (!this.database) {
      this.database = await SQLite.openDatabase({
        name: 'myDatabase.db',
        location: 'default',
      });
    }
    DatabaseService.createTables();
  }

  private static createTables() {
    DatabaseService.database.transaction(tx => {
      tx.executeSql(
        `
        CREATE TABLE IF NOT EXISTS schedule (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
        );

        CREATE TABLE IF NOT EXISTS class (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          schedule_id INTEGER NOT NULL,
          FOREIGN KEY (schedule_id) REFERENCES schedule (id)
        );

        CREATE TABLE IF NOT EXISTS day (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          number INTEGER NOT NULL,
          class_id INTEGER NOT NULL,
          FOREIGN KEY (class_id) REFERENCES class(id)
        );
        
        CREATE TABLE IF NOT EXISTS hour (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          subject TEXT NOT NULL,
          hours_id INTEGER NOT NULL,
          FOREIGN KEY (hours_id) REFERENCES day (id)
        );
        
        CREATE TABLE IF NOT EXISTS syllabus (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          subject TEXT NOT NULL,
          class INTEGER NOT NULL,
          FOREIGN KEY (class) REFERENCES class (id)
        );
        
        CREATE TABLE syllabus_entry (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          topic_name TEXT NOT NULL,
          lesson_unit TEXT NOT NULL,
          expected_results TEXT,
          methods_and_work_forms TEXT,
          number INTEGER NOT NULL,
          week INTEGER NOT NULL,
          syllabus_id INTEGER NOT NULL,
          FOREIGN KEY (syllabus_id) REFERENCES syllabus (id)
        );
      `,
        [],
      );
    });
  }
}
