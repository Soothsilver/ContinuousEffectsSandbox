import {Ability} from "../structures/Ability";
import {Effect} from "../structures/Effect";
import {Acquisition} from "../structures/Acquisition";
import {Layer} from "../enumerations/Layer";
import {Permanent} from "../structures/Permanent";
import {SingleModificationBase} from "../structures/SingleModificationBase";
import {SingleModification} from "../structures/SingleModification";
import {Color} from "../structures/Typeline";

class ScionOfTheWildModification extends SingleModificationBase {
    getLayer(): Layer {
        return Layer.L7b_PnTSetSpecificValue;
    }

    asString(plural: boolean) {
        return (plural ? "have" : "has") + " power and toughness each equal to the number of creatures you control";
    }


    whatItDoes(target: Permanent, battlefield: Permanent[], source: Effect): string {
        return "SETPT:" + battlefield.filter((perm) => perm.typeline.isCreature() && !perm.controlledByOpponent).length;
    }

    applyTo(target: Permanent, battlefield: Permanent[], source: Effect) {
        target.power = target.toughness = battlefield.filter((perm) => perm.typeline.isCreature() && !perm.controlledByOpponent).length;
        target.modificationLog.ptChanged = true;
    }
}

class EmptyShrineKannushiModification extends SingleModificationBase {
    getLayer(): Layer {
        return Layer.L6_Abilities;
    }

    asString(plural: boolean): string {
        return (plural ? "have" : "has") + " protection from the colors of permanents you control";
    }

    applyTo(target: Permanent, battlefield: Permanent[], source: Effect): void {
        let myColors : Color[] = [];
        for (let perm of battlefield) {
            if (perm.controlledByOpponent == source.source.controlledByOpponent) {
                for (let clr of perm.color) {
                    if (!myColors.includes(clr)) {
                        myColors.push(clr);
                    }
                }
            }
        }
        for (let clr of myColors) {
            const protect = new Ability();
            protect.protectionFrom = clr;
            target.addAbility(protect, source);
        }
    }
}

export class NamedAbilities {

    private static createEffect(name : string) : Effect {
        let ff = new Effect();
        switch (name.toLowerCase()){
            case "ScionOfTheWild".toLowerCase():
                ff.acquisition.addSubjectThis();
                ff.modification.parts.push(new ScionOfTheWildModification());
                break;
            default:
                console.error("Unknown effect name:"+  name +";");
                break;
        }
        return ff;
    }

    static createSingleModification(name : string) : SingleModificationBase {
        switch (name.toLowerCase()) {
            case "EmptyShrineKannushi".toLowerCase():
                return new EmptyShrineKannushiModification();
        }
    }

    static create(name : string) : Ability {
        let ab = new Ability();
        ab.effect = NamedAbilities.createEffect(name);
        return ab;
    }
}