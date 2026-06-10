const fs = require('fs');
const https = require('https');
const path = require('path');
const { execSync } = require('child_process');

const url = 'https://github.com/kmgdz/slap-the-boss/archive/refs/heads/main.zip';
const dest = path.join(__dirname, 'repo.zip');

const file = fs.createWriteStream(dest);
https.get(url, (response) => {
  if (response.statusCode === 302) {
    https.get(response.headers.location, (res) => {
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        execSync('unzip -o repo.zip');
        console.log('Downloaded and extracted');
      });
    });
  } else {
    response.pipe(file);
    file.on('finish', () => {
      file.close();
      execSync('unzip -o repo.zip');
      console.log('Downloaded and extracted');
    });
  }
}).on('error', (err) => {
  fs.unlink(dest);
  console.error(err.message);
});
