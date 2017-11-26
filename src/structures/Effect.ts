import {Permanent} from "./Permanent";
import {Acquisition} from "./Acquisition";
import {Layer} from "../enumerations/Layer";
import {capitalizeFirstLetter, ICopiable, shallowCopy} from "../Utilities";
import {Modification} from "./Modification";

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


    createLinkedCopy() : Effect {
        let linkedCopy = new Effect();
        linkedCopy.acquisition = this.acquisition;
        linkedCopy.modification = this.modification;
        // TODO a link map is needed
        return this;
    }
}