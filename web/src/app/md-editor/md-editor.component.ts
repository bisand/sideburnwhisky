import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-md-editor',
  templateUrl: './md-editor.component.html',
  styleUrls: ['./md-editor.component.scss']
})
export class MdEditorComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @Input() compiled?: string;
  @Input() placeHolder?: string;

  @Output() valueChanged = new EventEmitter<string>();

  onValueChange(e: any) {
    const body = e.target.value;

    if (!body) {
      // reset to initial state
      return this.valueChanged.emit(this.placeHolder);
    } else {
      this.valueChanged.emit(body);
    }
  }


}
