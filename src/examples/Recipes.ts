import {CardRecipe} from "./SampleLoader";
import {Color} from "../structures/Typeline";
import {LandType} from "../enumerations/LandType";

export class Recipes {
    static WoodlandChangeling : CardRecipe = {
        name: "Woodland Changeling",
        card: "2/2 Shapeshifter green creature",
        abilities: [["changeling"]]
    };
    static Forest: CardRecipe = {
        name : "Forest",
        card: "land Forest",
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
    static ZodiacHorse: CardRecipe = {
        name: "Zodiac Horse",
        card: "3/3 green Horse",
        abilities: [["islandwalk"]]
    };
    static RuneclawBear: CardRecipe = {
        name: "Runeclaw Bear",
        card: "2/2 green Bear",
        abilities: []
    };
    static Thing: CardRecipe = {
        name: "Thing",
        card: "artifact",
        abilities: []
    };
    static HonorOfThePure: CardRecipe = {
        name: "Honor of the Pure",
        card: "white enchantment",
        abilities: [["white creatures youcontrol", "+1/+1"]]
    };
    static Urborg: CardRecipe = {
        name: "Urborg, Tomb of Yawgmoth",
        card: "land",
        abilities: [[ "lands", "addsubtype:Swamp" ]]
    };
    static BloodMoon: CardRecipe ={
        name: "Blood Moon",
        card: "red enchantment",
        abilities: [[ "lands", "setsubtype:Mountain" ]]
    };
    static Mountain: CardRecipe = {
        name: "Mountain",
        card:"Mountain land",
        abilities: []
    };
    static PaintersServant(color: Color) {
        return {
            "name" : "Painter's Servant",
            "card" : "artifact creature Scarecrow",
            "abilities" : [
                ["addcolor:" + Color[color].toLowerCase()]
            ]
        }
    }

    static MindBend(from: LandType, to: LandType) : CardRecipe {
        return {
            "name": "Mind Bend",
            "card": "blue enchantment",
            "abilities": [
                [
                    "creatures", "changetype:" + LandType[from].toLowerCase() + "=>" + LandType[to].toLowerCase()
                ]
            ]
        }
    }
}