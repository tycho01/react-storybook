import { Component, Input, ChangeDetectionStrategy, ViewEncapsulation } from 'angular2/core';
import { StorybookControls } from './controls';
import { Preview } from './preview';
import { ActionLogger } from './action_logger';
import stringify from 'json-stringify-safe';
import { getSyncedStore } from '../';
const syncedStore = getSyncedStore();

@Component({
  selector: 'layout',
  template: require('./layout.jade'),
  styles: [
    require('./layout.less'),
  ],
  encapsulation: ViewEncapsulation.Native,
  changeDetection: ChangeDetectionStrategy.OnPush,
  directives: [
    StorybookControls,
    Preview,
    ActionLogger,
  ],
})
export class Layout {
  ngOnInit() {
    this.updateHeight();
    window.addEventListener('resize', this.updateHeight.bind(this));
  }

  updateHeight() {
    const { docEl, body } = document;
    this.height = (docEl.clientHeight || body.clientHeight) - 20;
  }

  getLog(data) {
    const { actions = [] } = data;
    return actions
      .map(action => stringify(action, null, 2))
      .join('\n\n');
  }

  // Event handlers
  setSelectedKind(data, kind) {
    const newData = { ...data };
    const stories = newData.storyStore
      .find(item => item.kind === kind).stories;

    newData.selectedKind = kind;
    newData.selectedStory = stories[0];
    syncedStore.setData(newData);
  }

  setSelectedStory(data, block) {
    const newData = { ...data };
    newData.selectedStory = block;
    syncedStore.setData(newData);
  }

};
