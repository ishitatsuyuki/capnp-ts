/**
 * This file was **not** generated automatically. Historically it served as a template for the code generator.
 *
 * Notable differences from actual generated files are in comments below.
 *
 * @author jdiaz5513
 */

// Note that this is a relative import; in an autogenerated file this would be `import * as capnp from 'capnp-ts';`.
import * as capnp from '../../lib';

export class AddressBook extends capnp.Struct {

  static readonly _displayName = 'AddressBook';

  static readonly _id = '17808451228488270372';

  static readonly _size = new capnp.ObjectSize(0, 1);

  getPeople(): capnp.CompositeList<Person> {

    const list = capnp.CompositeList.fromPointer(Person, this._getPointer(0));

    list._validate(capnp.PointerType.LIST, capnp.ListElementSize.COMPOSITE, Person._size);

    return list;

  }

  initPeople(length: number): capnp.CompositeList<Person> {

    const list = capnp.CompositeList.fromPointer(Person, this._getPointer(0));

    list._initList(length);

    return list;

  }

}

declare namespace Person_PhoneNumber_Type {

  export const _id = '11006499543427037663';

}

enum Person_PhoneNumber_Type {
  MOBILE = 0,
  HOME = 1,
  WORK = 2,
}

class Person_Employment extends capnp.Struct {

  static readonly _displayName = 'Employment';
  static readonly _id = '10556236799154832310';
  static readonly _size = new capnp.ObjectSize(8, 4);

  static UNEMPLOYED = 0;
  static EMPLOYER = 1;
  static SCHOOL = 2;
  static SELF_EMPLOYED = 3;

  getSchool(): string {

    this._testWhich('employment', this.which(), 2);

    return this._getText(3);

  }

  isSchool(): boolean {

    return this.which() === 2;

  }

  isUnemployed(): boolean {

    return this.which() === 0;

  }

  setSchool(value: string): void {

    this._setUint16(4, Person_Employment.SCHOOL);
    this._setText(3, value);

  }

  setUnemployed(): void {

    this._setUint16(4, Person_Employment.UNEMPLOYED);

  }

  which(): number {

    return this._getUint16(4);

  }

}

class Person_PhoneNumber extends capnp.Struct {

  static readonly _displayName = 'PhoneNumber';
  static readonly _id = '14675240430761680076';
  static readonly _size = new capnp.ObjectSize(2, 1);

  static readonly Type = Person_PhoneNumber_Type;

  getNumber(): string {

    return this._getText(0);

  }

  getType(): Person_PhoneNumber_Type {

    return this._getUint16(0);

  }

  setNumber(value: string): void {

    this._setText(0, value);

  }

  setType(value: Person_PhoneNumber_Type): void {

    this._setUint16(0, value);

  }

}

export class Person extends capnp.Struct {

  static readonly _displayName = 'Person';
  static readonly _id = '17274617303248433412';
  static readonly _size = new capnp.ObjectSize(8, 4);

  static readonly Employment = Person_Employment;
  static readonly PhoneNumber = Person_PhoneNumber;

  static toString() {

    return 'Person';

  }

  getEmail(): string {

    return this._getText(1);

  }

  getEmployment(): Person_Employment {

    return this._getAs(Person_Employment);

  }

  getId(): number {

    return this._getUint32(0);

  }

  getName(): string {

    return this._getText(0);

  }

  getPhones(): capnp.CompositeList<Person_PhoneNumber> {

    const list = capnp.CompositeList.fromPointer(Person_PhoneNumber, this._getPointer(2));

    list._validate(capnp.PointerType.LIST, capnp.ListElementSize.COMPOSITE, Person_PhoneNumber._size);

    return list;

  }

  initPhones(length: number): capnp.CompositeList<Person_PhoneNumber> {

    const list = capnp.CompositeList.fromPointer(Person_PhoneNumber, this._getPointer(2));

    list._initList(length);

    return list;

  }

  setEmail(value: string): void {

    this._setText(1, value);

  }

  setId(value: number): void {

    this._setUint32(0, value);

  }

  setName(value: string): void {

    this._setText(0, value);

  }

}
