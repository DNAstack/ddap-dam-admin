import { Component, Input, OnInit } from '@angular/core';
import { EntityModel } from 'ddap-common-lib';
import { Observable } from 'rxjs';

import { PersonasStore } from '../../personas/personas.store';
import { ResourcesStore } from '../../resources/resources.store';

@Component({
  selector: 'ddap-service-definition-access',
  templateUrl: './service-definition-access.component.html',
  styleUrls: ['./service-definition-access.component.scss'],
})
export class ServiceDefinitionAccessComponent implements OnInit {

  resources: EntityModel[];

  personas: EntityModel[];
  displayedColumns: string[];
  constructor(private resourcesStore: ResourcesStore,
              private personasStore: PersonasStore) { }

  ngOnInit() {
    this.personasStore.getAsList().subscribe(personas => {
      this.personas = personas;
    });
    this.resourcesStore.getAsList().subscribe(resources => {
      this.resources = resources;
    });
    this.displayedColumns = [];
  }

}
