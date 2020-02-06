import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import AuthorityLevel = PassportVisa.AuthorityLevel;
import { ClaimDefinitionService } from '../../claim-definitions/claim-definitions.service';
import { ClaimDefinitionsStore } from '../../claim-definitions/claim-definitions.store';
import { TrustedSourcesStore } from '../../trusted-sources/trusted-sources.store';
import { flatten, makeDistinct, pick } from '../autocomplete.util';
import { PassportVisa } from '../passport-visa/passport-visa.constant';

@Injectable({
  providedIn: 'root',
})
export class ConditionAutocompleteService {
  private autocompleteValuesForType = new Subject<any>();
  fetchAutocompleteValuesForType$ = this.autocompleteValuesForType.asObservable();

  constructor(private claimDefinitionsStore: ClaimDefinitionsStore,
              private claimDefService: ClaimDefinitionService,
              private trustedSourcesStore: TrustedSourcesStore) {
  }
  getTypeValues(): Observable<string[]> {
    return this.claimDefinitionsStore.getAsList(pick('name'))
      .pipe(
        map(makeDistinct)
      );
  }

  getSourceValues(): Observable<string[]> {
    return this.trustedSourcesStore.getAsList(pick('dto.sources'))
      .pipe(
        map(flatten),
        map(makeDistinct)
      );
  }

  getSourceNameValues(): Observable<any> {
    const sourceName = [],
      sourceValue = [],
      trustedSources = {};
    return this.trustedSourcesStore.getAsList()
      .pipe(
        map(sources => {
          sources.forEach( source => {
            trustedSources[source['name']] = source['dto']['sources'];
            sourceName.push(source['name']);
            sourceValue.push(source['dto']['sources']);
          });
          return {
            trustedSourcesValues: makeDistinct(flatten(sourceName.concat(flatten(sourceValue)))),
            trustedSources: trustedSources,
          };
        })
      );
  }

  getByValues(): string[] {
    return Object.values(AuthorityLevel);
  }

  getValuesForType(type: string): Observable<string[]> {
    return this.claimDefService.getClaimDefinitionSuggestions(type)
      .pipe(
        map(makeDistinct)
      );
  }

  setAutocompleteValuesForType(data) {
    this.autocompleteValuesForType.next(data);
  }

}
