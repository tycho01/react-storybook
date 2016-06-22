import { Component, Input, Output, ChangeDetectionStrategy, ViewEncapsulation, EventEmitter } from '@angular/core';

@Component({
  selector: 'controls',
  template: require('./controls.jade'),
  styles: [
    require('./controls.less'),
  ],
  encapsulation: ViewEncapsulation.Native,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class StorybookControls {
  @Input() storyStore: Array<any>;
  @Input() selectedKind: String;
  @Input() selectedStory: String;
  @Output() onKind = new EventEmitter();
  @Output() onStory = new EventEmitter();

  ngOnInit() {
    this.kindNames = (this.storyStore || []).map(({ kind }) => kind);
  }

  getStories(kind) {
    return (this.storyStore || []).find(x => x.kind === kind).stories;
  }
};
