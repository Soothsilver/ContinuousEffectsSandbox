import {Ability} from "../structures/Ability";
import {Effect, SingleModification} from "../structures/Effect";
import {Acquisition} from "../structures/Acquisition";
import {Layer} from "../StateCheck";
import {Permanent} from "../structures/Permanent";

class ScionOfTheWildModification implements SingleModification {
    getLayer(): Layer {
        return Layer.L7b_PnTSetSpecificValue;
    }

    asString(plural: boolean) {
        return (plural ? "have" : "has") + " power and toughness each equal to the number of creatures you control";
    }

    applyTo(target: Permanent, battlefield: Permanent[], source: Effect) {
        target.power = target.toughness = battlefield.filter((perm) => perm.typeline.isCreature() && !perm.controlledByOpponent).length;
        target.modificationLog.ptChanged = true;
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

    static create(name : string) : Ability {
        let ab = new Ability();
        ab.effect = NamedAbilities.createEffect(name);
        return ab;
    }
}