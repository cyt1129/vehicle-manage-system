export class User {
  private _id: string;
  private _email: string;
  private _companyName: string;
  private _authority: string;

  private _firstName: string;
  private _lastName: string;

  private _country: string;
  private _state: string;
  private _city: string;
  private _address: string;
  private _zip: string;
  private _phone: string;

  private _description: string;


  get id(): string {
    return this._id;
  }

  get email(): string {
    return this._email;
  }

  get companyName(): string {
    return this._companyName;
  }

  get authority(): string {
    return this._authority;
  }

  get firstName(): string {
    return this._firstName;
  }

  get lastName(): string {
    return this._lastName;
  }

  get country(): string {
    return this._country;
  }

  get state(): string {
    return this._state;
  }

  get city(): string {
    return this._city;
  }

  get address(): string {
    return this._address;
  }

  get zip(): string {
    return this._zip;
  }

  get phone(): string {
    return this._phone;
  }

  get description(): string {
    return this._description;
  }

  set id(value: string) {
    if (value)
      this._id = value;
  }

  set email(value: string) {
    if (value)
      this._email = value;
  }

  set companyName(value: string) {
    if (value)
      this._companyName = value;
  }

  set authority(value: string) {
    if (value)
      this._authority = value;
  }

  set firstName(value: string) {
    if (value)
      this._firstName = value;
  }

  set lastName(value: string) {
    if (value)
      this._lastName = value;
  }

  set country(value: string) {
    if (value)
      this._country = value;
  }

  set state(value: string) {
    if (value)
      this._state = value;
  }

  set city(value: string) {
    if (value)
      this._city = value;
  }

  set address(value: string) {
    if (value)
      this._address = value;
  }

  set zip(value: string) {
    if (value)
      this._zip = value;
  }

  set phone(value: string) {
    if (value)
      this._phone = value;
  }

  set description(value: string) {
    if (value)
      this._description = value;
  }

// constructor() {
  //   this.id = "";
  //   this.email = "";
  //   this.companyName = "";
  //   this.authority = "";
  //   this.firstName = "";
  //   this.lastName = "";
  //   this.country = "";
  //   this.state = "";
  //   this.city = "";
  //   this.address = "";
  //   this._zip = "";
  //   this.phone = "";
  //   this.description = "";
  // }
}
