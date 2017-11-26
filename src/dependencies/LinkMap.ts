import {Permanent} from "../structures/Permanent";
import {Effect} from "../structures/Effect";

export class LinkedEntry<T> {
    original : T;
    copy : T;
    constructor(original : T, copy : T) {
        this.original = original;
        this.copy = copy;
    }
}

export class LinkMap {
    private permanentMap : LinkedEntry<Permanent>[] = [];
    private effectMap: LinkedEntry<Effect>[] = [];

    public linkPermanents(original : Permanent, copy : Permanent) {
        copy.originalLink = original;
        this.permanentMap.push(new LinkedEntry(original, copy));
    }
    public linkEffects(original : Effect, copy : Effect) {
        copy.originalLink = original;
        this.effectMap.push(new LinkedEntry(original, copy));
    }
    public getCopiedPermanent(original : Permanent) : Permanent {
        for (let entry of this.permanentMap) {
            if (entry.original == original) {
                return entry.copy;
            }
        }
        return null;
    }
    public getCopiedEffect(original : Effect) : Effect {
        for (let entry of this.effectMap) {
            if (entry.original == original) {
                return entry.copy;
            }
        }
        return null;
    }
}