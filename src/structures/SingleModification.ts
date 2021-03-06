import {Layer} from "../enumerations/Layer";
import {Permanent} from "./Permanent";
import {Effect} from "./Effect";
import {ICopiable} from "../Utilities";

export interface SingleModification extends ICopiable<SingleModification> {
    getLayer(): Layer;

    asString(plural: boolean): string;

    applyTo(target: Permanent, battlefield: Permanent[], source: Effect): void;

    whatItDoes(target: Permanent, battlefield: Permanent[], source: Effect): string;
}