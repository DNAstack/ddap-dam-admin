export interface AuditlogResponseModel {
  auditLogs?: any[];
  nextPageToken?: string;
}

export enum Decision {
  all = '',
  fail = 'FAIL',
  pass = 'PASS',
}

export enum LogTypes {
  all = '',
  request = 'REQUEST',
  policy = 'POLICY',
}
