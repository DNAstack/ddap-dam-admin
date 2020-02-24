import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'ddap-access-manage',
  templateUrl: './access-manage.component.html',
  styleUrls: ['./access-manage.component.scss'],
})
export class AccessManageComponent {

  constructor(protected route: ActivatedRoute,
              protected router: Router) {
  }

}
