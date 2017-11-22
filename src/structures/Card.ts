
import {Color, CreatureSubtype, Type, Typeline} from "./Typeline";
import {Ability} from "./Ability";
import {deepCopy, getCssColor, shallowCopy} from "../Utilities";
import {ModificationLog} from "./ModificationLog";

export class Card {
    name : string;
    power : number;
    color: Color[] = [];
    toughness : number;
    typeline : Typeline = new Typeline();
    abilities: Ability[] = [];

    cssColor() : string {
        return getCssColor(this.color);
    }

    static createBear() : Card {
        let c = new Card();
        c.name = "Runeclaw Bear";
        c.power = 2;
        c.toughness = 2;
        c.typeline = Typeline.creature(CreatureSubtype.Bear);
        c.abilities = [ ];
        c.color = [ Color.Green ];
        return c;
    }

    static createArtifact() {
        let c = new Card();
        c.name = "Thing";
        c.typeline = new Typeline();
        c.typeline.types.push(Type.Artifact);
        c.abilities = [ ];
        c.color = [];
        return c;
    }

    asPermanent() : Permanent {
        return Permanent.fromCard(this);
    }
}
export class Counter {
    power: number;
    toughness: number;
    constructor(power:number,toughness:number) {
        this.power = power;
        this.toughness = toughness;
    }
    toString():string {
        return "+" + this.power + "/+" + this.toughness;
    }
}
export class Permanent {
    originalCard : Card;
    name: string;
    power : number;
    color: Color[];
    toughness : number;
    typeline: Typeline;
    controlledByOpponent: boolean;
    abilities: Ability[] = [];
    phasedOut: boolean;
    counters: Counter[] = [];
    modificationLog: ModificationLog = new ModificationLog();

    cssColor() : string {
        return getCssColor(this.color);
    }

    static fromCard(card : Card) : Permanent {
        let p = new Permanent();
        p.originalCard = card;
        return p;
    }

    addAbility(ability: Ability) {
        ability.nonprinted = true;
        this.abilities.push(ability);
    }

    beginStateCheck() {
        // Copy card
        this.name = this.originalCard.name;
        this.toughness = this.originalCard.toughness;
        this.power = this.originalCard.power;
        this.typeline = this.originalCard.typeline.copy();
        this.abilities = deepCopy(this.originalCard.abilities);
        this.color = shallowCopy(this.originalCard.color);
        // Blank status
        this.controlledByOpponent = false;
        this.modificationLog = new ModificationLog();
        for (let ab of this.abilities) {
            ab.effect.source = this;
            ab.effect.acquisitionResults = null;
        }
    }
}