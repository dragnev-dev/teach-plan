import SQLite, {SQLiteDatabase, Transaction} from 'react-native-sqlite-storage';
import {Syllabus, SyllabusEntry} from '../models/syllabus';

let databaseInstance: SQLiteDatabase | null = null;

export const initDatabase = async (): Promise<void> => {
  databaseInstance = SQLite.openDatabase(
    {
      name: 'klass_schedule.db',
      location: 'default',
    },
    () => {
      console.log('Database opened');
    },
    error => {
      console.log(`Database error: ${error}`);
    },
  );

  await createTables();
};

const createTables = (): Promise<Transaction> => {
  return databaseInstance!.transaction(tx => {
    tx.executeSql(
      `
      CREATE TABLE IF NOT EXISTS schedule (
        id INTEGER PRIMARY KEY AUTOINCREMENT
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
        teachers TEXT NOT NULL,
        day_id INTEGER NOT NULL,
        FOREIGN KEY (day_id) REFERENCES day (id)
      );
      
      CREATE TABLE IF NOT EXISTS syllabus (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        subject TEXT NOT NULL,
        class INTEGER NOT NULL,
        FOREIGN KEY (class) REFERENCES class (id)
      );

      CREATE TABLE IF NOT EXISTS syllabus_entry (
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
      () => {
        console.log('Ran table creation!');
      }, // success callback
      error => console.error('Error in table creation ' + error), // error callback
    );
  });
};

export const addSyllabus = async (syllabus: Syllabus): Promise<number> => {
  if (!databaseInstance) {
    throw new Error('Database not initialized');
  }

  try {
    return new Promise<number>((resolve, reject) => {
      databaseInstance!.transaction(tx => {
        // Check if the table exists before inserting data
        tx.executeSql(
          'SELECT name FROM sqlite_master WHERE type=? AND name=?',
          ['table', 'syllabus'],
          (_, result) => {
            if (result.rows.length === 0) {
              // Table doesn't exist, create it
              tx.executeSql(
                'CREATE TABLE syllabus (id INTEGER PRIMARY KEY AUTOINCREMENT, subject TEXT, class TEXT)',
                [],
                () => {
                  // Table created, now insert data
                  insertSyllabusData(tx, syllabus, resolve, reject);
                },
                reject,
              );
            } else {
              // Table already exists, insert data
              insertSyllabusData(tx, syllabus, resolve, reject);
            }
          },
          reject,
        );
      });
    });
  } catch (error) {
    console.error('Error adding post', error);
    throw error;
  }
};

const insertSyllabusData = (
  tx: Transaction,
  syllabus: Syllabus,
  resolve: (value?: number | PromiseLike<number>) => void,
  reject: (reason?: any) => void,
) => {
  tx.executeSql(
    'INSERT INTO syllabus (subject, class) VALUES (?, ?)',
    [syllabus.subject, syllabus.class],
    (_, result) => {
      const insertId = result.insertId;
      const promises = syllabus.syllabusEntries.map(entry =>
        tx.executeSql(
          'INSERT INTO syllabus_entry (topic_name, lesson_unit, expected_results, methods_and_work_forms, number, week, syllabus_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [
            entry.topicName,
            entry.lessonUnit,
            entry.expectedResults,
            entry.methodsAndWorkForms,
            entry.number,
            entry.week,
            insertId,
          ],
        ),
      );
      Promise.all(promises)
        .then(() => resolve(insertId))
        .catch(reject);
    },
    reject,
  );
};

// export const addSyllabus = async (syllabus: Syllabus): Promise<number> => {
//   if (!databaseInstance) {
//     throw new Error('Database not initialized');
//   }
//
//   try {
//     return new Promise<number>((resolve, reject) => {
//       databaseInstance!.transaction(tx => {
//         tx.executeSql(
//           'INSERT INTO syllabus (subject, class) VALUES (?, ?)',
//           [syllabus.subject, syllabus.class],
//           (_, result) => {
//             const insertId = result.insertId;
//             const promises = syllabus.syllabusEntries.map(entry =>
//               tx.executeSql(
//                 'INSERT INTO syllabus_entry (topic_name, lesson_unit, expected_results, methods_and_work_forms, number, week, syllabus_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
//                 [
//                   entry.topicName,
//                   entry.lessonUnit,
//                   entry.expectedResults,
//                   entry.methodsAndWorkForms,
//                   entry.number,
//                   entry.week,
//                   insertId,
//                 ],
//               ),
//             );
//             Promise.all(promises)
//               .then(() => resolve(insertId))
//               .catch(reject);
//           },
//           reject,
//         );
//       });
//     });
//   } catch (error) {
//     console.error('Error adding post', error);
//     throw error;
//   }
// };

export const getSyllabusAndEntries = async (
  syllabusId: number,
): Promise<Syllabus> => {
  const syllabusQuery = 'SELECT * FROM syllabus WHERE id = ?';
  const entriesQuery = 'SELECT * FROM syllabus_entry WHERE syllabus_id = ?';

  const syllabusResult = await databaseInstance!.executeSql(syllabusQuery, [
    syllabusId,
  ]);
  const entriesResult = await databaseInstance!.executeSql(entriesQuery, [
    syllabusId,
  ]);

  if (!syllabusResult) {
    throw Error('syllabusResult is ' + syllabusResult);
  }

  const syllabus = syllabusResult[0].rows.item(0) as Syllabus;
  const entries = entriesResult[0].rows.raw() as SyllabusEntry[];

  // return [syllabus, entries];
  syllabus.syllabusEntries = entries;
  return syllabus;
};

export const getAllSyllabuses = async (): Promise<Syllabus[]> => {
  if (!databaseInstance) {
    throw new Error('Database not initialized');
  }

  const query = 'SELECT * FROM syllabus';

  try {
    const result = await databaseInstance!.executeSql(query);
    if (!result) {
      throw new Error('Query returned undefined');
    }
    if (result[0].rowsAffected === 0) {
      console.log('no rows');
      // no rows affected - handle error or return a default value
      return [] as Syllabus[];
    }
    console.log('return correct');
    return result[0].rows.raw() as Syllabus[];
  } catch (e) {
    console.log(e);
    throw e;
  }
};

// export default class DatabaseService {
//   private static database: SQLite.SQLiteDatabase;
//
//   private static async init() {
//     if (!this.database) {
//       this.database = await SQLite.openDatabase({
//         name: 'myDatabase.db',
//         location: 'default',
//       });
//     }
//     DatabaseService.createTables();
//   }
//
//   private static createTables() {
//     DatabaseService.database.transaction(tx => {
//       tx.executeSql(
//         `
//         CREATE TABLE IF NOT EXISTS schedule (
//           id INTEGER PRIMARY KEY AUTOINCREMENT,
//         );
//
//         CREATE TABLE IF NOT EXISTS class (
//           id INTEGER PRIMARY KEY AUTOINCREMENT,
//           name TEXT NOT NULL,
//           schedule_id INTEGER NOT NULL,
//           FOREIGN KEY (schedule_id) REFERENCES schedule (id)
//         );
//
//         CREATE TABLE IF NOT EXISTS day (
//           id INTEGER PRIMARY KEY AUTOINCREMENT,
//           number INTEGER NOT NULL,
//           class_id INTEGER NOT NULL,
//           FOREIGN KEY (class_id) REFERENCES class(id)
//         );
//
//         CREATE TABLE IF NOT EXISTS hour (
//           id INTEGER PRIMARY KEY AUTOINCREMENT,
//           subject TEXT NOT NULL,
//           teachers TEXT NOT NULL,
//           hours_id INTEGER NOT NULL,
//           FOREIGN KEY (hours_id) REFERENCES day (id)
//         );
//
//         CREATE TABLE IF NOT EXISTS syllabus (
//           id INTEGER PRIMARY KEY AUTOINCREMENT,
//           subject TEXT NOT NULL,
//           class INTEGER NOT NULL,
//           FOREIGN KEY (class) REFERENCES class (id)
//         );
//
//         CREATE TABLE IF NOT EXISTS syllabus_entry (
//           id INTEGER PRIMARY KEY AUTOINCREMENT,
//           topic_name TEXT NOT NULL,
//           lesson_unit TEXT NOT NULL,
//           expected_results TEXT,
//           methods_and_work_forms TEXT,
//           number INTEGER NOT NULL,
//           week INTEGER NOT NULL,
//           syllabus_id INTEGER NOT NULL,
//           FOREIGN KEY (syllabus_id) REFERENCES syllabus (id)
//         );
//       `,
//         [],
//       );
//     });
//   }
//
//   public static async getSyllabusAndEntries(
//     syllabusId: number,
//     // ): Promise<[Syllabus, SyllabusEntry[]]> {
//   ): Promise<Syllabus> {
//     await DatabaseService.init();
//     const syllabusQuery = 'SELECT * FROM syllabus WHERE id = ?';
//     const entriesQuery = 'SELECT * FROM syllabus_entry WHERE syllabus_id = ?';
//
//     const syllabusResult = await this.database.executeSql(syllabusQuery, [
//       syllabusId,
//     ]);
//     const entriesResult = await this.database.executeSql(entriesQuery, [
//       syllabusId,
//     ]);
//
//     const syllabus = syllabusResult[0].rows.item(0) as Syllabus;
//     const entries = entriesResult[0].rows.raw() as SyllabusEntry[];
//
//     // return [syllabus, entries];
//     syllabus.syllabusEntries = entries;
//     return syllabus;
//   }
//
//   static async getAllSyllabuses(): Promise<Syllabus[]> {
//     const query = 'SELECT * FROM syllabus';
//
//     const result = await this.database.executeSql(query);
//
//     return result[0].rows.raw() as Syllabus[];
//   }
//
//   // static async addSyllabus(syllabus: Syllabus): Promise<void> {
//   //   const {subject, class: classNumber, syllabusEntries} = syllabus;
//   //
//   //   const query = `
//   //     INSERT INTO syllabus (subject, class)
//   //     VALUES (?, ?)
//   //   `;
//   //
//   //   const values = [subject, classNumber];
//   //
//   //   await this.database.executeSql(query, values);
//   //
//   //   const syllabusId = await this.getLastInsertRowId();
//   //
//   //   const entryQuery = `INSERT INTO syllabus_entry (
//   //     syllabus_id,
//   //     topic_name,
//   //     lesson_unit,
//   //     expected_results,
//   //     methods_and_work_forms,
//   //     number,
//   //     week
//   //   )
//   //   VALUES (?, ?, ?, ?, ?, ?, ?)
//   //     `;
//   //
//   //   for (const entry of syllabusEntries) {
//   //     const {
//   //       topicName,
//   //       lessonUnit,
//   //       expectedResults,
//   //       methodsAndWorkForms,
//   //       number,
//   //       week,
//   //     } = entry;
//   //     const entryValues = [
//   //       syllabusId,
//   //       topicName,
//   //       lessonUnit,
//   //       expectedResults,
//   //       methodsAndWorkForms,
//   //       number,
//   //       week,
//   //     ];
//   //     await this.database.executeSql(entryQuery, entryValues);
//   //   }
//   // }
//
//   public static async addSyllabus(syllabus: Syllabus): Promise<number> {
//     await DatabaseService.init();
//     return new Promise<number>((resolve, reject) => {
//       DatabaseService.database.transaction(tx => {
//         tx.executeSql(
//           'INSERT INTO syllabus (subject, class) VALUES (?, ?)',
//           [syllabus.subject, syllabus.class],
//           (_, result) => {
//             const insertId = result.insertId;
//             const promises = syllabus.syllabusEntries.map(entry =>
//               tx.executeSql(
//                 'INSERT INTO syllabus_entry (topic_name, lesson_unit, expected_results, methods_and_work_forms, number, week, syllabus_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
//                 [
//                   entry.topicName,
//                   entry.lessonUnit,
//                   entry.expectedResults,
//                   entry.methodsAndWorkForms,
//                   entry.number,
//                   entry.week,
//                   insertId,
//                 ],
//               ),
//             );
//             Promise.all(promises)
//               .then(() => resolve(insertId))
//               .catch(reject);
//           },
//           reject,
//         );
//       });
//     });
//   }
// }
