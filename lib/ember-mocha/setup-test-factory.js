import Ember from 'ember';
import { before, beforeEach, afterEach, after } from 'mocha';
import { getContext } from 'ember-test-helpers';

export default function(Constructor) {
  return function setupTest(moduleName, options = {}) {
    var module;
    var beforeContext;

    if (Ember.typeOf(moduleName) === 'object') {
      options = moduleName;
      moduleName = '';
    }

    before(function() {
      module = new Constructor(moduleName, options);
      beforeContext = {};
    });

    beforeEach(function() {
      return module.setup().then(() => {
        var context = getContext();
        Object.keys(context).forEach(key => {
          beforeContext[key] = this[key];
          this[key] = context[key];
        });
      });
    });

    afterEach(function() {
      Object.keys(beforeContext).forEach(key => {
        this[key] = beforeContext[key];
        delete beforeContext[key]
      });
      return module.teardown();
    });

    after(function() {
      beforeContext = null;
      module = null;
    });
  };
}
