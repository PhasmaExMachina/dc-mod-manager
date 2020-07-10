const fs = require('fs'),
      path = require('path'),
      existingVersion = require('../src/version.json'),
      {execSync} = require('child_process')

const versionName = fs.readFileSync(path.join(__dirname, '../android/app/build.gradle'), 'utf8').match(/versionName "(\d+\.\d+\.\d+)"/)[1]
if(existingVersion !== versionName) {
  fs.writeFileSync(path.join(__dirname, '../src/version.json'), JSON.stringify(versionName))
  execSync(`git add src/version.json && git commit -m "Set app version to v${versionName}"`,
    {stdio: 'inherit'}
  )
}