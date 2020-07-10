const fs = require('fs'),
      path = require('path')

const versionName = fs.readFileSync(path.join(__dirname, '../android/app/build.gradle'), 'utf8').match(/versionName "(\d+\.\d+\.\d+)"/)[1]
fs.writeFileSync(path.join(__dirname, '../src/version.json'), JSON.stringify(versionName))