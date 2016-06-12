import { Component, ViewChild } from 'angular2/core';
import { BehaviorSubject } from 'rxjs/subject/BehaviorSubject';

export default class ClientApi {
  constructor({ syncedStore, storyStore }) {
    this._syncedStore = syncedStore;
    this._storyStore = storyStore;
  }

  storiesOf(kind, m) {
    if (m && m.hot) {
      m.hot.dispose(() => {
        this._storyStore.removeStoryKind(kind);
      });
    }

    const add = (storyName, story) => {
      this._storyStore.addStory(kind, storyName, story);
      return { add };
    };

    return { add };
  }

  action(name) {
    const syncedStore = this._syncedStore;
    console.log('action', name);
    return function (..._args) {
      // I fear this won't get called...
      console.log('action:function', _args);
      const args = Array.from(_args);
      let { actions = [] } = syncedStore.getData();
      // React: remove events from the args, or it creates a huge JSON string.
      actions = [{ name, args }].concat(actions.slice(0, 4));
      syncedStore.setData({ actions });
    };
  }

  // a component template for testing other components, by just selector (easier than html)
  test_comp(selector, cls) { return (obs_pars = {}, static_pars = {}, outputs = {}, content = '') => {
    let obj = Object.assign({}, obs_pars, static_pars);
    let in_str = Object.keys(obj).map(k => ` [${k}]='${k}'`).join('');
    let out_str = Object.keys(outputs).map(k => ` (${k})='${k}($event)'`).join('');
    let tmplt = `<${selector}${in_str}${out_str}>${content}</${selector}>`;
    return test_comp_html(tmplt, cls, obs_pars, static_pars, outputs);
  }; }

  // a component template for testing other components, by full html template
  test_comp_html(tmplt, cls, obs_pars = {}, static_pars = {}, outputs = {}) {
    let cmp = class {
      constructor() {
        for (let k in obs_pars) this[k] = new BehaviorSubject(obs_pars[k]);
        for (let k in static_pars) this[k] = static_pars[k];
        for (let k in outputs) this[k] = outputs[k];
      }
    };
    Reflect.decorate([Component({
      // selector: 'test',
      directives: [cls],
      template: tmplt,
    })], cmp);
    Reflect.decorate([ViewChild(cls)], cmp.prototype, 'comp');
    return cmp;
  }

}
