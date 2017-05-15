import initTrace from 'debug';

import {
  INVARIANT_UNREACHABLE_CODE,
  PTR_ADOPT_WRONG_MESSAGE,
  PTR_ALREADY_ADOPTED,
  PTR_INVALID_POINTER_TYPE,
} from '../../errors';
import {format} from '../../util';
import {ListElementSize} from '../list-element-size';
import {ObjectSize} from '../object-size';
import {Pointer} from './pointer';
import {PointerType} from './pointer-type';

const trace = initTrace('capnp:orphan');
trace('load');

// Technically speaking this class doesn't need to be generic, but the extra type checking enforced by this helps to
// make sure you don't accidentally adopt a pointer of the wrong type.

export class Orphan<T extends Pointer> extends Pointer {

  private _capId?: number;
  private _elementSize?: ListElementSize;
  private _length?: number;
  private _size?: ObjectSize;
  private _type?: PointerType;

  constructor(src: T) {

    const c = src._getContent();

    super(c.segment, c.byteOffset);

    // Read vital info from the src pointer so we can reconstruct it during adoption.

    this._type = src._getTargetPointerType();

    switch (this._type) {

      case PointerType.STRUCT:

        this._size = src._getTargetStructSize();

        break;

      case PointerType.LIST:

        this._length = src._getTargetListLength();
        this._elementSize = src._getTargetListElementSize();

        break;

      case PointerType.OTHER:

        this._capId = src._getCapabilityId();

        break;

      default:

        throw new Error(PTR_INVALID_POINTER_TYPE);

    }

    // Zero out the source pointer (but not the contents!).

    src._erasePointer();

  }

  adopt(dst: T): void {

    if (this._type === undefined) throw new Error(format(PTR_ALREADY_ADOPTED, this));

    // TODO: Implement copy semantics when this happens.
    if (this.segment.message !== dst.segment.message) throw new Error(format(PTR_ADOPT_WRONG_MESSAGE, this, dst));

    const res = dst._initPointer(this.segment, this.byteOffset);

    switch (this._type) {

      case PointerType.STRUCT:

        if (this._size === undefined) throw new Error(INVARIANT_UNREACHABLE_CODE);

        res.pointer._setStructPointer(res.offsetWords, this._size);

        break;

      case PointerType.LIST:

        if (this._length === undefined || this._elementSize === undefined) throw new Error(INVARIANT_UNREACHABLE_CODE);

        res.pointer._setListPointer(res.offsetWords, this._elementSize, this._length, this._size);

        break;

      case PointerType.OTHER:

        if (this._capId === undefined) throw new Error(INVARIANT_UNREACHABLE_CODE);

        res.pointer._setInterfacePointer(this._capId);

        break;

      default:

        throw new Error(PTR_INVALID_POINTER_TYPE);

    }

    this._type = undefined;

  }

  dispose(): void {

    switch (this._type) {

      case PointerType.STRUCT:

        if (this._size === undefined) throw new Error(INVARIANT_UNREACHABLE_CODE);

        this.segment.fillZeroWords(this.byteOffset, this._size.getWordLength());

        break;

      case PointerType.LIST:

        if (this._length === undefined || this._elementSize === undefined) throw new Error(INVARIANT_UNREACHABLE_CODE);

        const byteLength = Pointer._getListByteLength(this._elementSize, this._length, this._size);
        this.segment.fillZeroWords(this.byteOffset, byteLength);

        break;

      default:

        // Other pointer types don't actually have any content.

        break;

    }

    this._type = undefined;

  }

}