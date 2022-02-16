import { ROOT_TYPEID } from "./graph";
import { TypeID } from "./model";

/** TypeIndex maintains a two way index between type names and `TypeIDs` */
export class TypeIndex {
  private nextTypeID: TypeID;
  private readonly typeNameTypeIDLookup: Map<string, TypeID> = new Map();
  private readonly typeIDTypeNameLookup: Map<TypeID, string> = new Map();

  constructor() {
    this.nextTypeID = ROOT_TYPEID;
  }

  get size(): number {
    return this.typeNameTypeIDLookup.size;
  }

  /** lookup the type name for a `TypeID`
   * @throws if `TypeID` is not registered
   * */
  getTypeName(id: TypeID): string {
    const typeName = this.typeIDTypeNameLookup.get(id);
    if (typeName === undefined) {
      throw new Error(`Could not find type with ID ${id}`);
    }
    return typeName;
  }

  /** lookup the `TypeID` for a type name
   * @throws if the type name is not registered
   * */
  getTypeID(typeName: string, throws?: boolean): TypeID {
    const typeID = this.typeNameTypeIDLookup.get(typeName);
    if (typeID === undefined) {
      if (throws) {
        throw new Error(`Could not find TypeID for name ${typeName}`);
      }
      return this.register(typeName); // this ID should now be guaranteed to be unused across the graph
    }
    return typeID;
  }

  /** lookup a `TypeID` by name and register a new `TypeID` if not found */
  getOrCreate(typeName: string): TypeID {
    const typeID: TypeID | undefined = this.typeNameTypeIDLookup.get(typeName);
    if (typeID !== undefined) {
      return typeID;
    }

    return this.register(typeName);
  }

  /** register a new type */
  register(typeName: string): TypeID {
    const typeID: TypeID = this.nextTypeID++;
    this.typeNameTypeIDLookup.set(typeName, typeID);
    this.typeIDTypeNameLookup.set(typeID, typeName);
    return typeID;
  }
}
