/*
* matchItems
*
* This is the function that matches items to selectors in the find/update/remove methods
*/

matchItems = function(items, selector) {
  return _.filter(items, function(item) {
    return _.every(selector, function(value, key) {
      return matchAttributeOnItem(item, key, value);
    });
  });
};

/*
* matchAttributeOnItem
*
* Either:
* 1) Matches simple attributes on item, or
* 2) Calls complex matcher
*
*/
matchAttributeOnItem = function(item, key, value) {
  if (typeof value !== 'object') {
    return item[key] === value;
  }

  return _.every(value, function(value1, key1) {
    if (key1 === '$in') {
      return matchDollarIn(item, key, value1);
    }

    // currently unsupported operation - return false
    return false;
  });
};

matchDollarIn = function(item, key, valueArray) {
  return _.some(valueArray, function(value) {
    console.log([item[key], value]);
    return item[key] === value;
  });
};
