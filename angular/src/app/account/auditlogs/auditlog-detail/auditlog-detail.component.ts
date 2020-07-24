import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ddap-account-auditlog-detail',
  templateUrl: './auditlog-detail.component.html',
  styleUrls: ['./auditlog-detail.component.scss'],
})
export class AuditlogDetailComponent {

  constructor(private route: ActivatedRoute) {
  }

  get auditLogId() {
    return this.route.snapshot.params.auditlogId;
  }

}
