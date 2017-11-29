import {CreatureSubtype} from "./CreatureSubtype";
import {EnumEx} from "../utils/EnumEx";
import {LandType} from "../enumerations/LandType";
import {WordParser} from "../utils/WordParser";

export enum Type {
    Artifact,
    Enchantment,
    Creature,
    Land
}
export function stringToType(word: string) : Type {
    switch (word){
        case "artifact": return Type.Artifact;
        case "artifacts": return Type.Artifact;
        case "enchantment": return Type.Enchantment;
        case "enchantments": return Type.Enchantment;
        case "creature": return Type.Creature;
        case "creatures": return Type.Creature;
        case "land": return Type.Land;
        case "lands": return Type.Land;
        default: return null;
    }
}

export function stringToSubtype(word: string) : CreatureSubtype {
    for (let s of EnumEx.getValues(CreatureSubtype)) {
        if (word.toLowerCase() == CreatureSubtype[s].toLowerCase()) {
            return s;
        }
    }
    return null;
}
export enum ArtifactSubtype {
    Equipment,
    Vehicle
}
export enum Color {
    Red,
    Green,
    White,
    Blue,
    Black
}

export function stringToColor(word: string) : Color {
    switch (word){
        case "red": return Color.Red;
        case "blue": return Color.Blue;
        case "green": return Color.Green;
        case "white": return Color.White;
        case "black": return Color.Black;
        default: return null;
    }
}
export function stringToLandType(word: string) : LandType {
    return WordParser.parseLandType(word);
}
export class Typeline {
    types : Type[] = [];
    creatureSubtypes : CreatureSubtype[] = [];

    asString() : string {
        let s = "";
        for (let i = 0; i < this.types.length; i++){
            s += Type[this.types[i]] + " ";
        }
        if (this.creatureSubtypes.length > 0) {
            s += " - ";
            for (let i = 0; i < this.creatureSubtypes.length; i++) {
                s += CreatureSubtype[this.creatureSubtypes[i]] + " ";
            }
        }

        return s;
    }
    isCreature(): boolean {
        return this.types.includes(Type.Creature);
    }

    static creature(...subtypes: CreatureSubtype[]) : Typeline {
        let tl = new Typeline();
        tl.types = [Type.Creature];
        tl.creatureSubtypes = subtypes;
        return tl;
    }

    stringifyType(type : Type) : string {
        return Type[type];
    }
    stringifySubtype(type : CreatureSubtype) : string {
        return CreatureSubtype[type];
    }

    copy() : Typeline {
        let t = new Typeline();
        for (let a of this.types) {
            t.types.push(a);
        }
        for (let b of this.creatureSubtypes) {
            t.creatureSubtypes.push(b);
        }
        return t;
    }
}