#!/usr/bin/env node

// Validate JSON against schema.

var fs = require('fs');
var path = require('path');
var util = require('util');

console.log(__dirname);

var jsonSchemaPath = __dirname + path.sep + 'jsonSchemaDraft04.json';

var Validator = require('jsonschema').Validator;

var validate = function (schemas, instance) {
  var v = new Validator();

  schemas.forEach(function (schema) {
    v.addSchema(schema);
  });

  return v.validate(instance, schemas[0]);
};

var argv = require('minimist')(process.argv.slice(2));

var jsonPath = argv.d;
var schemaPaths = [argv.s].concat(argv._) || [];

if (!argv.s || !argv.s.length) {
  console.log('USAGE: ' + process.argv[1] + ' -d <jsonPath> -s <schemaPath> [...]');
  process.exit(1);
}

console.log('Validating' + ' ' + jsonPath +  ' ' + 'against' + ' ' + schemaPaths.length +
  ' ' + 'schemas.');

// Load JSON draft 04 schema from filesystem.
var jsonSchema = JSON.parse(fs.readFileSync(jsonSchemaPath, {encoding: 'utf8'}));

// Load user-specified schemas from filesystem.
var schemas = schemaPaths.map(function (path) {
  return JSON.parse(fs.readFileSync(path, {encoding: 'utf8'}));
});

console.log('\n', 'Validating JSON reference schemas against v4 draft.', '\n');

// Validate user-specified schemas against the JSON schema draft to make sure they're valid.
var errors = schemas.map(function (schema) {
  var results = validate([jsonSchema], schema);

  console.log(util.inspect(results, null));

  return results.errors.length;
}).filter (function (errorCount) {
  return errorCount > 0;
});

if (errors.length > 0) {
  console.log('One or more schemas failed validation.');
  process.exit(1);
}

console.log('All schemas passed validation');

if (! argv.d) {
  process.exit(0);
}

console.log('\n', 'Validating instance against schema', '\n');

// Now validate the user-specified instance against the schemas.
var json = JSON.parse(fs.readFileSync(jsonPath, {encoding: 'utf8'}));

var jsonErrors = validate(schemas, json);

console.log(util.inspect(jsonErrors, null));
