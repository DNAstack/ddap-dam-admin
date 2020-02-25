import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'ddap-access-manage',
  templateUrl: './access-manage.component.html',
  styleUrls: ['./access-manage.component.scss'],
})
export class AccessManageComponent implements OnInit {

  serviceTemplate: string;

  constructor(protected activatedRoute: ActivatedRoute,
              protected router: Router) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.serviceTemplate = params.serviceTemplate;
    });
  }

}
