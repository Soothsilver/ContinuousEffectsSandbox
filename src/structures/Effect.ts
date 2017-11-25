import { Permanent} from "./Permanent";
import {AddAbilityModification, PowerToughnessModification} from "./Modification";
import {Ability} from "./Ability";
import {Acquisition} from "./Acquisition";
import {Layer} from "../StateCheck";
import {capitalizeFirstLetter, ICopiable, joinList, shallowCopy} from "../Utilities";

export interface SingleModification {
     getLayer() : Layer;

    asString(plural: boolean);
     applyTo(target: Permanent, battlefield: Permanent[], source: Effect);
}

export class Modification  {
    parts: SingleModification[] = [];

    toString(multipleTargets : boolean) : string {
        let strs : string[] = [];
        for (let i = 0; i < this.parts.length; i++) {
            strs.push(this.parts[i].asString(multipleTargets));
        }
        return joinList(strs);
    }

    addPTModification(power: number, toughness: number) {
        this.parts.push(new PowerToughnessModification(power, toughness));
    }

    addGrantPrimitiveAbility(ab: Ability) {
        this.parts.push(new AddAbilityModification(ab));
    }

    asHtmlString(multipleTargets: boolean, layer: Layer) {
        let strs : string[] = [];
        for (let i = 0; i < this.parts.length; i++) {
            let prt = this.parts[i].asString(multipleTargets);
            if (this.parts[i].getLayer() == layer) {
                prt = "<b>" + prt + "</b>";
            }
            strs.push(prt);
        }
        return joinList(strs);
    }
}

export class Effect implements ICopiable<Effect>{

    acquisition : Acquisition = new Acquisition();
    modification : Modification = new Modification();
    startedApplyingThisStateCheck: boolean;
    lastAppliedInLayer : Layer;
    source : Permanent;
    timestamp: number;
    /**
     * The objects this effect applies to during the current state check. If this is null, then these haven't yet
     * been determined.
     */
    acquisitionResults: Permanent[];

    copy(): Effect {
        let ff = new Effect();
        ff.acquisition = this.acquisition;
        ff.modification = this.modification;
        ff.startedApplyingThisStateCheck = false;
        ff.acquisitionResults = shallowCopy(this.acquisitionResults);
        ff.lastAppliedInLayer = Layer.L0_NoLayer;
        ff.timestamp = this.timestamp;
        return ff;
    }
    toString() : string {
        if (this.modification.parts.length ==0) {
            return "This ability does nothing.";
        }
        const mainPart = capitalizeFirstLetter(this.acquisition.toString()) + " " + this.modification.toString(this.acquisition.multipleTargets);
        if (mainPart.substr(mainPart.length -2,2) == '."') {
            return mainPart;
        } else {
            return mainPart+".";
        }
    }

    apply(battlefield: Permanent[], layer : Layer) {
        if (this.acquisitionResults == null) {
            this.acquisitionResults = this.acquisition.getAcquiredObjects(battlefield, this.source);
        }
        let affectedObjects : Permanent[] = this.acquisitionResults;
        for (let m  of this.modification.parts) {
            if (m.getLayer() == layer) {
                for (let o  of affectedObjects) {
                    m.applyTo(o, battlefield, this);
                }
                this.startedApplyingThisStateCheck = true;
            }
        }
        this.lastAppliedInLayer = layer;
    }

    asHtmlString(layer: Layer) {
        const mainPart = capitalizeFirstLetter(this.acquisition.toString()) + " " + this.modification.asHtmlString(this.acquisition.multipleTargets, layer);
        if (mainPart.substr(mainPart.length -2,2) == '."' ||
            mainPart.endsWith('."</b>')) {
            return mainPart;
        } else {
            return mainPart+".";
        }
    }
}