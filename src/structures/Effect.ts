import {Permanent} from "./Permanent";
import {Acquisition} from "./Acquisition";
import {Layer} from "../enumerations/Layer";
import {capitalizeFirstLetter, ICopiable, shallowCopy} from "../Utilities";
import {Modification} from "./Modification";
import {LinkMap} from "../dependencies/LinkMap";
import {Ability} from "./Ability";
import {
    ChangelingModification, SetColorToModification, SetPowerToughnessModification,
    SetSubtypeModification
} from "./Modifications";

export class Effect implements ICopiable<Effect>{
    // Permanent features
    acquisition : Acquisition = new Acquisition();
    modification : Modification = new Modification();
    // Instance-specific features
    source : Permanent;
    timestamp: number;
    // Transient fields
    startedApplyingThisStateCheck: boolean;
    lastAppliedInLayer : Layer;
    dependsOn: Effect[];
    originalLink : Effect;

    /**
     * The objects this effect applies to during the current state check. If this is null, then these haven't yet
     * been determined.
     */
    acquisitionResults: Permanent[];

    blankTransientFields() {
        this.acquisitionResults = null;
        this.lastAppliedInLayer = Layer.L0_NoLayer;
        this.startedApplyingThisStateCheck = false;
        this.dependsOn = null;
        this.originalLink = null;
    }
    copy(): Effect {
        let ff = new Effect();
        ff.acquisition = this.acquisition;
        ff.modification = this.modification;
        ff.startedApplyingThisStateCheck = false;
        ff.acquisitionResults = shallowCopy(this.acquisitionResults);
        ff.lastAppliedInLayer = this.lastAppliedInLayer;
        ff.timestamp = this.timestamp;
        ff.dependsOn = shallowCopy(this.dependsOn);
        ff.originalLink = this.originalLink;
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
        for (let m  of this.modification.parts) {
            if (m.getLayer() == layer) {
                for (let o  of this.acquisitionResults) {
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


    createLinkedCopy(map : LinkMap) : Effect {
        let linkedCopy = new Effect();
        linkedCopy.acquisition = this.acquisition;
        linkedCopy.modification = this.modification;
        linkedCopy.source = map.getCopiedPermanent(this.source);
        linkedCopy.timestamp = this.timestamp;
        linkedCopy.startedApplyingThisStateCheck = this.startedApplyingThisStateCheck;
        linkedCopy.lastAppliedInLayer = this.lastAppliedInLayer;
        linkedCopy.originalLink = this;
        linkedCopy.acquisitionResults = null;
        if (this.acquisitionResults) {
            linkedCopy.acquisitionResults = [];
            for (let perm of this.acquisitionResults) {
                linkedCopy.acquisitionResults.push(map.getCopiedPermanent(perm));
            }
        }
        map.linkEffects(this, linkedCopy);

        return linkedCopy;
    }

    isCharacteristicDefiningAbility() {
        // 604.3a A static ability is a characteristic-defining ability if it meets the following criteria:
        // (1) It defines an object’s colors, subtypes, power, or toughness;
        // (5) it does not set the values of such characteristics only if certain conditions are met.
        let hasAGoodModification = false;
        for (let modif of this.modification.parts)  {
            if (modif instanceof SetColorToModification ||
                modif instanceof SetSubtypeModification ||
                modif instanceof SetPowerToughnessModification ||
                modif instanceof ChangelingModification) {
                hasAGoodModification = true;
            } else {
                return false;
            }
        }
        if (!hasAGoodModification) return false;
        // (3) it does not directly affect the characteristics of any other objects;
        if (this.acquisition.parts.length == 0) return false;
        for (let acq of this.acquisition.parts) {
            if (!acq.isSelf()) {
                return false;
            }
        }
        // (2) it is printed on the card it affects, it was granted to the token it affects by the effect that created the token,
        //     or it was acquired by the object it affects as the result of a copy effect or text-changing effect;
        // (4) it is not an ability that an object grants to itself; and
        let abilityThatGeneratesThis : Ability = null;
        for (let ability of this.source.abilities) {
            if (ability.effect == this) {
                abilityThatGeneratesThis = ability;
                break;
            }
        }
        if (abilityThatGeneratesThis == null) {
            console.error("This effect is not generated by an ability of the permanent it's on!");
        }
        if (abilityThatGeneratesThis.nonprinted) {
            return false;
        }
        return true;
    }
}