import mongoose from 'mongoose';
import 'dotenv/config';
async function dropIndex() {
  await mongoose.connect(process.env.CONN_STR);

  const collection = mongoose.connection.collection('follows');

  await collection.dropIndex('follower_1');

  console.log('Index dropped');
  process.exit(0);
}

dropIndex();
