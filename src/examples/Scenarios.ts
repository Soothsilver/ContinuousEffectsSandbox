import {Scenario} from "./Scenario";
import {expect} from "chai";
import {Recipes} from "./Recipes";
import {Color, Type} from "../structures/Typeline";
import {CreatureSubtype} from "../structures/CreatureSubtype";
import {OrderOfOperationsScenarios} from "./OrderOfOperationsScenarios";

export const Scenarios : Scenario[] = [
    new Scenario("Smoke test")
        .addCard(Recipes.TrainedArmodon)
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
        }),
    new Scenario("Multilayer effects & timestamps")
        .addCard(Recipes.Forest)
        .addCard({
            name: "Svogthos's Ability",
            card: "enchantment",
            abilities: [
                ["land","get","setcolor:green","addtype:creature","namedability:ScionOfTheWild"]
            ]
        })
        .addCard({
            name: "Treetop Village Creator",
            card: "artifact",
            abilities: [
                ["lands youcontrol", "setpt:3/3", "addtype:creature"]
            ]
        })
        .withVerification((field, scenario)=>{
            it("Forest is 3/3", ()=>{
               expect(scenario.find("Forest").power)
                   .to.equal(3);
            });
        }),
    new Scenario("Multilayer effects & timestamps (variant)")
        .addCard({
            name: "Svogthos's Ability",
            card: "enchantment",
            abilities: [
                ["land","get","setcolor:green","addtype:creature","namedability:ScionOfTheWild"]
            ]
        })
        .addCard({
            name: "Treetop Village Creator",
            card: "artifact",
            abilities: [
                ["lands youcontrol", "setpt:3/3", "addtype:creature"]
            ]
        })
        .addCard(Recipes.Forest)
        .withVerification((field, scenario)=>{
            it("Forest is 1/1", ()=>{
                expect(scenario.find("Forest").power)
                    .to.equal(1);
            });
        }),
    new Scenario("Types and colors not removed by silence")
        .addCard(Recipes.TrainedArmodon)
        .addCard(Recipes.MycosynthLattice)
        .addCard({
            name: "Painter's Servant: Blue",
            card: "1/3 artifact Scarecrow",
            abilities: [
                [ "addcolor:blue"]
            ]
        })
        .addCard(Recipes.Humility)
        .withVerification((field, scenario)=>{
            it("Armodon is a blue artifact.", ()=>{
                expect(scenario.find("Trained Armodon").color).to.contain(Color.Blue);
                expect(scenario.find("Trained Armodon").color).not.to.contain(Color.Green);
                expect(scenario.find("Trained Armodon").typeline.types).to.contain(Type.Artifact);
                expect(scenario.find("Trained Armodon").typeline.types).to.contain(Type.Creature);
                expect(scenario.find("Trained Armodon").typeline.creatureSubtypes).to.contain(CreatureSubtype.Elephant);
            });
            it ("Servant has no ability.", ()=>{
               expect(scenario.find("Painter's Servant: Blue").abilities).to.be.empty;
            });
        }),
    /*With a Humility and two Opalescences on the battlefield, if Humility has the latest timestamp, then all creatures are 1/1 with no abilities. If the timestamp order is Opalescence, Humility, Opalescence, the second Opalescence is 1/1, and the Humility and first Opalescence are 4/4. If Humility has the earliest timestamp, then everything is 4/4.*/
    new Scenario("2x Opalescence, 1x Humility")
        .addCard(Recipes.Opalescence)
        .addCard(Recipes.Humility)
        .addCard(Recipes.Opalescence)
        .withVerification((field, scenario) => {
            it ("First Opalescence is 5/5", ()=>{
                expect(field[0].power).to.equal(5);
            });
            it ("Humility is 5/5", ()=>{
                expect(field[1].power).to.equal(5);
            });
            it ("Second Opalescence is 1/1", ()=>{
                expect(field[2].power).to.equal(1);
            });
            it ("Nothing has any abilities", ()=>{
                expect(field[0].abilities).to.be.empty;
                expect(field[1].abilities).to.be.empty;
                expect(field[2].abilities).to.be.empty;
            });
            it ("Everything is a creature.", () => {
                expect(field[0].typeline.types).to.include(Type.Creature)
                expect(field[1].typeline.types).to.include(Type.Creature)
                expect(field[2].typeline.types).to.include(Type.Creature)
            })
        })

].concat(OrderOfOperationsScenarios.getThem());