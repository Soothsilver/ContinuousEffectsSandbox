import {Permanent} from "./structures/Permanent";
import {Effect} from "./structures/Effect";
import {DependencySort} from "./dependencies/DependencySort";
import {Layer} from "./enumerations/Layer";

export class StateCheck {
    get effects(): Effect[] {
        return this._effects;
    }
    /**
     * All permanents on the battlefield.
     */
    private _battlefield : Permanent[];
    /**
     * Effects that have started to apply go here. These will apply in other layers to the same objects.
     */
    private _effects : Effect[];
    /** Human-readable explanation of how effects were applied. */
    private report : string;

    get battlefield(): Permanent[] {
        return this._battlefield;
    }

    constructor(field : Permanent[] = undefined, effects : Effect[] = undefined) {
        this._effects = effects;
        this._battlefield = field;
    }
    perform(battlefield : Permanent[])
    {
        this.report = "";
        let phasedIns = [];
        for (let perm of battlefield) {
            if (!perm.phasedOut) {
                phasedIns.push(perm);
            }
        }
        this._effects = [];
        this._battlefield = phasedIns;
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
        if (this.report.length == 0) {
            this.report = "<br>No continuous effects modify the characteristics of permanents.";
        }
        this.report = this.report.substr("<br>".length);

    }

    private log(line: string) {
        this.report = this.report.concat("<br>", line);
    }


    public getAllContinuousEffects() : Effect[] {
        let pole : Effect[] = [];
        for (let ff of this._effects) {
            pole.push(ff);
        }
        for (let p of this._battlefield) {
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
        // Get all effects
        let ffs = this.getAllContinuousEffects();
        // Get only those in this layer
        ffs = ffs.filter((effect: Effect) => {
            return effect.lastAppliedInLayer < layer && effect.modification.parts.some((part) => part.getLayer() == layer);
        });
        // Order them by timestamp.
        ffs.sort((a, b) => {
            return a.timestamp < b.timestamp ? -1 : (a.timestamp == b.timestamp ? 0 : 1);
        });
        return DependencySort.determineEffectToApply(ffs, this, layer);
    }

    private L0_ApplyPrintedCharacteristics() {
        for(let i = 0; i < this._battlefield.length; i++) {
            let permanent = this._battlefield[i];
            permanent.beginStateCheck(i);
        }
    }


    private applyLayer(layer: Layer) {
        while (true) {
            let effect: Effect = this.getNextApplicableEffectForLayer(layer);
            if (effect) {
                if (!this._effects.includes(effect)) {
                    this._effects.push(effect);
                }
                effect.apply(this._battlefield, layer);
                this.logEffect(effect, layer);
             } else {
                break;
            }
        }
    }

    private logEffect(effect: Effect, layer: Layer) {
        this.log("L" + StateCheck.layerToString(layer) + ": " + effect.asHtmlString(layer) + " <i><small>(" + effect.source.name + ", timestamp " + effect.timestamp +")</small></i>");
    }
    public logSkippedEffect(effect: Effect, layer: Layer) {
        this.log("<del>L" + StateCheck.layerToString(layer) + ": " + effect.asHtmlString(layer) + "</del> <i><small>(" + effect.source.name + ", dependent)</small></i>");
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
