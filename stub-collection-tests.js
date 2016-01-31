// Write your tests here!
// Here is an example.
Tinytest.add('stub-collection: can create new stub collection', function(test) {
  var TestCollection = new StubCollection();
  test.isTrue(_.isObject(TestCollection));
});

Tinytest.add('stub-collection: _setItems updates the collection\'s items', function(test) {
  var TestCollection = new StubCollection();
  TestCollection._setItems([{name: 'item 1'}, {name: 'item 2'}]);
  test.equal(TestCollection._items.length, 2);
});

Tinytest.add('stub-collection: insert() returns a mongo id and adds the item to the _items list', function(test) {
  var TestCollection = new StubCollection();
  var item = {name: 'test insert item', numericAttribute: 42};
  var id = TestCollection.insert(item);
  item._id = id;
  test.equal(TestCollection._items[0], item);
});

Tinytest.add('stub-collection: find() returns a \'cursor\' with a functional fetch()', function(test) {
  var TestCollection = new StubCollection();
  TestCollection._setItems([
    {name: 'item 1', numericAttribute: 1},
    {name: 'item 2', numericAttribute: 2},
    {name: 'item 3', numericAttribute: 1}
  ]);

  test.equal(TestCollection.find({numericAttribute: 1}).fetch(), [
    {name: 'item 1', numericAttribute: 1},
    {name: 'item 3', numericAttribute: 1}
  ]);
});

Tinytest.add('stub-collection: find() returns a \'cursor\' with a functional forEach()', function(test) {
  var TestCollection = new StubCollection();
  TestCollection._setItems([
    {name: 'item 1', numericAttribute: 1},
    {name: 'item 2', numericAttribute: 2},
    {name: 'item 3', numericAttribute: 1}
  ]);
  var resultantNames = [];
  TestCollection.find({numericAttribute: 1}).forEach(function(res) {
    resultantNames.push(res.name);
  });

  test.equal(resultantNames, ['item 1', 'item 3']);
});

/* Tests for $in */
Tinytest.add('stub-collection: matchDollarIn matches matching items', function(test) {
  var item = {attr1: 'attr1', attr2: false};
  var key = 'attr1';
  var value = ['attr4', 'attr1'];
  test.isTrue(matchDollarIn(item, key, value));
  test.isFalse(matchDollarIn(item, key, ['attr5', true, 3]));
});

Tinytest.add('stub-collection: matchAttributeOnItem correctly pulls apart $in param', function(test) {
  var item = {attr1: 'attr1', attr2: false};
  var key = 'attr1';
  var value = {$in: ['attr4', 'attr1']};
  test.isTrue(matchAttributeOnItem(item, key, value));
  test.isFalse(matchAttributeOnItem(item, key, {$in: ['attr5', true, 3]}));
});

Tinytest.add('stub-collection: find() matches $in on attributes', function(test) {
  var TestCollection = new StubCollection();
  TestCollection._setItems([
    {name: 'item 1', numericAttribute: 1},
    {name: 'item 2', numericAttribute: 2},
    {name: 'item 3', numericAttribute: 1}
  ]);
  var resultantNames = [];
  TestCollection.find({name: {$in: ['item 1', 'item 3']}}).forEach(function(res) {
    resultantNames.push(res.name);
  });

  test.equal(resultantNames, ['item 1', 'item 3']);
});

Tinytest.add('stub-collection: find() matches $gte on attributes', function(test) {
  var TestCollection = new StubCollection();
  TestCollection._setItems([
    {name: 'item 1', numericAttribute: 1},
    {name: 'item 2', numericAttribute: 5},
    {name: 'item 3', numericAttribute: 3},
    {name: 'item 4', numericAttribute: 4}
  ]);
  var resultantNames = [];
  TestCollection.find({numericAttribute: {$gte: 4}}).forEach(function(res) {
    resultantNames.push(res.name);
  });

  test.equal(resultantNames, ['item 2', 'item 4']);
});

Tinytest.add('stub-collection: find() matches $lte on attributes', function(test) {
  var TestCollection = new StubCollection();
  TestCollection._setItems([
    {name: 'item 1', numericAttribute: 1},
    {name: 'item 2', numericAttribute: 5},
    {name: 'item 3', numericAttribute: 3},
    {name: 'item 4', numericAttribute: 4}
  ]);
  var resultantNames = [];
  TestCollection.find({numericAttribute: {$lte: 3}}).forEach(function(res) {
    resultantNames.push(res.name);
  });

  test.equal(resultantNames, ['item 1', 'item 3']);
});

Tinytest.add('stub-collection: find() matches $gt on attributes', function(test) {
  var TestCollection = new StubCollection();
  TestCollection._setItems([
    {name: 'item 1', numericAttribute: 1},
    {name: 'item 2', numericAttribute: 5},
    {name: 'item 3', numericAttribute: 3},
    {name: 'item 4', numericAttribute: 4}
  ]);
  var resultantNames = [];
  TestCollection.find({numericAttribute: {$gt: 4}}).forEach(function(res) {
    resultantNames.push(res.name);
  });

  test.equal(resultantNames, ['item 2']);
});

Tinytest.add('stub-collection: find() matches $lt on attributes', function(test) {
  var TestCollection = new StubCollection();
  TestCollection._setItems([
    {name: 'item 1', numericAttribute: 1},
    {name: 'item 2', numericAttribute: 5},
    {name: 'item 3', numericAttribute: 3},
    {name: 'item 4', numericAttribute: 4}
  ]);
  var resultantNames = [];
  TestCollection.find({numericAttribute: {$lt: 3}}).forEach(function(res) {
    resultantNames.push(res.name);
  });

  test.equal(resultantNames, ['item 1']);
});

Tinytest.add('stub-collection: findOne() with no arguments returns the first found item', function(test) {
  var TestCollection = new StubCollection();
  var item = {name: 'test item', numericAttribute: 42};
  TestCollection._setItems([item]);
  test.equal(TestCollection.findOne(), item);
});

Tinytest.add('stub-collection: findOne() with a selector argument returns the first matching item', function(test) {
  var TestCollection = new StubCollection();
  var item1 = {name: 'test 1', numericAttribute: 41};
  var item2 = {name: 'test 2', numericAttribute: 42};
  var item3 = {name: 'test 3', numericAttribute: 42};
  TestCollection._setItems([item1, item2, item3]);
  test.equal(TestCollection.findOne({numericAttribute: 42}), item2);
});

Tinytest.add('stub-collection: findOne() with a string argument returns the item with a matching id', function(test) {
  var TestCollection = new StubCollection();
  var item = {_id: 'abc123', name: 'test item', numericAttribute: 42};
  TestCollection._setItems([item]);
  test.equal(TestCollection.findOne('abc123'), item);
});

Tinytest.add('stub-collection: findOne() matching no elements returns undefined', function(test) {
  var TestCollection = new StubCollection();
  test.isUndefined(TestCollection.findOne());
});

Tinytest.add('stub-collection: findOne() with a selector dot notation string returns the matching element', function(test) {
  var TestCollection = new StubCollection();
  var item = {_id: 'abc123', names: { firstName: 'Bob', lastName: 'Bobstein' }, numericAttribute: 42};
  TestCollection._setItems([item]);
  test.equal(TestCollection.findOne({'names.firstName': 'Bob'}), item);
});

Tinytest.add('stub-collection: findOne() with a two part selector dot notation string returns the matching element', function(test) {
  var TestCollection = new StubCollection();
  var item = {_id: 'abc123', names: { firstName: 'Bob', lastName: 'Bobstein' }, numericAttribute: 42};
  TestCollection._setItems([item]);
  test.equal(TestCollection.findOne({'names.firstName': 'Bob', 'names.lastName': 'Bobstein'}), item);
});

Tinytest.add('stub-collection: findOne() with a selector dot notation string and matches $gte on attributes', function(test) {
  var TestCollection = new StubCollection();
  var item = {_id: 'abc123', names: { firstName: 'Bob', lastName: 'Bobstein' }, numericAttribute: { upper: 42 }};
  TestCollection._setItems([item]);
  test.equal(TestCollection.findOne({'numericAttribute.upper' : {$gte: 30}}), item);
});

Tinytest.add('stub-collection: update() with a selector argument updates matching items', function(test) {
  var TestCollection = new StubCollection();
  TestCollection._setItems([
    {name: 'test 1', numericAttribute: 41},
    {name: 'test 2', numericAttribute: 42},
    {name: 'test 3', numericAttribute: 42}
  ]);
  TestCollection.update({numericAttribute: 42}, {$set: {numericAttribute: 41}});
  test.isTrue(_.every(_.map(TestCollection._items, function(item) {
    return item.numericAttribute === 41;
  })));
});

Tinytest.add('stub-collection: update() with a string argument updates the item with a matching id', function(test) {
  var TestCollection = new StubCollection();
  TestCollection._setItems([
    {_id: 'abc123', name: 'test 1', numericAttribute: 41},
    {_id: 'def456', name: 'test 2', numericAttribute: 42},
    {_id: 'ghi789', name: 'test 3', numericAttribute: 42}
  ]);
  TestCollection.update('abc123', {$set: {numericAttribute: 42}});
  test.isTrue(_.every(_.map(TestCollection._items, function(item) {
    return item.numericAttribute === 42;
  })));
});

Tinytest.add('stub-collection: update() can apply $unset as well as $set', function(test) {
  var TestCollection = new StubCollection();
  TestCollection._setItems([
    {_id: 'abc123', name: 'test 1', numericAttribute: 41},
    {_id: 'def456', name: 'test 2', numericAttribute: 42},
    {_id: 'ghi789', name: 'test 3', numericAttribute: 42}
  ]);
  TestCollection.update({}, {$set: {numericAttribute: 18}, $unset: {name: '1'}});
  test.isTrue(_.every(_.map(TestCollection._items, function(item) {
    return _.isUndefined(item.name) && item.numericAttribute === 18;
  })));
});

Tinytest.add('stub-collection: remove() removes record with matching id', function(test) {
  var TestCollection = new StubCollection();
  TestCollection._setItems([
    {_id: 'abc123', name: 'test 1', numericAttribute: 41},
    {_id: 'def456', name: 'test 2', numericAttribute: 42},
    {_id: 'ghi789', name: 'test 3', numericAttribute: 42}
  ]);
  TestCollection.remove('def456');
  test.equal(TestCollection._items.length, 2);
  test.isUndefined(TestCollection.findOne('def456'));
});
