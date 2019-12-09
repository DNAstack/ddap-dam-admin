import { PassportVisa } from '../passport-visa/passport-visa.constant';
import ConditionPrefix = PassportVisa.ConditionPrefix;

export class PrefixValuePairService {

  static prefixes: string[] = Object.values(ConditionPrefix);

  static extractPrefix(jointValue: string): string {
    let usedPrefix;
    if (jointValue) {
      usedPrefix = this.prefixes.find((prefix) => {
        return jointValue.startsWith(`${prefix}:`);
      });
    }
    return usedPrefix ? usedPrefix : '';
  }

  static extractValue(jointValue: string): any {
    const usedPrefix = this.extractPrefix(jointValue);
    return usedPrefix && usedPrefix !== ''
           ? jointValue.replace(`${usedPrefix}:`, '').split(';')
           : jointValue;
  }

}
