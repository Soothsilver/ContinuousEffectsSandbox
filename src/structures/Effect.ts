import { Permanent} from "./Card";
import {AddAbilityModification, PowerToughnessModification} from "./Modification";
import {Ability} from "./Ability";
import {Acquisition} from "./Acquisition";
import {Layer} from "../StateCheck";
import {capitalizeFirstLetter, ICopiable, joinList} from "../Utilities";

export interface SingleModification {
     getLayer() : Layer;
     toString(plural : boolean);
     applyTo(target: Permanent, battlefield: Permanent[], source: Permanent);
}

export class Modification  {
    parts: SingleModification[] = [];

    toString(multipleTargets : boolean) : string {
        let strs : string[] = [];
        for (let i = 0; i < this.parts.length; i++) {
            strs.push(this.parts[i].toString(multipleTargets));
        }
        return joinList(strs);
    }

    addPTModification(power: number, toughness: number) {
        this.parts.push(new PowerToughnessModification(power, toughness));
    }

    addGrantPrimitiveAbility(ab: Ability) {
        this.parts.push(new AddAbilityModification(ab));
    }
}

export class Effect implements ICopiable<Effect>{

    acquisition : Acquisition = new Acquisition();
    modification : Modification = new Modification();
    startedApplyingThisStateCheck: boolean;
    lastAppliedInLayer : Layer;
    source : Permanent;

    copy(): Effect {
        let ff = new Effect();
        ff.acquisition = this.acquisition;
        ff.modification = this.modification;
        ff.startedApplyingThisStateCheck = false;
        ff.lastAppliedInLayer = Layer.L0_NoLayer;
        return ff;
    }
    toString() : string {
        console.log(capitalizeFirstLetter(this.acquisition.toString()) + " " + this.modification.toString(this.acquisition.multipleTargets) + ".");
        return capitalizeFirstLetter(this.acquisition.toString()) + " " + this.modification.toString(this.acquisition.multipleTargets) + ".";
    }

    apply(battlefield: Permanent[], layer : Layer) {
        let affectedObjects : Permanent[] = this.acquisition.getAcquiredObjects(battlefield, this.source);
        for (let m  of this.modification.parts) {
            if (m.getLayer() == layer) {
                for (let o  of affectedObjects) {
                    m.applyTo(o, battlefield, this.source);
                }
                this.startedApplyingThisStateCheck = true;
            }
        }
    }
}