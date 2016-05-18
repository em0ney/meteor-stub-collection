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
      selector = { _id: selector };
    }

    let items = this._items;
    return {
      _res:  _.isEmpty(selector) ? items : matchItems(items, selector),
      fetch: function() {
        return this._res;
      },

      forEach: function(fn) {
        _.each(this._res, fn);
      },

      map: function(fn) {
        return this._res.map(fn);
      },

      count: function() {
        return this._res.length;
      }
    };
  }

  rawCollection() {
    let _this = this;
    return {
      insert: (...args) => { _this.apply('insert', args); },
      update: (...args) => { _this.update.apply(_this, args); }
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
    let count = 0;
    let items = this.find(selector);
    let _this = this;
    var updateableItemIds = _.pluck(items.fetch(), '_id');
    this._items = this._items.map((item) => {
      if (_.contains(updateableItemIds, item._id)) {
        count++;
        if (modifier.$set)
          _.extend(item, modifier.$set);
        if (modifier.$unset)
          item = _.omit(item, _.keys(modifier.$unset));
        if (modifier.$addToSet)
          item = _this.addToSet(item, modifier.$addToSet);
        if (modifier.$pull)
          item = _this.pull(item, modifier.$pull);
      }

      return item;
    });

    return count;
  }

  addToSet(item, modifier) {
    let keys = Object.keys(modifier);
    keys.forEach((key) => {
      if (modifier[key] instanceof Array) {
        modifier[key].forEach((value) => {
          item[key].push(value);
        });
      } else {
        item[key].push(modifier[key]);
      }
    });

    return item;
  }

  pull(item, modifier) {
    let keys = Object.keys(modifier);
    keys.forEach((key) => {
      if (modifier[key] instanceof Array) {
        modifier[key].forEach((value) => {
          item[key] = _.without(item[key], value);
        });
      } else if (modifier[key] instanceof Object) {
        item[key] = _.filter(item[key], (obj) => {
          return Object.keys(obj).every((key1) => {
            return modifier[key][key1] !== obj[key1];
          });
        });
      } else {
        item[key] = _.without(item[key], modifier[key]);
      }
    });

    return item;
  }

  remove(id) {
    id = _.isObject(id) ? id._id : id;
    let newItems = _.reject(this._items, (item) => {
      return item._id === id;
    });

    if (newItems.length === this._items.length) {
      return false;
    }

    this._items = newItems;
    return true;
  }
};
