import {Effect} from "../structures/Effect";
import {StateCheck} from "../StateCheck";
import {Layer} from "../enumerations/Layer";
import {Permanent} from "../structures/Permanent";
import {LinkMap} from "./LinkMap";
import {shallowCopy} from "../Utilities";

export class DependencySort {
    /**
    (Throughout the algorithm, memoize any dependencies (or lack of dependency) you discover.
    INPUT: a list of continuous effects applicable in this layer in timestamp order
    OUTPUT: the effect to apply, or null if the effects list is empty
    1. Perform a depth-first search on the first effect.
     If there is no dependency, then the first effect is the result.
     If there is a dependency, and the effect transitively depends on itself, then the first effect is the result.
     Otherwise, move on to the next effect.
    2. Continue doing step 2 for other effects, in order, until an effect is the result.
   */
    static determineEffectToApply(effects : Effect[], stateCheck : StateCheck, layer : Layer) : Effect {
        if (effects.length == 0) {
            return null;
        }
        if (effects.length == 1) {
            return effects[0];
        }
        // Calculate dependency graph
        for(let main of effects) {
            main.dependsOn = [];
            for(let on of effects) {
                if (main != on) {
                    if (DependencySort.dependsOn(main, on, stateCheck, layer)) {
                        main.dependsOn.push(on);
                    }
                }
            }
        }

        // Remove cycles
        DependencySort.removeCycles(effects, stateCheck);

        for (let ff of effects) {
            if (ff.dependsOn.length == 0) {
                return ff;
            } else {
                stateCheck.logSkippedEffect(ff, layer);
            }
        }
        console.error("There is an unresolvable dependency loop. This is a bug.");
        return effects[0];
    }

    private static removeCycles(effects: Effect[], stateCheck : StateCheck) {
        // First, mark all edges to be removed.
        let markededges : [Effect,Effect][] = [];

        for (let root of effects) {
            let fx2 = shallowCopy(effects);
            DependencySort.removeFromArray(fx2, root);
            DependencySort.removeRecursively([root], fx2, markededges, stateCheck);
        }

        // Second, remove them
        for (let pair of markededges) {
            let indexOfOther = pair[0].dependsOn.indexOf(pair[1]);
            if (indexOfOther != -1) {
                pair[0].dependsOn.splice(indexOfOther, 1);
            }
        }
    }

    private static removeFromArray(effects : Effect[], what : Effect) {
        let index = effects.indexOf(what);
        effects.splice(index, 1);
    }


    /**
     * 613.7a An effect is said to “depend on” another if
     * (a) it’s applied in the same layer (and, if applicable, sublayer) as the other effect (see rules 613.1 and 613.3);
     * (b) applying the other would change the text or the existence of the first effect, what it applies to, or what it does to any of the things it applies to; and
     * (c) neither effect is from a characteristic-defining ability or both effects are from characteristic-defining abilities.
     * Otherwise, the effect is considered to be independent of the other effect.
     *
     * @param {Effect} mainEffect The effect that may depend on another.
     * @param {Effect} dependsOnThis The effect on which the first one might depend. The list of all continuous effects in play.
     * @param {StateCheck} stateCheck The entire world.
     * @param {Layer} layer What layer are we solely interested in.
     * @returns {boolean} Whether the main effect depends on the second effect.
     */
    private static dependsOn(mainEffect: Effect, dependsOnThis: Effect, stateCheck: StateCheck, layer : Layer) : boolean {

        // (a) already determined above
        // (c) already determined above
        let whatItAppliesTo = mainEffect.acquisitionResults;
        if (whatItAppliesTo == null) {
            whatItAppliesTo = mainEffect.acquisition.getAcquiredObjects(stateCheck.battlefield, mainEffect.source);
        }
        let whatItDoes = mainEffect.modification.whatItDoes(stateCheck.battlefield, mainEffect, whatItAppliesTo, layer);
        let oldText = mainEffect.toString();

        // Apply the other effect to a copy of the battlefield
        let stateCheckCopy = DependencySort.createCopiedLinkedGameState(stateCheck);
        let battlefieldCopy = stateCheckCopy.battlefield;
        let effectsInTheNewBattlefield_beforeSubEffect : Effect[] = stateCheckCopy.getAllContinuousEffects();
        let subEffectInTheNewBattlefield : Effect = effectsInTheNewBattlefield_beforeSubEffect.find((ff)=>ff.originalLink == dependsOnThis);
        if (subEffectInTheNewBattlefield == undefined) {
            console.error("Subeffect not found in battlefield copy. This should not happen and is a bug.");
            return false;
        }
        subEffectInTheNewBattlefield.apply(battlefieldCopy, layer);
        let effectsInTheNewBattlefield : Effect[] = stateCheckCopy.getAllContinuousEffects();
        let mainEffectInTheNewBattlefield : Effect = effectsInTheNewBattlefield.find((ff)=> ff.originalLink == mainEffect);

        // Determine what has happened

        // (b) cause it to not exist...
        if (mainEffectInTheNewBattlefield == undefined) {
            return true;
        }
        // (b) ...change the text...
        let newText = mainEffectInTheNewBattlefield.toString();
        if (newText != oldText) {
            return true;
        }


        // (b) ...change what it applies to...
        let whatItAppliesTo2 = mainEffectInTheNewBattlefield.acquisitionResults;
        if (whatItAppliesTo2 == null) {
            whatItAppliesTo2 = mainEffectInTheNewBattlefield.acquisition.getAcquiredObjects(battlefieldCopy, mainEffectInTheNewBattlefield.source);
        }
        if (whatItAppliesTo2.length != whatItAppliesTo.length) {
            return true;
        }
        for (let subject of whatItAppliesTo2) {
            if (whatItAppliesTo.some((oldtarget)=> subject.originalLink == oldtarget)) {
                // ok
            } else {
                return true;
            }
        }
        // (b) ...change what it does to those things
        let whatItDoes2 = mainEffectInTheNewBattlefield.modification.whatItDoes(battlefieldCopy, mainEffectInTheNewBattlefield, whatItAppliesTo2, layer);
        if (whatItDoes != whatItDoes2) {
            return true;
        }

        // No dependency found.
        return false;
    }

    private static createCopiedLinkedGameState(original: StateCheck) : StateCheck {
        let map = new LinkMap();
        let originalEffects = original.effects;
        let originalField = original.battlefield;
        let newEffects  : Effect[] = [];
        let newField : Permanent[] = [];
        for (let perm of originalField) {
            let copy = new Permanent();
            map.linkPermanents(perm, copy);
            newField.push(copy);
        }
        for (let originalFx of originalEffects) {
            let newFx = originalFx.createLinkedCopy(map);
            newEffects.push(newFx);
        }

        for (let perm of newField) {
            perm.assumeCharacteristicsOfOriginal(map);
        }
        return new StateCheck(newField, newEffects);
    }

    private static removeRecursively(prefix: Effect[], unusedVertices: Effect[], markedEdges: [Effect, Effect][], stateCheck : StateCheck) {
        let root = prefix[0];
        for (let edge of prefix[prefix.length - 1].dependsOn) {
            if (edge == root) {
                // Dependency found.
                for(let i = 0; i < prefix.length; i++) {
                    if (i < prefix.length - 1) {
                        markedEdges.push([prefix[i], prefix[i+1]]);
                    } else {
                        markedEdges.push([prefix[i], root]);
                    }
                }
                stateCheck.logDependencyLoop(prefix);
            } else {
                for (let vtx of unusedVertices) {
                    let prefix2 = shallowCopy(prefix);
                    let unused2 = shallowCopy(unusedVertices);
                    DependencySort.removeFromArray(unused2, vtx);
                    prefix2.push(vtx);
                    DependencySort.removeRecursively(prefix2, unused2, markedEdges, stateCheck);
                }
            }
        }
    }
}