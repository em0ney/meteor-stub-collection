Package.describe({
  name: 'em0ney:stub-collection',
  version: '0.1.3',
  summary: 'A class to stub out your collections when writing unit tests',
  git: 'git@github.com:em0ney/meteor-stub-collection.git',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');
  api.use([
    'ecmascript@0.1.5',
    'underscore',
    'random'
  ]);

  api.addFiles([
    'match-items.js',
    'stub-collection.js'
  ]);

  api.export('StubCollection');
});

Package.onTest(function(api) {
  api.use(['tinytest', 'ecmascript@0.1.5', 'underscore', 'random']);
  api.addFiles([
    'match-items.js',
    'stub-collection.js'
  ]);
  api.addFiles('stub-collection-tests.js');
});
