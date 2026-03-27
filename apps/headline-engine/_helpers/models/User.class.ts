import Role from "./Role.class";

export class User {
  private _id: string;
  private _name: string;
  private _email: string;
  private _password?: string;
  private _provider: string;
  private _role: Role;
  private _tenantId?: string;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(user?: any) {
    this._id = user?.id ?? "";
    this._name = user?.name ?? "";
    this._email = user?.email ?? "";
    this._password = user?.password ?? "";
    this._provider = user?.provider ?? "";
    this._role = new Role(user?.role);
    this._tenantId = user?.tenantId ?? "";
    this._createdAt = user?.createdAt ?? new Date();
    this._updatedAt = user?.updatedAt ?? new Date();
  }

  get id(): string {
    return this._id;
  }
  set id(value: string) {
    this._id = value;
  }

  get name(): string {
    return this._name;
  }
  set name(value: string) {
    this._name = value;
  }

  get email(): string {
    return this._email;
  }
  set email(value: string) {
    this._email = value;
  }

  get password(): string | undefined {
    return this._password;
  }
  set password(value: string | undefined) {
    this._password = value;
  }

  get provider(): string {
    return this._provider;
  }
  set provider(value: string) {
    this._provider = value;
  }

  get role(): Role {
    return this._role;
  }
  set role(value: Role) {
    this._role = value;
  }

  get tenantId(): string | undefined {
    return this._tenantId;
  }
  set tenantId(value: string | undefined) {
    this._tenantId = value;
  }

  get createdAt(): Date {
    return this._createdAt;
  }
  get updatedAt(): Date {
    return this._updatedAt;
  }
  set updatedAt(value: Date) {
    this._updatedAt = value;
  }

  updateTimestamp(): void {
    this._updatedAt = new Date();
  }
}
