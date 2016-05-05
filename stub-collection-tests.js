// Write your tests here!
// Here is an example.
Tinytest.add('stub-collection: can create new stub collection', (test) => {
  let TestCollection = new StubCollection();
  test.isTrue(_.isObject(TestCollection));
});

Tinytest.add('stub-collection: _setItems updates the collection\'s items', (test) => {
  let TestCollection = new StubCollection();
  TestCollection._setItems([{name: 'item 1'}, {name: 'item 2'}]);
  test.equal(TestCollection._items.length, 2);
});

Tinytest.add('stub-collection: insert() returns a mongo id and adds the item to the _items list', (test) => {
  let TestCollection = new StubCollection();
  let item = {name: 'test insert item', numericAttribute: 42};
  let id = TestCollection.insert(item);
  item._id = id;
  test.equal(TestCollection._items[0], item);
});

Tinytest.add('stub-collection: find() returns a \'cursor\' with a functional fetch()', (test) => {
  let TestCollection = new StubCollection();
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

Tinytest.add('stub-collection: find() returns a \'cursor\' with a functional forEach()', (test) => {
  let TestCollection = new StubCollection();
  TestCollection._setItems([
    {name: 'item 1', numericAttribute: 1},
    {name: 'item 2', numericAttribute: 2},
    {name: 'item 3', numericAttribute: 1}
  ]);
  let resultantNames = [];
  TestCollection.find({numericAttribute: 1}).forEach((res) => {
    resultantNames.push(res.name);
  });

  test.equal(resultantNames, ['item 1', 'item 3']);
});

/* Tests for $in */
Tinytest.add('stub-collection: matchDollarIn matches matching items', (test) => {
  let item = {attr1: 'attr1', attr2: false};
  let key = 'attr1';
  let value = ['attr4', 'attr1'];
  test.isTrue(matchDollarIn(item, key, value));
  test.isFalse(matchDollarIn(item, key, ['attr5', true, 3]));
});

Tinytest.add('stub-collection: matchAttributeOnItem correctly pulls apart $in param', (test) => {
  let item = {attr1: 'attr1', attr2: false};
  let key = 'attr1';
  let value = {$in: ['attr4', 'attr1']};
  test.isTrue(matchAttributeOnItem(item, key, value));
  test.isFalse(matchAttributeOnItem(item, key, {$in: ['attr5', true, 3]}));
});

Tinytest.add('stub-collection: find() matches $in on attributes', (test) => {
  let TestCollection = new StubCollection();
  TestCollection._setItems([
    {name: 'item 1', numericAttribute: 1},
    {name: 'item 2', numericAttribute: 2},
    {name: 'item 3', numericAttribute: 1}
  ]);
  let resultantNames = [];
  TestCollection.find({name: {$in: ['item 1', 'item 3']}}).forEach((res) => {
    resultantNames.push(res.name);
  });

  test.equal(resultantNames, ['item 1', 'item 3']);
});

Tinytest.add('stub-collection: find() matches $gte on attributes', (test) => {
  let TestCollection = new StubCollection();
  TestCollection._setItems([
    {name: 'item 1', numericAttribute: 1},
    {name: 'item 2', numericAttribute: 5},
    {name: 'item 3', numericAttribute: 3},
    {name: 'item 4', numericAttribute: 4}
  ]);
  let resultantNames = [];
  TestCollection.find({numericAttribute: {$gte: 4}}).forEach((res) => {
    resultantNames.push(res.name);
  });

  test.equal(resultantNames, ['item 2', 'item 4']);
});

Tinytest.add('stub-collection: find() matches $lte on attributes', (test) => {
  let TestCollection = new StubCollection();
  TestCollection._setItems([
    {name: 'item 1', numericAttribute: 1},
    {name: 'item 2', numericAttribute: 5},
    {name: 'item 3', numericAttribute: 3},
    {name: 'item 4', numericAttribute: 4}
  ]);
  let resultantNames = [];
  TestCollection.find({numericAttribute: {$lte: 3}}).forEach((res) => {
    resultantNames.push(res.name);
  });

  test.equal(resultantNames, ['item 1', 'item 3']);
});

Tinytest.add('stub-collection: find() matches $gt on attributes', (test) => {
  let TestCollection = new StubCollection();
  TestCollection._setItems([
    {name: 'item 1', numericAttribute: 1},
    {name: 'item 2', numericAttribute: 5},
    {name: 'item 3', numericAttribute: 3},
    {name: 'item 4', numericAttribute: 4}
  ]);
  let resultantNames = [];
  TestCollection.find({numericAttribute: {$gt: 4}}).forEach((res) => {
    resultantNames.push(res.name);
  });

  test.equal(resultantNames, ['item 2']);
});

Tinytest.add('stub-collection: find() matches $lt on attributes', (test) => {
  let TestCollection = new StubCollection();
  TestCollection._setItems([
    {name: 'item 1', numericAttribute: 1},
    {name: 'item 2', numericAttribute: 5},
    {name: 'item 3', numericAttribute: 3},
    {name: 'item 4', numericAttribute: 4}
  ]);
  let resultantNames = [];
  TestCollection.find({numericAttribute: {$lt: 3}}).forEach((res) => {
    resultantNames.push(res.name);
  });

  test.equal(resultantNames, ['item 1']);
});

Tinytest.add('stub-collection: findOne() with no arguments returns the first found item', (test) => {
  let TestCollection = new StubCollection();
  let item = {name: 'test item', numericAttribute: 42};
  TestCollection._setItems([item]);
  test.equal(TestCollection.findOne(), item);
});

Tinytest.add('stub-collection: findOne() with a selector argument returns the first matching item', (test) => {
  let TestCollection = new StubCollection();
  let item1 = {name: 'test 1', numericAttribute: 41};
  let item2 = {name: 'test 2', numericAttribute: 42};
  let item3 = {name: 'test 3', numericAttribute: 42};
  TestCollection._setItems([item1, item2, item3]);
  test.equal(TestCollection.findOne({numericAttribute: 42}), item2);
});

Tinytest.add('stub-collection: findOne() with a string argument returns the item with a matching id', (test) => {
  let TestCollection = new StubCollection();
  let item = {_id: 'abc123', name: 'test item', numericAttribute: 42};
  TestCollection._setItems([item]);
  test.equal(TestCollection.findOne('abc123'), item);
});

Tinytest.add('stub-collection: findOne() matching no elements returns undefined', (test) => {
  let TestCollection = new StubCollection();
  test.isUndefined(TestCollection.findOne());
});

Tinytest.add('stub-collection: findOne() with a selector dot notation string returns the matching element', (test) => {
  let TestCollection = new StubCollection();
  let item = {_id: 'abc123', names: { firstName: 'Bob', lastName: 'Bobstein' }, numericAttribute: 42};
  TestCollection._setItems([item]);
  test.equal(TestCollection.findOne({'names.firstName': 'Bob'}), item);
});

Tinytest.add('stub-collection: findOne() with a two part selector dot notation string returns the matching element', (test) => {
  let TestCollection = new StubCollection();
  let item = {_id: 'abc123', names: { firstName: 'Bob', lastName: 'Bobstein' }, numericAttribute: 42};
  TestCollection._setItems([item]);
  test.equal(TestCollection.findOne({'names.firstName': 'Bob', 'names.lastName': 'Bobstein'}), item);
});

Tinytest.add('stub-collection: findOne() with a selector dot notation string and matches $gte on attributes', (test) => {
  let TestCollection = new StubCollection();
  let item = {_id: 'abc123', names: { firstName: 'Bob', lastName: 'Bobstein' }, numericAttribute: { upper: 42 }};
  TestCollection._setItems([item]);
  test.equal(TestCollection.findOne({'numericAttribute.upper' : {$gte: 30}}), item);
});

Tinytest.add('stub-collection: update() with a selector argument updates matching items', (test) => {
  let TestCollection = new StubCollection();
  TestCollection._setItems([
    {name: 'test 1', numericAttribute: 41},
    {name: 'test 2', numericAttribute: 42},
    {name: 'test 3', numericAttribute: 42}
  ]);
  TestCollection.update({numericAttribute: 42}, {$set: {numericAttribute: 41}});
  test.isTrue(_.every(_.map(TestCollection._items, (item) => {
    return item.numericAttribute === 41;
  })));
});

Tinytest.add('stub-collection: findOne() with a $exists: false operator', (test) => {
  let TestCollection = new StubCollection();
  let items = [
    { name: 'one', notAlwaysPresent: 'present' },
    { name: 'two', notAlwaysPresent: false },
    { name: 'three' },
  ];
  TestCollection._setItems(items);
  test.equal(TestCollection.findOne({ notAlwaysPresent: { $exists: false }}), items[2]);
});

Tinytest.add('stub-collection: count() with a $exists: false operator', (test) => {
  let TestCollection = new StubCollection();
  let items = [
    { name: 'one', notAlwaysPresent: 'present' },
    { name: 'two', notAlwaysPresent: false },
    { name: 'three' },
  ];
  TestCollection._setItems(items);
  test.equal(TestCollection.find({ notAlwaysPresent: { $exists: false }}).count(), 1);
});

Tinytest.add('stub-collection: findOne() with a $exists: true operator', (test) => {
  let TestCollection = new StubCollection();
  let items = [
    { name: 'one', notAlwaysPresent: 'present' },
    { name: 'two', notAlwaysPresent: false },
    { name: 'three' },
  ];
  TestCollection._setItems(items);
  test.equal(TestCollection.findOne({ notAlwaysPresent: { $exists: true }}), items[0]);
});

Tinytest.add('stub-collection: count() with a $exists: true operator', (test) => {
  let TestCollection = new StubCollection();
  let items = [
    { name: 'one', notAlwaysPresent: 'present' },
    { name: 'two', notAlwaysPresent: false },
    { name: 'three' },
  ];
  TestCollection._setItems(items);
  test.equal(TestCollection.find({ notAlwaysPresent: { $exists: true }}).count(), 2);
});

Tinytest.add('stub-collection: update() with a string argument updates the item with a matching id', (test) => {
  let TestCollection = new StubCollection();
  TestCollection._setItems([
    {_id: 'abc123', name: 'test 1', numericAttribute: 41},
    {_id: 'def456', name: 'test 2', numericAttribute: 42},
    {_id: 'ghi789', name: 'test 3', numericAttribute: 42}
  ]);
  TestCollection.update('abc123', {$set: {numericAttribute: 42}});
  test.isTrue(_.every(_.map(TestCollection._items, (item) => {
    return item.numericAttribute === 42;
  })));
});

Tinytest.add('stub-collection: update() can apply $unset as well as $set', (test) => {
  let TestCollection = new StubCollection();
  TestCollection._setItems([
    {_id: 'abc123', name: 'test 1', numericAttribute: 41},
    {_id: 'def456', name: 'test 2', numericAttribute: 42},
    {_id: 'ghi789', name: 'test 3', numericAttribute: 42}
  ]);
  TestCollection.update({}, {$set: {numericAttribute: 18}, $unset: {name: '1'}});
  test.isTrue(_.every(_.map(TestCollection._items, (item) => {
    return _.isUndefined(item.name) && item.numericAttribute === 18;
  })));
});

Tinytest.add('stub-collection: update() can apply $addToSet with single value', (test) => {
  let TestCollection = new StubCollection();
  TestCollection._setItems([
    {_id: 'abc123', name: 'test 1', array: ['five', 'four', 'two', 'three', 'one'], numericAttribute: 41}
  ]);
  TestCollection.update({ _id: 'abc123' }, { $addToSet: { array: 'six' }});

  let record = TestCollection.findOne();
  test.equal(record.array, ['five', 'four', 'two', 'three', 'one', 'six']);
});

Tinytest.add('stub-collection: update() can apply $addToSet with array value', (test) => {
  let TestCollection = new StubCollection();
  TestCollection._setItems([
    {_id: 'abc123', name: 'test 1', array: ['five', 'four', 'two', 'three', 'one'], numericAttribute: 41}
  ]);
  TestCollection.update({ _id: 'abc123' }, { $addToSet: { array: ['six', 'seven'] }});

  let record = TestCollection.findOne();
  test.equal(record.array, ['five', 'four', 'two', 'three', 'one', 'six', 'seven']);
});

Tinytest.add('stub-collection: update() can apply $pull with single value', (test) => {
  let TestCollection = new StubCollection();
  TestCollection._setItems([
    {_id: 'abc123', name: 'test 1', array: ['five', 'four', 'two', 'three', 'one'], numericAttribute: 41}
  ]);
  TestCollection.update({ _id: 'abc123' }, { $pull: { array: 'five' }});

  let record = TestCollection.findOne();
  test.equal(record.array, ['four', 'two', 'three', 'one']);
});

Tinytest.add('stub-collection: update() can apply $pull with array value', (test) => {
  let TestCollection = new StubCollection();
  TestCollection._setItems([
    {_id: 'abc123', name: 'test 1', array: ['five', 'four', 'two', 'three', 'one'], numericAttribute: 41}
  ]);
  TestCollection.update({ _id: 'abc123' }, { $pull: { array: ['five', 'three'] }});

  let record = TestCollection.findOne();
  test.equal(record.array, ['four', 'two', 'one']);
});

Tinytest.add('stub-collection: remove() removes record with matching id', (test) => {
  let TestCollection = new StubCollection();
  TestCollection._setItems([
    {_id: 'abc123', name: 'test 1', numericAttribute: 41},
    {_id: 'def456', name: 'test 2', numericAttribute: 42},
    {_id: 'ghi789', name: 'test 3', numericAttribute: 42}
  ]);
  TestCollection.remove('def456');
  test.equal(TestCollection._items.length, 2);
  test.isUndefined(TestCollection.findOne('def456'));
});
