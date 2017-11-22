export class ModificationLog {
    ptChanged : boolean = false;
    typesAdded : string[] = [];
    addType(aType : string) {
        this.typesAdded.push(aType.toLowerCase());
    }
    isTypeAdded(type : string) : boolean {
        if (type == undefined || type == null) {
            return false;
        }
        console.log(type);
        return this.typesAdded.includes(type.toLowerCase());
    }
}