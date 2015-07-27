StubCollection = function() {
  this._items = [];
};

StubCollection.prototype._setItems = function(items) {
  this._items = items;
};

StubCollection.prototype.find = function(selector) {
  // Deal with finds by id only
  if (typeof selector === 'string') {
    selector = {_id: selector};
  }

  var items = this._items;
  return {
    _res:  _.isEmpty(selector) ? items : _.where(items, selector),
    fetch: function() {
      return this._res;
    },

    forEach: function(fn) {
      _.each(this._res, fn);
    }
  };
};

StubCollection.prototype.findOne = function(selector) {
  return this.find(selector).fetch()[0];
};

StubCollection.prototype.insert = function(obj) {
  obj._id = Random.id();
  this._items.push(obj);
  return obj._id;
};

StubCollection.prototype.update = function(selector, modifier) {
  var count = 0;
  var items = this.find(selector);
  var updateableItemIds = _.pluck(items.fetch(), '_id');
  this._items = _.map(this._items, function(item) {
    if (_.contains(updateableItemIds, item._id)) {
      count++;
      if (modifier.$set)
        _.extend(item, modifier.$set);
      if (modifier.$unset)
        item = _.omit(item, _.keys(modifier.$unset));
    }

    return item;
  });

  return count;
};

StubCollection.prototype.remove = function(id) {
  id = _.isObject(id) ? id._id : id;
  var newItems = _.reject(this._items, function(item) {
    return item._id === id;
  });

  if (newItems.length === this._items.length) {
    return false;
  }

  this._items = newItems;
  return true;
};
