const fs = require('fs');
const IncomingForm = require('formidable').IncomingForm;

const readFile = function (req, res, next) {
  const form = new IncomingForm();
  let data;
  form.on('file', (field, file) => data = JSON.parse(fs.readFileSync(file.path, 'utf8')));
  form.on('end', () => {
    req.fileData = data;
    next();
  });
  form.parse(req);
}

module.exports = readFile;
