import {Effect} from "../structures/Effect";
import {StateCheck} from "../StateCheck";

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
    static determineEffectToApply(effects : Effect[], stateCheck : StateCheck) : Effect {
        if (effects.length > 0) {
            return effects[0];
        }
        return null;
    }
}