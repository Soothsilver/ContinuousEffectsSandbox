import {Color, Type, Typeline} from "./Typeline";
import {Ability} from "./Ability";
import {getCssColor} from "../Utilities";
import {CreatureSubtype} from "./CreatureSubtype";
import {Permanent} from "./Permanent";

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
