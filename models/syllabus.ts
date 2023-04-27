export interface Syllabus {
  subject: string;
  class: number;
  syllabusEntries: SyllabusEntry[];
}

export interface SyllabusEntry {
  topicName: string;
  lessonUnit: string;
  expectedResults: string;
  methodsAndWorkForms: string;
  number: number;
  week: number;
}