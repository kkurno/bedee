import seedData from './seed-data';
import dropDatabase from './drop-database';

async function run() {
  switch (process.env.SCRIPT_NAME) {
    case 'seed-data':
      await seedData();
      break;
    case 'drop-database':
      await dropDatabase();
      break;
    default:
      throw new Error('NO SUCH A SCRIPT!');
  }
}

run();
