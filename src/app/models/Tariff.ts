export default class Tariff {
  constructor(
    public id?: number,
    public name?: string,
    public currency?: string,
    public rate?: number,
    public beginDate?: string,
    public endDate?: string,
    public description?: string,
    public categoryId?: number,
    public unitId?: number,
    public unitName?: string,
    public userId?: number
  ) {  }
}
