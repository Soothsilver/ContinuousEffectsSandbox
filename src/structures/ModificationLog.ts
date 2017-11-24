import {Ability} from "./Ability";

export class ModificationLog {
    ptChanged : boolean = false;
    typesAdded : string[] = [];
    strickenAbilities: Ability[] = [];
    addType(aType : string) {
        this.typesAdded.push(aType.toLowerCase());
    }
    isTypeAdded(type : string) : boolean {
        if (type == undefined || type == null) {
            return false;
        }
        return this.typesAdded.includes(type.toLowerCase());
    }

    addStrickenAbility(ab: Ability) {
        this.strickenAbilities.push(ab);
    }
}