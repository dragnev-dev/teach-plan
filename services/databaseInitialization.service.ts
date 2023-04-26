import {initDatabase} from '../utils/database';

// @singleton()
export default class DatabaseInitializationService {
  constructor() {
    this.initialize();
  }
  private async initialize(): Promise<void> {
    await initDatabase();
  }
}
