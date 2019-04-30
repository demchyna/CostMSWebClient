import Role from './Role';

export default class User {
  constructor(
    public id?: number,
    public firstName?: string,
    public lastName?: string,
    public username?: string,
    public password?: string,
    public email?: string,
    public createDate?: string,
    public description?: string,
    public authorities?: Role[]
  ) {  }
}
