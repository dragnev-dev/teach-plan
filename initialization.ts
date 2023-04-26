import {container} from 'tsyringe';
import DatabaseInitializationService from './services/databaseInitialization.service';
import SyllabusService from './services/syllabus.service';

export async function initialize(): Promise<void> {
  // Register dependencies
  console.log('initializing...');
  await container.register(DatabaseInitializationService, {
    useClass: DatabaseInitializationService,
  });
  await container.register(SyllabusService, {
    useClass: SyllabusService,
  });
  container.resolve(DatabaseInitializationService);
}
