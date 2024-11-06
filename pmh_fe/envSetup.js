console.log("SETTING UP ENVIRONMENT VARIABLES");

const fs = require('fs');

fs.copyFile('.env.docker', '.env', (err) => {
  if (err) throw err;
  console.log('.env file was updated successfully');
});