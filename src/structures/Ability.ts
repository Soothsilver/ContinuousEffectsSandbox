
import {capitalizeFirstLetter, ICopiable} from "../Utilities";
import {Effect} from "./Effect";
import {Permanent} from "./Permanent";
import {Layer} from "../enumerations/Layer";
import {LinkMap} from "../dependencies/LinkMap";
import {LandType} from "../enumerations/LandType";
import {Color} from "./Typeline";

export class Ability implements ICopiable<Ability> {

    primitiveName : string = null;
    parseError : string = null;
    effect : Effect = new Effect();
    nonprinted : boolean = false;
    landwalk : LandType = null;
    protectionFrom : Color = null;
    modified: boolean;

    copy(): Ability {
        let copie = new Ability();
        copie.primitiveName = this.primitiveName;
        copie.parseError = this.parseError;
        copie.nonprinted = this.nonprinted;
        copie.effect = this.effect.copy();
        copie.modified = this.modified;
        copie.protectionFrom = this.protectionFrom;
        copie.landwalk = this.landwalk;
        return copie;
    }


    toCapitalizedString() : string {
        return capitalizeFirstLetter(this.toString());
    }
    toString() : string {
        if (this.primitiveName != null) {
            return this.primitiveName;
        } else if (this.landwalk != null) {
            return LandType[this.landwalk] + "walk";
        } else if (this.protectionFrom != null) {
            return "Protection from " + Color[this.protectionFrom].toLowerCase();
        } else if (this.parseError != null) {
            return "[[" + this.parseError + "]]";
        } else if (this.effect != null) {
            return this.effect.toString();
        } else {
            return "substance";
        }
    }

    copyAndInitialize(target: Permanent) : Ability {
        let ab = this.copy();
        ab.effect.source = target;
        ab.effect.acquisitionResults = null;
        ab.effect.dependsOn = null;
        ab.effect.lastAppliedInLayer = Layer.L0_NoLayer;
        ab.effect.timestamp = 9999; // Must be overwritten later!
        return ab;
    }

    hasEffect() : boolean {
        return this.primitiveName == null && this.parseError == null && this.effect != null;
    }

    createdLinkedAbility(map: LinkMap) : Ability {
        let linkedAbility = new Ability();
        linkedAbility.primitiveName = this.primitiveName;
        linkedAbility.parseError = this.parseError;
        linkedAbility.nonprinted = this.nonprinted;
        linkedAbility.modified = this.modified;
        linkedAbility.landwalk = this.landwalk;
        linkedAbility.protectionFrom = this.protectionFrom;
        let maybeEffectAlreadyExists = map.getCopiedEffect(this.effect);
        if (maybeEffectAlreadyExists != null) {
            linkedAbility.effect = maybeEffectAlreadyExists;
        } else {
            linkedAbility.effect = this.effect.createLinkedCopy(map);
        }
        return linkedAbility;
    }
}