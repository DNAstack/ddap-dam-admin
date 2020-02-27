import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { flatMap } from 'rxjs/operators';

import { DamConfigStore } from '../../../shared/dam/dam-config.store';
import { AccessLevel } from '../../shared/access-level.enum';
import { AccessPolicyBuilderService } from '../../shared/access-policy-builder.service';
import { AccessPolicyType } from '../../shared/access-policy-type.enum';
import { ResourceBuilderService } from '../../shared/resource-builder.service';
import { AccessFormComponent } from '../access-form/access-form.component';

@Component({
  selector: 'ddap-access-manage',
  templateUrl: './access-manage.component.html',
  styleUrls: ['./access-manage.component.scss'],
})
export class AccessManageComponent implements OnInit {

  @ViewChild(AccessFormComponent, { static: false })
  accessForm: AccessFormComponent;

  serviceTemplate: string;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private damConfigStore: DamConfigStore,
              private accessPolicyBuilderService: AccessPolicyBuilderService,
              private resourceBuilderService: ResourceBuilderService) {
  }

  ngOnInit(): void {
    this.damConfigStore.set();
    this.activatedRoute.params.subscribe((params) => {
      this.serviceTemplate = params.serviceTemplate;
    });
  }

  save() {
    const { collection, accessPolicyValue, variables, aud } = this.accessForm.getModel();
    const accessLevel: AccessLevel = this.accessForm.accessLevelRadio.value;
    const accessPolicyId: AccessPolicyType = this.accessForm.accessPolicyRadio.value;

    this.accessPolicyBuilderService.createReusableAccessPolicy(accessPolicyId)
      .pipe(
        flatMap((_) => {
          return this.resourceBuilderService.createResource(
            collection, this.serviceTemplate, variables, accessLevel, accessPolicyId, accessPolicyValue, aud
          );
        })
      )
      .subscribe(() => {
        this.router.navigate([`../../../../advanced/resources/${collection}`], { relativeTo: this.activatedRoute });
      });
  }

}
