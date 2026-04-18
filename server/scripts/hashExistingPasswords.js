/**
 * One-time migration script to hash existing plain-text passwords.
 * Run: node scripts/hashExistingPasswords.js
 */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const User = require('../Models/Person');

async function migrate() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const users = await User.find({});
    console.log(`Found ${users.length} users`);

    let hashed = 0;
    let skipped = 0;

    for (const user of users) {
      // bcrypt hashes start with $2a$ or $2b$
      if (user.password && !user.password.startsWith('$2')) {
        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(user.password, salt);
        await user.save();
        console.log(`  ✔ Hashed password for: ${user.email}`);
        hashed++;
      } else {
        console.log(`  - Skipped (already hashed): ${user.email}`);
        skipped++;
      }
    }

    console.log(`\nMigration complete: ${hashed} hashed, ${skipped} skipped`);
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  }
}

migrate();
