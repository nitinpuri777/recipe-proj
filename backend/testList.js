import sequelize from './models/sequelize.js';
import List from './models/list.js';

async function testCreateList() {
  try {
    await sequelize.sync();
    const list = await List.createListForUser(1); // Assumed 1 is a valid userId
    console.log(list);
  } catch (error) {
    console.error('Failed to create list:', error);
  }
}

testCreateList();
