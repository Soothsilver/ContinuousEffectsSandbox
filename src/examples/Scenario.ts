import {Card} from "../structures/Card";
import {CardRecipe, SampleLoader} from "./SampleLoader";
import {Permanent} from "../structures/Permanent";
import {StateCheck} from "../StateCheck";

export class Scenario {
    private battlefield : Permanent[] = [];
    private verification: (battlefield : Permanent[], self : Scenario) => void;
    public createdBattlefield : Permanent[] = [];
    name : string;

    constructor(name : string) {
        this.name = name;
    }

    public addCard(recipe : CardRecipe, controller : number = 1) : Scenario {
        let permanent = SampleLoader.createCard(recipe).asPermanent();
        if (controller == 2) {
            permanent.ownedByOpponent = true;
        }
        this.battlefield.push(permanent);
        return this;
    }
    public withVerification(verificator : (battlefield : Permanent[], self : Scenario) => void) : Scenario{
        this.verification = verificator;
        return this;
    }

    public execute() : void {
        const sc = new StateCheck();
        sc.perform(this.battlefield);
        this.createdBattlefield = this.battlefield;
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