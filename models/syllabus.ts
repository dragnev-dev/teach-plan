export interface Syllabus {
  subject: string;
  class: number;
  syllabusEntries: SyllabusEntry[];
  secondTermStartEntry?: number;
  year: number;
  version: number;
}

export interface SyllabusEntry {
  topicName: string;
  lessonUnit: string;
  expectedResults: string;
  methodsAndWorkForms: string;
  number: number;
  week: number;
}

export function createBlankSyllabusEntry(number: number): SyllabusEntry {
  return {
    topicName: '-',
    lessonUnit: '-',
    expectedResults: '-',
    methodsAndWorkForms: '-',
    number,
    week: Math.floor(number / 2),
  };
}
