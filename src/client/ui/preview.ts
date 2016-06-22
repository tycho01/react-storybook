import { getStoryStore } from '../';
import { Component, Input, ChangeDetectionStrategy, ViewEncapsulation, DynamicComponentLoader, CORE_DIRECTIVES, Injector } from '@angular/core';

@Component({
  selector: 'preview',
  template: require('./preview.jade'),
  // styles: [
  //   require('./preview.less'),
  // ],
  // encapsulation: ViewEncapsulation.Native,
  changeDetection: ChangeDetectionStrategy.OnPush,
  directives: [CORE_DIRECTIVES],
})
export class Preview {
  @Input() data;
  constructor(dcl: DynamicComponentLoader) {
    this.dcl = dcl;
  }
  get data() {
    return this._data;
  }
  set data(x) {
    // if(_.isUndefined(x)) return;
    this._data = x;
    const { selectedKind, selectedStory } = x;
    this.story = getStoryStore().getStory(selectedKind, selectedStory);
    { comp: this.comp, deps: this.deps } = this.story;
    this.dcl.loadAsRoot(this.comp, '#story', Injector.resolveAndCreate(this.deps));
    // do I need to manually do ChangeDetectorRef crap here?
  }
};

Preview.annotations = [
  [DynamicComponentLoader],
  [Injector],
];
