(function(root) {
  "use strict";

  /**
   * Data Object
   * Manages object data and provides matching object properties
   * @class
   */
  function DataObject(data) { // TODO set initial data
    var _this = this,
      ownPublicMethods = [],
      dataFields = [],
      persistedData = {};

    /**
     * @param {Object} newData
     * @returns this
     */
    this.setData = function(newData) {
      if (!ownPublicMethods.length) setOwnPublicMethods();
      var properties = Object.keys(newData);
      dataFields = [];
      for (var i = properties.length - 1; i >= 0; i--) {
        var prop = properties[i];
        if (ownPublicMethods.indexOf(prop) >= 0)
          throw new Error('Data contains a public method conflicting property', prop);
        _this[prop] = newData[prop];
        dataFields.push(prop);
      }
      persistedData = newData;
      return _this;
    };

    /**
     * Set single property
     * @param {string} name
     * @param {mixed} value
     * @returns this
     */
    this.set = function(name, value) {
      if (!ownPublicMethods.length) setOwnPublicMethods();
      if (ownPublicMethods.indexOf(name) >= 0)
        throw new Error('Property conflicts with a public method', name);
      dataFields.push(name);
      _this[name] = persistedData[name] = value;
      return _this;
    }

    /**
     * Get current object data
     * @return {Object}
     * @param {array} [fields]
     */
    this.getData = function(fields) {
      fields = fields || dataFields;
      var data = {};
      for (var i = fields.length - 1; i >= 0; i--) {
        if (_this[fields[i]] != undefined) data[fields[i]] = _this[fields[i]];
        else console.warn('Inexistent property ', fields[i]);
      }
      return data;
    };

    /**
     * @return {Object}
     */
    this.getPersistedData = function() {
      return persistedData;
    };

    /**
     * Shallow comparisson between persisted data and current data
     * @return {Object}
     */
    this.getChangedData = function() {
      var changedData = {};
      for (var i = dataFields.length - 1; i >= 0; i--) {
        if (_this[dataFields[i]] != persistedData[dataFields[i]])
          changedData[dataFields[i]] = _this[dataFields[i]];
      }
      return changedData;
    };

    /**
     * Persist current data
     * @return {Object} this
     */
    this.persistData = function() {
      for (var i = dataFields.length - 1; i >= 0; i--) {
        persistedData[dataFields[i]] = _this[dataFields[i]];
      }
      return _this;
    };

    /**
     * Reset data to persisted state
     * @return {Object} this
     */
    this.resetData = function() {
      for (var i = dataFields.length - 1; i >= 0; i--) {
        _this[dataFields[i]] = persistedData[dataFields[i]];
      }
      return _this;
    };

    /**
     * Set object's methods array for conflict prevention
     */
    function setOwnPublicMethods() {
      for (var prop in _this) {
        if (typeof _this[prop] == 'function') ownPublicMethods.push(prop);
      }
    }

    return this;
  };

  if (typeof module !== 'undefined') module.exports = DataObject;
  else root.FacebookAdsApi.DataObject = DataObject;
})(this);