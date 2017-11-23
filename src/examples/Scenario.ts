import {Card} from "../structures/Card";
import {CardRecipe, SampleLoader} from "./SampleLoader";
import {Permanent} from "../structures/Permanent";
import {StateCheck} from "../StateCheck";

export class Scenario {
    private battlefield : Card[] = [];
    private verification: (battlefield : Permanent[], self : Scenario) => void;
    public createdBattlefield : Permanent[] = [];
    name : string;

    constructor(name : string) {
        this.name = name;
    }

    public addCard(recipe : CardRecipe) : Scenario {
        this.battlefield.push(SampleLoader.createCard(recipe));
        return this;
    }
    public withVerification(verificator : (battlefield : Permanent[], self : Scenario) => void) : Scenario{
        this.verification = verificator;
        return this;
    }

    public execute() : void {
        const sc = new StateCheck();
        let trueBattlefield : Permanent[] = [];
        for (let bf of this.battlefield) {
            trueBattlefield.push(bf.asPermanent());
        }
        sc.perform(trueBattlefield);
        this.createdBattlefield = trueBattlefield;
    }

    public test() : void {
        this.execute();
        this.verification(this.createdBattlefield, this);
    }

    public find(permanentName : string) : Permanent {
        for (let pn of this.createdBattlefield) {
            if (pn.name == permanentName) {
                return pn;
            }
        }
        return null;
    }
}