// A password should have:
// - Length with at least 8 chars;
// - At least one uppercase letter;
// - At least one lower case letter;
// - Return the reasons that make a password invalid
// - Admin password should also contain a number


export enum PasswordErros {
  SHORT = 'Password is too short!',
  NO_UPPER_CASE = 'Upper case letter required!',
  NO_LOWER_CASE = 'Lower case letter required!',
  NO_NUMBER = 'At least one number required!'
}

export interface CheckResult {
  valid: boolean,
  reasons: PasswordErros[]
}
export class PasswordChecker {

  public checkPassword(password:string): CheckResult {

    const reasons:PasswordErros[] = [];

    this.checkForLength(password, reasons);

    this.checkForUpperCase(password, reasons);
    
    this.checkForLowerCase(password, reasons);
    
    return {
      valid: reasons.length > 0 ? false : true,
      reasons: reasons
    }
  }

  public checkAdminPassword(password: string): CheckResult {
    const basicCheck = this.checkPassword(password);
    this.checkForNumber(password, basicCheck.reasons);
    return {
      valid: basicCheck.reasons.length > 0 ? false : true,
      reasons: basicCheck.reasons
    }
  }

  private checkForNumber(password:string, reasons: PasswordErros[]) {
    const hasNumber = /\d/;
    if(!hasNumber.test(password)) {
      reasons.push(PasswordErros.NO_NUMBER);
    }
  }

  private checkForLength(password: string, reasons: PasswordErros[]) {
    if(password.length < 8) {
      reasons.push(PasswordErros.SHORT);
    }
  }

  private checkForUpperCase(password: string, reasons: PasswordErros[]) {
    if(password == password.toLowerCase()) {
      reasons.push(PasswordErros.NO_UPPER_CASE);
    }
  }

  private checkForLowerCase(password: string, reasons: PasswordErros[]) {
    if(password == password.toUpperCase()){
      reasons.push(PasswordErros.NO_LOWER_CASE)
    }
  }

}