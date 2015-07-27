# em0ney:stub-collection

This package is used to stub out collections in your unit tests.

Writing tinytests is a lot quicker than writing unit tests in velocity.  Bundling your application logic into smart packages is also a good practice.  This package enables you to easily stub collection by collection and mock mongo queries.

## Utilization

Add `em0ney:stub-collection` as a dependency for your package inside the `Package.onTest` function.

See example in this package.js file:
```javascript
Package.describe({
  name: 'your-package',
  version: '0.0.1',
  summary: 'Example of your package.js file',
  documentation: 'README.md'
});

// package source and exported namespaces go here
Package.onUse(function(api) {
  api.use([
   'underscore',
   'mongo',
   'aldeed:simple-schema',
   'aldeed:autoform'
  ]);
  api.addFiles([
    'logic.js'
  ]);
});

// package test dependencies and source goes here
Package.onTest(function(api) {
  // add package dependencies
  api.use([
    'em0ney:stub-collection',
    'tinytest',
    'underscore'
  ]);

  // add stubs
  api.addFiles('tests/test_stubs.js');

  api.addFiles([
    'logic.js'
  ], 'server');

  // and link to the unit tests for server methods
  api.addFiles([
    'tests/test_logic.js'
  ], 'server');
});
```

## Usage

1. Add a stub for your collection where you define your stubs, or in your test case `TestCollection = new StubCollection()`
1. Initialize the collection with test data, using the `TestCollection._setItems()` function
1. Call the code in your system under test (SUT)
1. Verify results using `find`, `findOne` or `_items`

Here is an example from this package's own test suite.

```javascript
Tinytest.add('stub-collection: findOne() with a selector argument returns the first matching item', function(test) {
  var TestCollection = new StubCollection();
  var item1 = {name: 'test 1', numericAttribute: 41};
  var item2 = {name: 'test 2', numericAttribute: 42};
  var item3 = {name: 'test 3', numericAttribute: 42};
  TestCollection._setItems([item1, item2, item3]);
  test.equal(TestCollection.findOne({numericAttribute: 42}), item2);
});
```

## To-Do/Unsupported

* `$gt/e` operator on fields
* `$lt/e` operator on fields
* `$and` operator in selectors
* `$or` operator in selectors
* `$elemMatch` operator in selectors
