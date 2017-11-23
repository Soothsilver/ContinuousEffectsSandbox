import {Scenario} from "./Scenario";
import {expect} from "chai";
import {Recipes} from "./Recipes";
import {Type} from "../structures/Typeline";
import {CreatureSubtype} from "../structures/CreatureSubtype";

export const Scenarios : Scenario[] = [
    new Scenario("Smoke Test")
        .addCard({
            name: "Trained Armodon",
            card: "3/3 green Elephant creature",
            abilities: []
        })
        .addCard({
            name: "Glorious Anthem",
            card: "white enchantment",
            abilities: [["creatures youcontrol", "+1/+1"]]
        })
        .withVerification((field, scenario) : void => {
            it("Trained Armodon is 4/4", () => {
                expect(scenario.find("Trained Armodon").power).to.equal(4);
            });
        }),
    new Scenario("A changeling is every type")
        .addCard(Recipes.WoodlandChangeling)
        .withVerification((field,scenario)=>{
            it("Changeling has at least 50 types", ()=>{
                expect(scenario.find("Woodland Changeling").typeline.creatureSubtypes.length)
                    .to.greaterThan(50);
            });
            it ("Changeling is a Zubera", ()=>{
                expect(scenario.find("Woodland Changeling").typeline.creatureSubtypes)
                    .to.contain(CreatureSubtype.Zubera);
            });
        })
];