export interface Schedule {
  classes: Class[];
}

export interface Class {
  name: string;
  days: Day[];
}

export interface Day {
  number: number;
  hours: Hour[];
}

export interface Hour {
  subject: string;
  teachers: string[];
}
