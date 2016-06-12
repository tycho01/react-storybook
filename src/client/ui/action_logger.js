import { Component, Input, ChangeDetectionStrategy, ViewEncapsulation } from 'angular2/core';

@Component({
  selector: 'action-logger',
  template: require('./action_logger.jade'),
  styles: [
    require('./action_logger.less'),
  ],
  encapsulation: ViewEncapsulation.Native,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionLogger {
  @Input() actionLog: String;
};
