import {Scenario} from "./Scenario";
import {CardRecipe} from "./SampleLoader";
import {Recipes} from "./Recipes";
import {expect} from "chai";
import {Type} from "../structures/Typeline";
import {CreatureSubtype} from "../structures/CreatureSubtype";

/**
 * Scenarios from
 * http://www.cranialinsertion.com/order-of-operations
 */
export class OrderOfOperationsScenarios {
    static getThem() : Scenario[] {
        return [
            // TODO Layer 1: Copy
            // Layer 2: Control
            new Scenario("OoO L2: Control Magic")
                .addCard(Recipes.TrainedArmodon)
                .addCard({
                    name: "Opponent steals creatures",
                    card: "blue enchantment",
                    abilities: [["creature","gainscontrol:2"]]
                })
                .addCard({
                    name: "You steal them back",
                    card: "blue enchantment",
                    abilities: [["creature","gainscontrol:1"]]
                })
                .withVerification((field, scenario)=>{
                    it ("You control the Armodon.", ()=> {
                        expect(scenario.find('Trained Armodon').controlledByOpponent).to.equal(false);
                    });
                }),
            new Scenario("OoO L2: Confiscate a Confiscate")
                .addCard(Recipes.TrainedArmodon)
                .addCard({
                    name: "You steal creatures",
                    card: "blue enchantment",
                    abilities: [["creature","gainscontrol:you"]]
                }, 2)
                .addCard({
                    name: "You steal blue enchantments",
                    card: "red enchantment",
                    abilities: [["blue enchantments","gainscontrol:you"]]
                })
                .withVerification((field, scenario)=>{
                    it ("You control the Armodon.", ()=> {
                        expect(scenario.find('Trained Armodon').controlledByOpponent).to.equal(false);
                    });
                }),
            // TODO L3 text-changing
            new Scenario("OoO L4: Titania's Song + Mycosynth Lattice dependency")
                .addCard(Recipes.TitaniasSong)
                .addCard(Recipes.MycosynthLattice)
                .withVerification((field, scenario)=>{
                    it ("Titania's Song is an artifact creature.", ()=>{
                        expect(field[0].typeline.types).to.contain(Type.Creature);
                        expect(field[0].typeline.types).to.contain(Type.Artifact);
                    });
                    it ("All permanents are 4/4.", ()=>{
                        for (let perm of field) {
                            expect(perm.power).to.equal(4);
                        }
                    });
                }),
            new Scenario("Titania's Song + Opalescence + Mycosynth Lattice")
                .addCard(Recipes.TitaniasSong)
                .addCard(Recipes.Opalescence)
                .addCard(Recipes.MycosynthLattice)
                .withVerification((field,scenario)=>{
                    it ("Titania's Song retains its ability.", ()=>{
                        expect(scenario.find("Titania's Song").abilities).not.to.be.empty;
                    });
                    it ("Titania's Song is 5/5", ()=>{
                        expect(scenario.find("Titania's Song").power).to.equal(5);
                    });
                    it ("Others are 4/4", ()=>{
                        expect(scenario.find("Opalescence").power).to.equal(4);
                        expect(scenario.find("Mycosynth Lattice").power).to.equal(4);
                    });
                    it ("Everything is an artifact creature.", ()=>{
                        for (let perm of field) {
                            expect(perm.typeline.types).to.contain(Type.Artifact);
                            expect(perm.typeline.types).to.contain(Type.Creature);
                        }
                    })
                }),
            new Scenario("OoO L4: Changeling + Humility")
                .addCard(Recipes.WoodlandChangeling)
                .addCard(Recipes.Humility)
                .withVerification((field, scenario)=>{
                    it ("The changeling still has types, but no ability.", ()=>{
                        expect(scenario.find("Woodland Changeling").typeline.creatureSubtypes.length)
                            .to.be.greaterThan(50);

                        expect(scenario.find("Woodland Changeling").abilities).to.be.empty;
                    });
                }),
            new Scenario("OoO L4: Unnatural Selection + Changeling")
                .addCard({
                    name: "Creature Type Modifier",
                    card: "blue enchantment",
                    abilities:
                    [
                        ["green creature","setsubtype:Goat"]
                    ]
                })
                .addCard(Recipes.WoodlandChangeling)
                .withVerification((field, scenario)=>{
                    it ("The changeling is just a Goat.", ()=> {
                        expect(scenario.find("Woodland Changeling").typeline.creatureSubtypes.length)
                            .to.equal(1);
                        expect(scenario.find("Woodland Changeling").typeline.creatureSubtypes)
                            .includes(CreatureSubtype.Goat);
                    });
                })

        ];
    }
}