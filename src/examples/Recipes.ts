import {CardRecipe} from "./SampleLoader";

export class Recipes {
    static WoodlandChangeling : CardRecipe = {
        name: "Woodland Changeling",
        card: "2/2 Shapeshifter green creature",
        abilities: [["changeling"]]
    };
    static Forest: CardRecipe = {
        name : "Forest",
        card: "land",
        abilities: []
    };
    static TrainedArmodon: CardRecipe = {
        name: "Trained Armodon",
        card: "3/3 green Elephant creature",
        abilities: []
    };
    static Humility: CardRecipe = {
        name: "Humility",
        card: "white enchantment",
        abilities: [
            ["creatures", "silence", "setpt:1/1"]
        ]
    };
    static MycosynthLattice: CardRecipe = {
        name: "Mycosynth Lattice",
        card: "artifact",
        abilities: [
            ["addtype:artifact"],
            ["losecolors"]
        ]
    };
    static TitaniasSong : CardRecipe = {
        name : "Titania's Song",
        card : "green enchantment",
        abilities : [
            ["noncreature artifact", "silence", "addtype:creature", "setpt:4/4"]
        ]
    };
    static Opalescence: CardRecipe =  {
        "name": "Opalescence",
        "card": "white enchantment",
        "abilities": [
            ["other enchantment", "addtype:creature", "setpt:5/5"]
        ]
    };
}