import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ConfirmModalComponent implements OnInit {

  public textTitle?: string;
  public textBody?: string;

  constructor(public modal: NgbActiveModal) { }

  ngOnInit(): void {
  }

}
