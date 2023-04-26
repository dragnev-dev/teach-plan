import {Syllabus} from '../models/syllabus';
import {
  addSyllabus,
  getAllSyllabuses,
  getSyllabusAndEntries,
} from '../utils/database';

export default class SyllabusService {
  constructor() {}
  addSyllabus = async (syllabus: Syllabus): Promise<number> => {
    return await addSyllabus(syllabus);
  };
  getSyllabus = async (id: number): Promise<Syllabus> => {
    return await getSyllabusAndEntries(id);
  };
  getAllSyllabuses = async (): Promise<Syllabus[]> => {
    return await getAllSyllabuses();
  };
}
