StubCollection = class {
  constructor() {
    this._items = [];
  };

  _setItems(items) {
    this._items = items;
  }

  find(selector) {
    // Deal with finds by id only
    if (typeof selector === 'string') {
      selector = {_id: selector};
    }

    var items = this._items;
    return {
      _res:  _.isEmpty(selector) ? items : matchItems(items, selector),
      fetch: function() {
        return this._res;
      },

      forEach: function(fn) {
        _.each(this._res, fn);
      }
    };
  }

  rawCollection() {
    let _this = this;
    return {
      insert: function() { _this.apply('insert', arguments); },
      update: function() { _this.update.apply(_this, arguments); }
    };
  }

  findOne(selector) {
    return this.find(selector).fetch()[0];
  }

  insert(obj) {
    obj._id = Random.id();
    this._items.push(obj);
    return obj._id;
  }

  update(selector, modifier) {
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
  }

  remove(id) {
    id = _.isObject(id) ? id._id : id;
    var newItems = _.reject(this._items, function(item) {
      return item._id === id;
    });

    if (newItems.length === this._items.length) {
      return false;
    }

    this._items = newItems;
    return true;
  }
}
