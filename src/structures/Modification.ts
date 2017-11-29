import {Ability} from "./Ability";
import {Layer} from "../enumerations/Layer";
import {Permanent} from "./Permanent";
import {Effect} from "./Effect";
import {SingleModification} from "./SingleModification";
import {deepCopy, joinList} from "../Utilities";
import {AddAbilityModification, PowerToughnessModification} from "../effects/Modifications";

export class Modification {
    parts: SingleModification[] = [];

    toString(multipleTargets: boolean): string {
        let strs: string[] = [];
        for (let i = 0; i < this.parts.length; i++) {
            strs.push(this.parts[i].asString(multipleTargets));
        }
        return joinList(strs);
    }
    copy() : Modification {
        let pparts : SingleModification[] = deepCopy(this.parts);
        let m = new Modification();
        m.parts = pparts;
        return m;
    }

    asHtmlString(multipleTargets: boolean, layer: Layer) {
        let strs: string[] = [];
        for (let i = 0; i < this.parts.length; i++) {
            let prt = this.parts[i].asString(multipleTargets);
            if (this.parts[i].getLayer() == layer) {
                prt = "<b>" + prt + "</b>";
            }
            strs.push(prt);
        }
        return joinList(strs);
    }

    whatItDoes(battlefield: Permanent[], source: Effect, whatItAppliesTo: Permanent[], layer: Layer): string {
        let dryRun = "";
        for (let part of this.parts) {
            if (part.getLayer() == layer) {
                for (let trg of whatItAppliesTo) {
                    dryRun += part.whatItDoes(trg, battlefield, source) + ";"
                }
            }
        }
        return dryRun;
    }

}