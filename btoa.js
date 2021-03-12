/*to run:
node btoa.js file.txt*/

const fs = require('fs');

var args = process.argv.slice(2);

try {
  const data = fs.readFileSync(args[0], 'utf8');
  const b64data = Buffer.from(data).toString('base64');
  try {
    const data = fs.writeFileSync('b64.txt', b64data);
    //file written successfully
  } catch (err) {
    console.error(err)
  }
} catch (err) {
  console.error(err)
}