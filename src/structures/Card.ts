import {Color, Type, Typeline} from "./Typeline";
import {Ability} from "./Ability";
import {getCssColor} from "../Utilities";
import {CreatureSubtype} from "./CreatureSubtype";
import {Permanent} from "./Permanent";
import {CardRecipe} from "../examples/SampleLoader";

export class Card {
    name : string;
    power : number;
    color: Color[] = [];
    toughness : number;
    typeline : Typeline = new Typeline();
    abilities: Ability[] = [];
    recipe : CardRecipe = null;

    cssColor() : string {
        return getCssColor(this.color);
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
