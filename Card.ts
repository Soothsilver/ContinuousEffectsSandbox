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
class Typeline {
    types : Type[];
    creatureSubtypes : CreatureSubtype[];

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
}
class Card {
    name : string;
    power : number;
    toughness : number;
    typeline : Typeline;
    abilities: Ability[];


    static createBear() : Card {
        let c = new Card();
        c.name = "Runeclaw Bear";
        c.power = 2;
        c.toughness = 2;
        c.typeline = Typeline.creature(CreatureSubtype.Bear);
        c.abilities = [];
        return c;
    }
}
class Permanent {
    originalCard : Card;
    name: string;

    static fromCard(card : Card) : Permanent {
        let p = new Permanent();
        p.originalCard = card;
        return p;
    }
}