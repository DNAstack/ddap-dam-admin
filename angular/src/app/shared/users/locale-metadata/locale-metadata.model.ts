export interface LocaleMetadataModel {
  locales: { [id: string]: LocaleModel };
  timeZones: { [id: string]: TimezoneModel };
}

export interface LocaleModel {
  id: string; // added manually
  base: string;
  region: string;
  script: string;
  ui: {
    language: string;
    label: string;
  };
}

export interface TimezoneModel {
  id: string; // added manually
  ui: {
    city: string;
    region: string;
    label: string;
  };
}
