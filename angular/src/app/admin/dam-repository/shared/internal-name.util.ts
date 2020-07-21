import _kebabCase from 'lodash.kebabcase';

export function generateInternalName(displayName: string) {
  const kebabCasedName = _kebabCase(displayName).substring(0, 16);
  return kebabCasedName.endsWith('-')
    ? kebabCasedName.substr(0, kebabCasedName.length - 1)
    : kebabCasedName;
}
