import { AccessLevel } from './access-level.enum';

export function getRoleName(accessLevel: AccessLevel, serviceTemplateId: string): string {
  if (serviceTemplateId === 'gcs') {
    if (accessLevel === AccessLevel.read) {
      return 'viewer';
    }
    if (accessLevel === AccessLevel.write) {
      return 'editor';
    }
  } else if (serviceTemplateId === 'bigquery') {
    if (accessLevel === AccessLevel.read) {
      return 'viewer';
    }
    if (accessLevel === AccessLevel.write) {
      return 'writer';
    }
  } else if (serviceTemplateId === 'beacon') {
    if (accessLevel === AccessLevel.read) {
      return 'basic_discovery';
    }
    if (accessLevel === AccessLevel.write) {
      return 'discovery';
    }
  }
}
