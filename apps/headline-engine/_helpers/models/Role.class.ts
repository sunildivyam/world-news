export default class Role {
  private _id: string;
  private _name: string;
  private _permissions: string[];

  constructor(roleData?: Role) {
    this._id = roleData?.id || "";
    this._name = roleData?.name || "";
    this._permissions = roleData?.permissions || [];
  }

  get id(): string {
    return this._id;
  }

  set id(id: string) {
    this._id = id;
  }

  get name(): string {
    return this._name;
  }

  set name(name: string) {
    this._name = name;
  }

  get permissions(): string[] {
    return this._permissions;
  }

  set permissions(permissions: string[]) {
    this._permissions = permissions;
  }

  addPermission(permissions: string[]): void {
    permissions.forEach((p) => {
      if (!this._permissions.includes(p)) {
        this._permissions.push(p);
      }
    });
  }

  removePermission(permissions: string[]): void {
    this._permissions = this._permissions.filter(
      (p) => !permissions.includes(p),
    );
  }
}
