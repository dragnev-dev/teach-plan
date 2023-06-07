// Represents the serialized entity for the whole schedule.
// classes: StudentClassSchedule[] the classes in the school (1a, 1b... 12z)
// year
// term

export interface Schedule {
  id: number;
  classes: StudentClassSchedule[];
  year: number;
  term: number;
  termBegin: string;
  termEnd: string;
  version: number;
  nonSchoolDays: {[key: string]: string};
}

// Represents the schedule of one class
// class: number the classes in the school (1, 2, ... 12 in Bulgarian school system)
// subclass: string a property specific for the Bulgarian school system. the subclass of that class (a, b, ...)
// days: SchoolDay[] schedule for one day of the week
// nonSchoolDays?: string[] non-school days specific for this class
// termEnd?: string term end specific for this class
export interface StudentClassSchedule {
  class: number;
  termEndDate?: string;
  subclass?: string;
  days: ScheduleSchoolDay[];
  nonSchoolDays?: {[key: string]: string};
}

// Represents the schedule for one day
// number: number day of the week (1-5)
// hours: SchoolHour[] the school hour (class)
export interface ScheduleSchoolDay {
  number: number;
  hours: SchoolHour[];
}

// Represents the schedule for one day
// subject: string subject name
// teachers: string[] an array of the teachers
export interface SchoolHour {
  subject: string;
  teachers: string[];
}
