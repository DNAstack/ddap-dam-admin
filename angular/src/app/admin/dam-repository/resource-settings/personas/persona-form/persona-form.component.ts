import {
  AfterContentChecked,
  AfterContentInit,
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Form, isExpanded } from 'ddap-common-lib';
import { ConfigModificationModel, EntityModel } from 'ddap-common-lib';
import _get from 'lodash.get';
import { combineLatest, Observable, of } from 'rxjs';
import { Subscription } from 'rxjs';
import { catchError, debounceTime, map, startWith, switchMap, tap } from 'rxjs/operators';

import { common } from '../../../../../shared/proto/dam-service';
import { VisaTypeService } from '../../../advanced-settings/visa-types/visa-types.service';
import { VisaTypesStore } from '../../../advanced-settings/visa-types/visa-types.store';
import { filterBy, flatten, includes, makeDistinct, pick } from '../../../shared/autocomplete.util';
import { ConditionFormComponent } from '../../../shared/condition-form/condition-form.component';
import { generateInternalName } from '../../../shared/internal-name.util';
import { PassportVisa } from '../../../shared/passport-visa/passport-visa.constant';
import { PassportIssuersStore } from '../../../trust-config/passport-issuers/passport-issuers.store';
import { VisaSourcesStore } from '../../../trust-config/visa-sources/visa-sources.store';
import TestPersona = common.TestPersona;
import { ResourcesStore } from '../../resources/resources.store';
import { PersonaAccessFormComponent } from '../persona-resource-form/persona-access-form.component';
import { PersonaService } from '../personas.service';

import { PersonaFormBuilder } from './persona-form-builder.service';

import AuthorityLevel = PassportVisa.AuthorityLevel;

@Component({
  selector: 'ddap-persona-form',
  templateUrl: './persona-form.component.html',
  styleUrls: ['./persona-form.component.scss'],
})
export class PersonaFormComponent implements OnInit, OnDestroy, Form {

  get standardClaims() {
    return this.form.get('passport.standardClaims') as FormArray;
  }

  get ga4ghAssertions() {
    return this.form.get('passport.ga4ghAssertions') as FormArray;
  }

  get resourceAccess() {
    return this.form.get('resourceAccess') as FormGroup;
  }

  @ViewChild(ConditionFormComponent)
  conditionForm: ConditionFormComponent;
  @ViewChild(PersonaAccessFormComponent)
  accessForm: PersonaAccessFormComponent;

  @Input()
  internalNameEditable = false;
  @Input()
  persona?: EntityModel = new EntityModel('', TestPersona.create());

  form: FormGroup;
  subscriptions: Subscription[] = [];
  isExpanded: Function = isExpanded;
  resourcesList = [];
  authorityLevels: string[] = Object.values(AuthorityLevel);
  passportIssuers$: Observable<string[]>;
  claimDefinitions$: Observable<string[]>;
  trustedSources$: Observable<string[]>;
  claimSuggestedValues: string[];
  conditionsComponentLabels = {
    header: 'Visa Conditions',
    description: 'Conditions are lists of requirements that are matched against visas. A condition is met if all its inner requirements are met. A visa containing a condition is only valid if one or more of its conditions are met by other user visas.',
  };

  private validatorSubscription: Subscription = new Subscription();
  private resourceAccess$: Observable<any>;

  constructor(private formBuilder: FormBuilder,
              public personaFormBuilder: PersonaFormBuilder,
              private personaService: PersonaService,
              private resourcesStore: ResourcesStore,
              private claimDefService: VisaTypeService,
              private claimDefinitionsStore: VisaTypesStore,
              private passportIssuersStore: PassportIssuersStore,
              private trustedSourcesStore: VisaSourcesStore) {
  }

  ngOnInit(): void {
    this.resourceAccess$ = this.resourcesStore.getAsList().pipe(
      map((resourceList) => this.generateAllAccessModel(resourceList))
    );

    this.form = this.personaFormBuilder.buildForm(this.persona);
    this.form.addControl('resourceAccess', this.formBuilder.group({}));
    if (this.internalNameEditable) {
      this.subscriptions.push(this.form.get('ui.label').valueChanges
        .subscribe((displayName) => {
          this.form.get('id').setValue(generateInternalName(displayName));
        }));
    }

    if (this.persona && this.persona.dto) {
      this.buildAccessForm(this.persona.dto);
    }

    if (!this.resourcesList) {
      this.form.disable();
    }
    if (this.persona && this.persona.name) {
      this.validatorSubscription.unsubscribe();
      this.validatorSubscription = this.setUpAccessValidator(this.persona.name);
    }

    this.getAutocompleteValues();
    this.addGa4ghAssertion();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.validatorSubscription.unsubscribe();
  }

  addGa4ghAssertion() {
    this.ga4ghAssertions.insert(0, this.buildGa4GhClaimGroup({}));
  }

  removeGa4ghAssertion(index) {
    this.ga4ghAssertions.removeAt(index);
  }

  getAllForms(): FormGroup[] {
    return [this.form];
  }

  isValid(): boolean {
    return this.form.valid;
  }

  getModel(): EntityModel {
    const { id, passport, ui } = this.form.value;
    const access = this.accessForm ? this.accessForm.getModel() : null;
    this.setAnyOfModel(passport);
    const testPersona: TestPersona = TestPersona.create({
      ui,
      passport,
      access,
    });

    return new EntityModel(id, testPersona);
  }

  getGa4ghAssertionAsFormGroup(assertionControl: AbstractControl) {
    return assertionControl as FormGroup;
  }

  displayError({ error }) {
    const { details } = error;
    details.forEach(errorDetail => {
      if (!errorDetail['@type'].includes('ConfigModification')) {
        const path = 'testPersonas/' + this.form.value.id;
        if (errorDetail['resourceName'].includes(path)
          && errorDetail['description'].includes('visa')) {
          this.form.get('passport.ga4ghAssertions').setErrors({
            serverError: errorDetail['description'],
          });
        }
      }
    });
  }

  private setAnyOfModel(passport) {
    passport.ga4ghAssertions.forEach((assertion) => {
      assertion.anyOfConditions = this.conditionForm.getModel();
    });
  }

  private buildGa4GhClaimGroup(ga4ghAssertion: common.IAssertion): FormGroup {
    const ga4ghClaimForm: FormGroup = this.personaFormBuilder.buildGa4ghAssertionForm(ga4ghAssertion);

    this.buildSuggestedAutocompleteValuesForClaim(ga4ghClaimForm)
      .subscribe((policies) => {
        this.claimSuggestedValues = policies;
      });

    return ga4ghClaimForm;
  }

  private getAutocompleteValues() {
    this.claimDefinitions$ = this.claimDefinitionsStore.getAsList(pick('name'))
      .pipe(
        map(makeDistinct)
      );
    this.trustedSources$ = this.trustedSourcesStore.getAsList(pick('dto.sources'))
      .pipe(
        map(flatten),
        map(makeDistinct)
      );
    this.passportIssuers$ = this.passportIssuersStore.getAsList(pick('dto.issuer'))
      .pipe(
        map(makeDistinct)
      );
  }

  private buildSuggestedAutocompleteValuesForClaim(formGroup: FormGroup): Observable<any> {
    const claimName$ = formGroup.get('type').valueChanges.pipe(
      startWith('')
    );
    const value$ = formGroup.get('value').valueChanges.pipe(
      startWith('')
    );
    return combineLatest(claimName$, value$).pipe(
      debounceTime(300),
      switchMap(([claimName, value]) => {
        const currentClaimName = formGroup.get('type').value;
        return this.claimDefService.getClaimDefinitionSuggestions(claimName || currentClaimName).pipe(
          map(filterBy(includes(value)))
        );
      })
    );
  }

  private executeDryRunRequest(personaId: string, change: ConfigModificationModel) {
    return this.personaService.update(personaId, change).pipe(
      tap(() => this.accessForm.makeAccessFieldsValid()),
      catchError((error) => {
        this.accessForm.validateAccessFields(personaId, error);
        this.displayError(error);
        return of();
      }));
  }

  private generateAllAccessModel(resourceList): any {
    return resourceList.map((resource) => this.generateAccessModel(resource));
  }

  private generateAccessModel(resource) {
    const name = resource.name;
    const access = this.getViewRolesCombinations(resource.dto.views);

    return {
      name,
      access,
    };
  }

  private getViewRolesCombinations(view?: object): any[] {
    if (!view) {
      return [];
    }
    const viewEntries = Object.entries(view);

    return viewEntries.reduce((sum, [viewName, viewDto]) => {
      const roles = Object.keys(viewDto.roles);
      return [...sum, ...roles.map((role) => `${viewName}/${role}`)];
    }, []);
  }

  private buildAccessForm(personaDto: TestPersona): Subscription {
    return this.resourceAccess$.subscribe(allResourceList => {
      this.registerAccessControls(allResourceList, personaDto);
      this.resourcesList = allResourceList;
      this.form.enable();
    });
  }

  private registerAccessControls(allResourceList, personaDto) {
    const personaAccess: string[] = _get(personaDto, 'access', []);

    allResourceList.forEach(({name, access: resourceAccess}) => {
      if (!resourceAccess) {
        return;
      }
      const resourceAccessFormGroup = resourceAccess.reduce((result, view) => {
        const currentResourceAccess = personaAccess.filter((access) => access.includes(name));
        const isInCurrentResource = currentResourceAccess.some((access) => access.includes(view));

        result[view] = [isInCurrentResource];

        return result;
      }, {});

      this.resourceAccess.setControl(name, this.formBuilder.group(resourceAccessFormGroup));
    });
  }

  private setUpAccessValidator(personaId) {
    return this.form.valueChanges.pipe(
      debounceTime(300),
      switchMap( () => {
        const personaModel: EntityModel = this.getModel();
        const change = new ConfigModificationModel(personaModel.dto, {
          dry_run: true,
        });

        return this.executeDryRunRequest(personaId, change);
      })
    ).subscribe();
  }

}
