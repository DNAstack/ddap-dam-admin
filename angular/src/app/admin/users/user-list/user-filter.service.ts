export class UserFilterService {

  // see https://github.com/GoogleCloudPlatform/healthcare-federated-access-services/blob/14e3a9d/lib/ic/scim.go#L40
// "active" is omitted on purpose, since it has toggle in a UI
  static filterableAttributes: string[] = [
    'displayname',
    'emails',
    'externalid',
    'id',
    'locale',
    'preferredlanguage',
    'name.formatted',
    'name.givenname',
    'name.familyname',
    'name.middlename',
    'timezone',
    'username',
  ];

  public static buildFilterQuery(query: string): string {
    let filterQuery = '';
    this.filterableAttributes.forEach((filterAttribute) => {
      if (filterQuery !== '') {
        filterQuery += ` or `;
      }
      filterQuery += `${filterAttribute} co "${query}"`;
    });

    return filterQuery;
  }

  public static buildActiveFilter(activeFilter: boolean): string {
    return `active eq "${activeFilter}"`;
  }

  public static appendActiveFilter(filterQuery: string, activeFilter: boolean): string {
    if (activeFilter === null) {
      return filterQuery;
    }
    return `( ${filterQuery} ) and ${this.buildActiveFilter(activeFilter)}`;
  }

}
