import { Storage } from '@google-cloud/storage';

const storage = new Storage();

async function createBucket() {
  // Creates the new bucket
//   await storage.createBucket(bucketName);
//   console.log(`Bucket ${bucketName} created.`);
}

createBucket().catch(console.error);