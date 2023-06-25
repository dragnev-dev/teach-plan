import {
  Schedule,
  SchoolHour,
  StudentClassSchedule,
  Term,
} from '../../models/schedule';
import {ActionTypes} from '../actions/actionTypes';
import {AddScheduleAction} from '../actions/actionCreators';
import {Syllabus} from '../../models/syllabus';
import {TeacherScheduleEntry} from '../../models/teacherScheduleEntry';
import {SchoolDay} from '../../models/schoolDay';

interface ScheduleState {
  schoolSchedule: Schedule;
  teacherName: string;
  // to keep things serializable
  // an index signature to define the shape of the map and string to store date
  teacherSchedule: {[key: string]: SchoolDay};
  maximumSchoolHoursPerDay: number;
}

const initialState: ScheduleState = {
  schoolSchedule: {
    terms: [],
    version: 0,
    year: 1970,
    nonSchoolDays: {},
  },
  teacherName: '',
  teacherSchedule: {},
  maximumSchoolHoursPerDay: 7,
};

// Reducer
const scheduleReducer = (
  state = initialState,
  action: AddScheduleAction,
): ScheduleState => {
  switch (action.type) {
    case ActionTypes.ADD_SCHEDULE:
      const [newTeacherSchedule, maximumSchoolHoursPerDay] = getWeeklySchedule(
        action.payload.teacherName,
        action.payload.schedule,
        action.payload.syllabuses,
      );

      let tScheduleAsObj: {[key: string]: SchoolDay} = {};
      newTeacherSchedule.forEach((value, key) => {
        tScheduleAsObj[key] = value;
      });
      return {
        ...state,
        schoolSchedule: action.payload.schedule,
        teacherName: action.payload.teacherName,
        teacherSchedule: tScheduleAsObj,
        maximumSchoolHoursPerDay,
      };
    default:
      return state;
  }
};

export default scheduleReducer;

export function getScheduleByDate(
  state: ScheduleState,
  date: string,
): SchoolDay | undefined {
  return state.teacherSchedule[date];
}

export function getMaximumSchoolHoursPerDay(state: ScheduleState): number {
  return state.maximumSchoolHoursPerDay;
}

export function getScheduleForWeek(
  state: ScheduleState,
  keys: string[],
): SchoolDay[] {
  let vals: SchoolDay[] = [];
  for (const key of keys) {
    vals.push(state.teacherSchedule[new Date(`${key}`).toDateString()]);
  }
  return vals;
}

export function getScheduleByMonth(
  state: ScheduleState,
  year: number,
  month: number,
  daysInMonth: number,
): SchoolDay[] {
  let vals: SchoolDay[] = [];
  for (let day = 1; day <= daysInMonth; day++) {
    vals.push(
      state.teacherSchedule[new Date(`${year}-${month}-${day}`).toDateString()],
    );
  }
  return vals;
}

export function getSchoolHourForDate(
  state: ScheduleState,
  date: string,
  schoolHour: number,
): TeacherScheduleEntry | undefined {
  const schoolDay: SchoolDay = state.teacherSchedule[date];

  if (!schoolDay) {
    return undefined;
  }

  return schoolDay.entries.find(
    schoolHourObj => schoolHourObj.schoolHour === schoolHour,
  );
}

function getClassSpecificNonSchoolDays(schedule: StudentClassSchedule[]): {
  [key: string]: {[key: string]: string};
} {
  const nonSchoolDaysMap: {[key: string]: {[key: string]: string}} = {};

  for (const classSchedule of schedule) {
    const classNumber = classSchedule.class;
    const nonSchoolDays = classSchedule.nonSchoolDays;

    if (nonSchoolDays) {
      for (const [dateString, reason] of Object.entries(nonSchoolDays)) {
        // Get the array of non-school days for this class number
        let subMap: {[key: string]: string} | undefined =
          nonSchoolDaysMap[classNumber];
        if (!subMap) {
          subMap = {};
        }
        // Add the current non-school day to the array
        subMap[dateString] = reason;
        nonSchoolDaysMap[classNumber] = subMap;
      }
    }
  }
  return nonSchoolDaysMap;
}

function getDateString(date: Date): string {
  const localDateString = date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  // Format with substring to YYYY-MM-DD
  return (
    localDateString.substring(6, 10) +
    '-' +
    localDateString.substring(0, 2) +
    '-' +
    localDateString.substring(3, 5)
  );
}

function getWeeklySchedule(
  teacher: string,
  schedule: Schedule,
  syllabuses: Syllabus[],
): [Map<string, SchoolDay>, number] {
  const syllabusesMap = new Map(
    syllabuses.map(syllabus => [syllabus.class, syllabus.syllabusEntries]),
  );
  let maximumSchoolHoursPerDay = 0;
  const dailySchedule: Map<string, SchoolDay> = new Map<string, SchoolDay>();

  let counters = getCounters(schedule.terms[0].classes);
  for (const term of schedule.terms) {
    const startDate: Date = new Date(term.termBegin);
    let endDate: Date = new Date(term.termEnd);
    const classSpecificNonSchoolDays: {[key: string]: {[key: string]: string}} =
      getClassSpecificNonSchoolDays(term.classes);

    for (
      let date = startDate;
      date <= endDate;
      date.setDate(date.getDate() + 1)
    ) {
      let schoolDay: SchoolDay = {entries: []};
      let nonSchooledReason: string | undefined =
        schedule.nonSchoolDays[getDateString(date)];
      if (nonSchooledReason) {
        schoolDay.nonSchoolingDay = {
          isNonSchooling: true,
          reason: nonSchooledReason,
        };
        dailySchedule.set(date.toDateString(), schoolDay);
        continue;
      }
      const classesForTheDate = findSchoolDay(term, date);
      const dailyScheduleEntry: TeacherScheduleEntry[] = [];
      classesForTheDate.forEach(
        ({class: classNumber, subclass, schoolHours}) => {
          for (
            let schoolHourIndex = 0;
            schoolHourIndex < schoolHours.length;
            schoolHourIndex++
          ) {
            const schoolHour = schoolHours[schoolHourIndex];
            if (schoolHour.teachers.includes(teacher)) {
              let classSpecificNonSchoolDs =
                classSpecificNonSchoolDays[classNumber];
              if (classSpecificNonSchoolDs) {
                let nonSchoolingDay =
                  classSpecificNonSchoolDs[getDateString(date)];

                if (nonSchoolingDay) {
                  dailyScheduleEntry.push({
                    class: classNumber,
                    subclass: subclass!,
                    subject: schoolHour.subject,
                    schoolHour: schoolHourIndex + 1,
                    isNonSchoolHour: {
                      isNonSchooling: true,
                      reason: nonSchoolingDay,
                    },
                  });
                  continue;
                }
              }
              const syllabusEntries = syllabusesMap.get(classNumber) ?? [];
              const syllabusEntry = syllabusEntries.find(
                entry =>
                  entry.number ===
                  (syllabusEntries.length === 0
                    ? 0
                    : counters[classNumber][subclass!]),
              );

              dailyScheduleEntry.push({
                class: classNumber,
                subclass: subclass!,
                subject: schoolHour.subject,
                schoolHour: schoolHourIndex + 1,
                syllabusEntry: syllabusEntry,
              });

              if (schoolHourIndex + 1 > maximumSchoolHoursPerDay) {
                maximumSchoolHoursPerDay = schoolHourIndex + 1;
              }

              counters[classNumber][subclass!]++;
            }
          }
        },
      );

      if (dailyScheduleEntry.length > 0) {
        schoolDay.entries = dailyScheduleEntry;
        dailySchedule.set(date.toDateString(), schoolDay);
      }
    }
  }

  return [dailySchedule, maximumSchoolHoursPerDay];
}

function findSchoolDay(
  term: Term,
  date: Date,
): {class: number; subclass: string | undefined; schoolHours: SchoolHour[]}[] {
  const schoolDay: {
    schoolHours: any;
    subclass: string | undefined;
    class: number;
  }[] = term.classes.flatMap(function (classSchedule) {
    let _a, _b;
    const classNumber = classSchedule.class,
      subclass = classSchedule.subclass,
      termEndDate = classSchedule.termEndDate,
      days = classSchedule.days;
    // Calculate the end date for the class
    let endDate: Date;
    if (termEndDate) {
      // TODO: don't parse termEndDate to Date n times, parse it in advance and parse it only once
      endDate = new Date(termEndDate);
      // If the given date is after the end date of the class, return an empty array
      if (date > endDate) {
        return [];
      }
    }
    return {
      class: classNumber,
      subclass: subclass,
      schoolHours:
        (_b =
          (_a = days.find(function (day) {
            return day.number === date.getDay();
          })) === null || _a === void 0
            ? void 0
            : _a.hours) !== null && _b !== void 0
          ? _b
          : [],
    };
  });
  return schoolDay;
}

function getCounters(
  scheduleItems: StudentClassSchedule[],
): Record<string, Record<string, number>> {
  // First, we need to find the number of distinct classes and subclasses for each class
  const classSubclasses = new Map<number, Set<string>>();
  for (let item of scheduleItems) {
    const subclassSet = classSubclasses.get(item.class) || new Set();
    subclassSet.add(item.subclass!);
    classSubclasses.set(item.class, subclassSet);
  }

  // Now we can create the 2D array of counters
  const counters: Record<string, Record<string, number>> = {};
  classSubclasses.forEach((subclasses, classValue) => {
    const classCounters: Record<string, number> = {};
    subclasses.forEach(subclassValue => {
      classCounters[subclassValue] = scheduleItems.filter(
        item => item.class === classValue && item.subclass === subclassValue,
      ).length;
    });
    counters[classValue.toString()] = classCounters;
  });

  return counters;
}
