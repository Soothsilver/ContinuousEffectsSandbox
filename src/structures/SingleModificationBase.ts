import {Effect} from "./Effect";
import {Layer} from "../enumerations/Layer";
import {Permanent} from "./Permanent";
import {SingleModification} from "./SingleModification";

export abstract class SingleModificationBase implements SingleModification {
    abstract getLayer(): Layer;
    abstract asString(plural: boolean): string;
    abstract applyTo(target: Permanent, battlefield: Permanent[], source: Effect): void;

    whatItDoes(target: Permanent, battlefield: Permanent[], source: Effect): string {
        return "ConstantEffect";
    }

}