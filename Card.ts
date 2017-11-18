enum Type {
    Artifact,
    Enchantment,
    Creature,
    Land
}
enum CreatureSubtype {
    Bear,
    Elephant
}
enum ArtifactSubtype {
    Equipment,
    Vehicle
}
enum LandSubtype {
    Plains,
    Island,
    Swamp,
    Mountain,
    Forest
}
enum Color {
    Red,
    Green,
    White,
    Blue,
    Black
}
class Typeline {
    types : Type[] = [];
    creatureSubtypes : CreatureSubtype[] = [];

    asString() : string {
        let s = "";
        for (let i = 0; i < this.types.length; i++){
            s += Type[this.types[i]] + " ";
        }
        if (this.creatureSubtypes.length > 0) {
            s += " - ";
            for (let i = 0; i < this.types.length; i++) {
                s += CreatureSubtype[this.creatureSubtypes[i]] + " ";
            }
        }

        return s;
    }

    static creature(...subtypes: CreatureSubtype[]) : Typeline {
        let tl = new Typeline();
        tl.types = [Type.Creature];
        tl.creatureSubtypes = subtypes;
        return tl;
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
class Card {
    name : string;
    power : number;
    color: Color[];
    toughness : number;
    typeline : Typeline;
    abilities: Ability[];

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
}
class Permanent {
    originalCard : Card;
    name: string;
    power : number;
    color: Color[];
    toughness : number;
    typeline: Typeline;
    abilities: Ability[];
    phasedOut: boolean;

    cssColor() : string {
        return getCssColor(this.color);
    }

    static fromCard(card : Card) : Permanent {
        let p = new Permanent();
        p.originalCard = card;
        return p;
    }
}