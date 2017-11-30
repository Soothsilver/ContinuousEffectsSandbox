import {Scenario} from "./Scenario";
import {CardRecipe} from "./SampleLoader";
import {Recipes} from "./Recipes";
import {expect} from "chai";
import {Color, Type} from "../structures/Typeline";
import {CreatureSubtype} from "../structures/CreatureSubtype";
import {LandType} from "../enumerations/LandType";

/**
 * Scenarios from
 * http://www.cranialinsertion.com/order-of-operations
 */
//TODO add blood moon and basic land types
//TODO allow query string to contain a battlefield
export class OrderOfOperationsScenariosL6 {
    static getThem() : Scenario[] {
        return [
            new Scenario("OoO L6: Opalescence + Humility")
                .addCard(Recipes.Opalescence)
                .addCard(Recipes.Humility)
                .withVerification((f,s)=>{
                    it ("We're all 1/1's.", () => {
                        expect(f[1].power).to.equal(1);
                    });
                }),
            new Scenario("OoO L6: Empty-Shrine Kannushi")
                .addCard({
                    name: "Empty-Shrine Kannushi",
                    card: "white 1/1 Human Cleric",
                    abilities:
                    [[
                        "this", "has", "namedeffect:EmptyShrineKannushi"
                    ]]
                })
                .addCard({
                    name : "Cerulean Wisps",
                    card: "blue enchantment",
                    abilities: [["creatures", "setcolor:blue"]]
                })
                .withVerification((f,s)=>{
                    it("Kannushi has protection from blue and not white", ()=>{
                       expect(f[0].abilities.length).to.equal(2);
                       expect(f[0].abilities[1].protectionFrom).to.equal(Color.Blue);
                    });
                }),
            new Scenario("OoO L6: Helm of Kaldra + Ovinize")
                .addCard(Recipes.TrainedArmodon)
                .addCard({
                    name: "Helm of Kaldra 1",
                    card: "artifact",
                    abilities: [["creatures","addability:first strike","addability:trample","addability:haste"]]
                })
                .addCard({
                    name: "Ovinize",
                    card: "green and blue enchantment",
                    abilities: [["creatures","silence","setpt:0/1"]]
                })
                .addCard({
                name: "Helm of Kaldra 2",
                card: "artifact",
                abilities: [["creatures","addability:first strike","addability:trample","addability:haste"]]
            })
                .withVerification((f,s)=>{
                    it("Armodon has one set of extra abilities", ()=>{
                        expect(f[0].abilities.length).to.equal(3);
                        expect(f[0].power).to.equal(0);
                        expect(f[0].toughness).to.equal(1);
                    })
                }),
            new Scenario("OoO L6: Gooey slimy fake Faerie")
                .addCard({
                    name: "Spitting Slug",
                    card: "green Ooze 1/1",
                    abilities: []
                }, 2)
                .addCard({
                    name: "Unnatural selection",
                    card: "green enchantment",
                    abilities: [["creatures","addsubtype:Faerie"]]
                })
                .addCard({
                    name: "Confiscate",
                    card: "blue enchantment",
                    abilities: [["creatures","gainscontrol:you"]]
                })
                .addCard({
                    name: "Scion of Oona",
                    card: "blue creature 3/3 Faerie",
                    abilities: [["Faerie creatures youcontrol","addability:shroud" ]]
                })
                .withVerification((f,s)=>{
                    it("The creature has shroud.", ()=>{
                        expect(f[0].abilities[0].primitiveName.toLowerCase()).to.equal("shroud");
                    })
                })



        ]
    }
}