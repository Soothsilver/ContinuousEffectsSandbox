import {Permanent} from "./structures/Permanent";
import {Effect} from "./structures/Effect";
import {deepCopy, shallowCopy} from "./Utilities";

export class StateCheck {
    private battlefield : Permanent[];
    /**
     * Effects that have started to apply go here. These will apply in other layers to the same objects.
     */
    private effects : Effect[];
    private report : string;

    perform(battlefield : Permanent[])
    {
        this.report = "";
        let phasedIns = [];
        for (let perm of battlefield) {
            if (!perm.phasedOut) {
                phasedIns.push(perm);
            }
        }
        this.effects = [];
        this.battlefield = phasedIns;
        this.L0_ApplyPrintedCharacteristics();
        this.applyLayer(Layer.L1_Copy);
        this.applyLayer(Layer.L2_Control);
        this.applyLayer(Layer.L3_Text);
        this.applyLayer(Layer.L4_Type);
        this.applyLayer(Layer.L5_Color);
        this.applyLayer(Layer.L6_Abilities);
        this.applyLayer(Layer.L7a_PnTCharacteristicDefining);
        this.applyLayer(Layer.L7b_PnTSetSpecificValue);
        this.applyLayer(Layer.L7c_PnTModifications);
        for(let perm of battlefield) {
            for (let cntr of perm.counters) {
                perm.power += cntr.power;
                perm.toughness += cntr.toughness;
            }
        }
        this.applyLayer(Layer.L7e_PnTSwitch);
        this.report = this.report.substr("<br>".length);
    }

    private log(line: string) {
        this.report = this.report.concat("<br>", line);
    }


    private getAllContinuousEffects() : Effect[] {
        let pole : Effect[] = [];
        for (let ff of this.effects) {
            pole.push(ff);
        }
        for (let p of this.battlefield) {
            for (let ab of p.abilities) {
                if (ab.hasEffect()) {
                    let ff = ab.effect;
                    if (!pole.includes(ff)) {
                        pole.push(ab.effect);
                    }
                }
            }
        }
        return pole;
    }

    private getNextApplicableEffectForLayer(layer: Layer) : Effect {
        let ffs = this.getAllContinuousEffects();
        let bestEffect : Effect = null;
        let lowestTimestamp = Number.MAX_VALUE;
        outerFor: for(let ff of ffs) {
            if (ff.lastAppliedInLayer < layer) {
                for (let m of ff.modification.parts) {
                    if (m.getLayer() == layer) {
                        if (ff.timestamp < lowestTimestamp) {
                            lowestTimestamp = ff.timestamp;
                            bestEffect =ff;
                            continue outerFor;
                        }
                    }
                }
            }
        }
        if (bestEffect != null) {
            bestEffect.lastAppliedInLayer = layer;
        }
        return bestEffect;
    }

    private L0_ApplyPrintedCharacteristics() {
        for(let i = 0; i < this.battlefield.length; i++) {
            let permanent = this.battlefield[i];
            permanent.beginStateCheck(i);
        }
    }


    private applyLayer(layer: Layer) {
        while (true) {
            let effect: Effect = this.getNextApplicableEffectForLayer(layer);
            if (effect) {
                this.effects.push(effect);
                effect.apply(this.battlefield, layer);
                this.logEffect(effect, layer);
             } else {
                break;
            }
        }
    }

    private logEffect(effect: Effect, layer: Layer) {
        this.log("L" + StateCheck.layerToString(layer) + ": " + effect.asHtmlString(layer) + " <i><small>(" + effect.source.name + ", timestamp " + effect.timestamp +")</small></i>");
    }

    private static layerToString(layer: Layer) : string {
        switch (layer) {
            case Layer.L0_NoLayer:
                return "0";
            case        Layer.L1_Copy:
                return "1 (copy)";
            case        Layer.L2_Control:
                return "2 (control)";
            case        Layer.L3_Text:
                return "3 (text)";
            case        Layer.L4_Type:
                return "4 (type)";
            case         Layer.L5_Color:
                return "5 (color)";
            case      Layer.L6_Abilities:
                return "6 (ability)";
            case      Layer.L7a_PnTCharacteristicDefining:
                return "7a (CDA)";
            case      Layer.L7b_PnTSetSpecificValue:
                return "7b (set)";
            case      Layer.L7c_PnTModifications:
                return "7c (modify)";
            case     Layer.L7d_PnTCounters:
                return "7d (counters)";
            case     Layer.L7e_PnTSwitch:
                return "7e (switch)";
            default:
                return "UNKNOWN"
        }
    }

    getHtmlReport() : string {
        return this.report;
    }
}
export enum Layer {
    L0_NoLayer = 0,
    L1_Copy,
    L2_Control,
    L3_Text,
    L4_Type,
    L5_Color,
    L6_Abilities,
    L7a_PnTCharacteristicDefining,
    L7b_PnTSetSpecificValue,
    L7c_PnTModifications,
    L7d_PnTCounters,
    L7e_PnTSwitch
}