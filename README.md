This module provides a simple command line interface to Tom de Grunt's
[JSON schema validator](https://github.com/tdegrunt/jsonschema).

Usage is simple:

```shell
validateJson.js -d <jsonPath> -s <schemaPath> [...]
```

The module will validate all provided schemas against JSON Schema v4, then validate the given JSON
file against all the schemas. The output from the validator will be shown, including any errors
during validation.

