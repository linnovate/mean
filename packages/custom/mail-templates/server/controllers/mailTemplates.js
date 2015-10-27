'use strict';

var path = require('path');
var EmailTemplate = require('email-templates').EmailTemplate;

module.exports = function TemplateRenderer(template, options) {
  var templatePath = path.join(__dirname, '..', 'templates', template);
  return new EmailTemplate(templatePath, options);
};
