import {Permanent} from "./structures/Card";
import {Effect} from "./structures/Effect";
import {deepCopy, shallowCopy} from "./Utilities";

export class StateCheck {
    private battlefield : Permanent[];

    perform(battlefield : Permanent[])
    {
        let phasedIns = [];
        for (let perm of battlefield) {
            if (!perm.phasedOut) {
                phasedIns.push(perm);
            }
        }
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
    }


    private getAllContinuousEffects() : Effect[] {
        let pole : Effect[] = [];
        for (let p of this.battlefield) {
            for (let ab of p.abilities) {
                if (ab.hasEffect()) {
                    pole.push(ab.effect);
                }
            }
        }
        return pole;
    }

    private getNextApplicableEffectForLayer(layer: Layer) : Effect {
        let ffs = this.getAllContinuousEffects();
        for(let ff of ffs) {
            if (ff.lastAppliedInLayer < layer) {
                for (let m of ff.modification.parts) {
                    if (m.getLayer() == layer) {
                        ff.lastAppliedInLayer = layer;
                        return ff;
                    }
                }
            }
        }
        return null;
    }

    private L0_ApplyPrintedCharacteristics() {
        for(let permanent of this.battlefield) {
            permanent.name = permanent.originalCard.name;
            permanent.toughness = permanent.originalCard.toughness;
            permanent.power = permanent.originalCard.power;
            permanent.typeline = permanent.originalCard.typeline.copy();
            permanent.abilities = deepCopy(permanent.originalCard.abilities);
            permanent.color = shallowCopy(permanent.originalCard.color);
            for (let ab of permanent.abilities) {
                ab.effect.source = permanent;
            }
        }
    }


    private applyLayer(layer: Layer) {
        while (true) {
            let effect: Effect = this.getNextApplicableEffectForLayer(layer);
            if (effect) {
                effect.apply(this.battlefield, layer);
            } else {
                break;
            }
        }
    }
}
export enum Layer {
    L0_NoLayer,
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