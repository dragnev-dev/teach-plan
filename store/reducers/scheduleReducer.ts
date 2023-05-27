import {
  Schedule,
  SchoolHour,
  StudentClassSchedule,
} from '../../models/schedule';
import {ActionTypes} from '../actions/actionTypes';
import {AddScheduleAction} from '../actions/actionCreators';
import {Syllabus} from '../../models/syllabus';
import {TeacherScheduleEntry} from '../../models/teacherScheduleEntry';

interface ScheduleState {
  schoolSchedule: Schedule;
  teacherName: string;
  // to keep things serializable
  // an index signature to define the shape of the map and string to store date
  teacherSchedule: {[key: string]: TeacherScheduleEntry[]};
  // todo: nonSchoolDays kv pairs
  // key - date, value - reason
  // reason enum
}

const initialState: ScheduleState = {
  schoolSchedule: {
    id: 0,
    classes: [],
    term: 0,
    termBegin: '01.01.1970',
    termEnd: '01.01.1970',
    version: 0,
    year: 1970,
    nonSchoolDays: {},
  },
  teacherName: '',
  teacherSchedule: {},
};

// Reducer
const scheduleReducer = (
  state = initialState,
  action: AddScheduleAction,
): ScheduleState => {
  switch (action.type) {
    case ActionTypes.ADD_SCHEDULE:
      let newTeacherSchedule = getWeeklySchedule(
        action.payload.teacherName,
        action.payload.schedule,
        action.payload.syllabuses,
      );

      let tScheduleAsObj: {[key: string]: TeacherScheduleEntry[]} = {};
      newTeacherSchedule.forEach((value, key) => {
        tScheduleAsObj[key] = value;
      });
      return {
        ...state,
        schoolSchedule: action.payload.schedule,
        teacherName: action.payload.teacherName,
        teacherSchedule: tScheduleAsObj,
      };
    // case ActionTypes.UPDATE_TEACHER_SCHEDULE:
    //   let newTeacherSchedule = getWeeklySchedule(
    //     state.teacherName,
    //     state.schoolSchedule,
    //     action.payload,
    //   );
    //
    //   let tScheduleAsObj: {[key: string]: TeacherScheduleEntry[]} = {};
    //   newTeacherSchedule.forEach((value, key) => {
    //     tScheduleAsObj[key] = value;
    //   });
    //   return {
    //     ...state,
    //     teacherSchedule: tScheduleAsObj,
    //   };
    default:
      return state;
  }
};

export default scheduleReducer;

export function getScheduleByDate(
  state: ScheduleState,
  date: string,
): TeacherScheduleEntry[] | undefined {
  return state.teacherSchedule[date];
}

export function getSchoolHourForDate(
  state: ScheduleState,
  date: string,
  schoolHour: number,
): TeacherScheduleEntry | undefined {
  const schoolHours = state.teacherSchedule[date];

  if (!schoolHours) {
    return undefined;
  }

  const matchingSchoolHour = schoolHours.find(
    schoolHourObj => schoolHourObj.schoolHour === schoolHour,
  );

  return matchingSchoolHour;
}

// import { useSelector } from 'react-redux';
// import { getClassScheduleForDay } from './scheduleReducer';
//
// const MyClassSchedule = ({ classNum, subclass, dayNum }) => {
//   const classSchedule = useSelector(state => getClassScheduleForDay(state.schedule, classNum, subclass, dayNum));
//
//   if (!classSchedule) {
//     return <div>No schedule found for class {classNum} {subclass} on day {dayNum}</div>;
//   }
//
//   return (
//     <ul>
//       {classSchedule.map(hour => (
//           <li key={hour.subject}>{hour.subject} ({hour.teachers.join(', ')})</li>
//         ))}
//     </ul>
//   );
// };

function getWeeklySchedule(
  teacher: string,
  schedule: Schedule,
  syllabuses: Syllabus[],
): Map<string, TeacherScheduleEntry[]> {
  const startDate = new Date(schedule.termBegin);
  const endDate = new Date(schedule.termEnd);
  const syllabusesMap = new Map(
    syllabuses.map(syllabus => [syllabus.class, syllabus.syllabusEntries]),
  );
  const dailySchedule: Map<string, TeacherScheduleEntry[]> = new Map<
    string,
    TeacherScheduleEntry[]
  >();

  let counters = getCounters(schedule.classes);

  for (
    let date = startDate;
    date <= endDate;
    date.setDate(date.getDate() + 1)
  ) {
    const schoolDay = findSchoolDay(schedule, date);
    const dailyScheduleEntry: TeacherScheduleEntry[] = [];
    schoolDay.forEach(({class: classNumber, subclass, schoolHours}) => {
      for (
        let schoolHourIndex = 0;
        schoolHourIndex < schoolHours.length;
        schoolHourIndex++
      ) {
        const schoolHour = schoolHours[schoolHourIndex];
        if (schoolHour.teachers.includes(teacher)) {
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
            syllabusEntry: syllabusEntry!,
          });
          counters[classNumber][subclass!]++;
        }
      }
    });

    if (dailyScheduleEntry.length > 0) {
      dailySchedule.set(date.toDateString(), dailyScheduleEntry);
    }
  }

  return dailySchedule;
}

function findSchoolDay(
  schedule: Schedule,
  date: Date,
): {class: number; subclass: string | undefined; schoolHours: SchoolHour[]}[] {
  var schoolDay = schedule.classes.flatMap(function (classSchedule) {
    var _a, _b;
    var classNumber = classSchedule.class,
      subclass = classSchedule.subclass,
      days = classSchedule.days;
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
      const count = scheduleItems.filter(
        item => item.class === classValue && item.subclass === subclassValue,
      ).length;
      classCounters[subclassValue] = count;
    });
    counters[classValue.toString()] = classCounters;
  });

  return counters;
}
