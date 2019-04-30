export default class Funds {
  constructor(
    public id?: number,
    public date?: string,
    public source?: string,
    public value?: number,
    public currency?: string,
    public type?: FundsType,
    public description?: string,
    public userId?: number
  ) {  }
}

export enum FundsType {
  INCOME, OUTLAY
}
