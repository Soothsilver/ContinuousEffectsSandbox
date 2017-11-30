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
export class OrderOfOperationsScenarios {
    static getThem() : Scenario[] {
        return [
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
            new Scenario("OoO L3: Mind Bend + Zodiac Horse")
                .addCard(Recipes.ZodiacHorse)
                .addCard(Recipes.MindBend(LandType.Island, LandType.Forest))
                .addCard(Recipes.MindBend(LandType.Forest, LandType.Swamp))
                .addCard(Recipes.MindBend(LandType.Swamp, LandType.Mountain))
                .withVerification((f,s)=>{
                    it("Zodiac Horse now has mountainwalk and nothing else", ()=>{
                        expect(f[0].abilities.length).to.equal(1);
                        expect(f[0].abilities[0].toCapitalizedString()).to.equal("Mountainwalk");
                    });
                }),
            new Scenario("OoO L3: Mind Bend + non-dependency")
                .addCard({
                    name: "Grayscaled Gharial",
                    card: "1/1 blue Crocodile",
                    abilities: [["islandwalk"]]
                })
                .addCard(Recipes.MindBend(LandType.Swamp, LandType.Forest))
                .addCard(Recipes.MindBend(LandType.Island, LandType.Swamp))
                .withVerification((f,s)=>{
                    it ("It has swampwalk, not forestwalk", ()=>{
                       expect(f[0].abilities[0].landwalk).to.equal(LandType.Swamp);
                    });
                }),
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
                }),
            new Scenario("OoO L5: Painter's Servant + Humility")
                .addCard(Recipes.PaintersServant(Color.Black))
                .addCard(Recipes.Humility)
                .withVerification((f,s)=>{
                    it("Humility is black", ()=>{
                        expect(s.find("Humility").color).includes(Color.Black);
                    });
                    it ("Painter's Servant has no abilities", ()=>{
                       expect(f[0].abilities).to.be.empty;
                    });
                }),
            new Scenario("OoO L5: Recoloring")
                .addCard(Recipes.TrainedArmodon)
                .addCard({
                    name: "Sort of like Runes of the Deus",
                    card: "green enchantment",
                    abilities: [["green creatures", "+1/+1", "trample"]]
                })
                .addCard({
                    name: "Sort of like Niveous Wisps",
                    card: "white enchantment",
                    abilities: [["creatures youcontrol","setcolor:white"]]
                })
                .withVerification((f,s)=>{
                    expect(f[0].color).includes(Color.White);
                    expect(f[0].color.length).to.equal(1);
                    expect(f[0].power).to.equal(3);
                    expect(f[0].abilities.length).to.equal(0);
                })


        ];
    }
}