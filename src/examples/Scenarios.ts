import {Scenario} from "./Scenario";
import {expect} from "chai";
import {Recipes} from "./Recipes";
import {Color, Type} from "../structures/Typeline";
import {CreatureSubtype} from "../structures/CreatureSubtype";
import {OrderOfOperationsScenarios} from "./OrderOfOperationsScenarios";
import {LandType} from "../enumerations/LandType";
import {OrderOfOperationsScenariosL6} from "./OrderOfOperationsL6";
import {ComprehensiveRulesScenarios} from "./ComprehensiveRulesScenarios";

function getConversionScenarioBase(name : string) {
    return new Scenario(name)
        .addCard({
            name: "C1",
            card: "artifact",
            abilities: [["Advisor", "setsubtype:Bear"]]
        }).addCard({
            name: "C2",
            card: "artifact",
            abilities: [["Bear", "setsubtype:Construct"]]
        }).addCard({
            name: "C3",
            card: "artifact",
            abilities: [["Construct", "setsubtype:Dragon"]]
        }).addCard({
            name: "C4",
            card: "artifact",
            abilities: [["Dragon", "setsubtype:Elf"]]
        }).addCard({
            name: "C5",
            card: "artifact",
            abilities: [["Elf", "setsubtype:Advisor"]]
        });
}

export const Scenarios : Scenario[] =
    ComprehensiveRulesScenarios.getThem().concat([
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
        }),
    new Scenario("Three switchers")
        .addCard({
            name: "Spider",
            card: "green 1/4 Spider",
            abilities: []
        })
        .addCard({
            name: "Switcher",
            card: "artifact",
            abilities: [["creatures","switch"]]
        })
        .addCard({
            name: "Switcher2",
            card: "blue enchantment",
            abilities: [["creatures","switch"]]
        })
        .addCard({
            name: "Switcher3",
            card: "green enchantment",
            abilities: [["creatures","switch"]]
        })
        .withVerification((field, scenario)=>{
            it ("The spider is switched", ()=>{
                expect(field[0].power).to.equal(4);
                expect(field[0].toughness).to.equal(1);
            });
        }),
    new Scenario("Dependency: Swampwalk")
        .addCard(Recipes.ZodiacHorse)
        .addCard(Recipes.MindBend(LandType.Island, LandType.Mountain))
        .addCard({
            name: "Enchantment changer",
            card: "artifact",
            abilities: [ [
                "enchantments", "changetype:mountain=>swamp"
            ] ]
        })
        .withVerification((f,s)=>{
            it("Zodiac Horse has swampwalk", ()=>{
                expect(f[0].abilities[0].toCapitalizedString()).to.equal("Swampwalk");
            });
            it("Mind Bend has its ability changed.", () =>{
                expect(f[1].abilities[0].modified).to.be.true;
            });
        }),
    new Scenario("Dependency loop: Mind Bend")
        .addCard(Recipes.ZodiacHorse)
        .addCard({
            name: "Changer 1",
            card: "red enchantment",
            abilities: [["other enchantments", "changetype:island=>mountain"]]
        })
        .addCard({
            name: "Changer 2",
            card: "blue enchantment",
            abilities: [["other enchantments", "changetype:mountain=>island"]]
        })
        .addCard({
            name: "Nyx Horse",
            card: "2/2 enchantment green creature Horse",
            abilities: [["islandwalk"], ["mountainwalk"], ["forestwalk"]]
        })
        .withVerification((f,s)=>{
            it ("Nyx Horse had everything changed to mountainwalk", ()=> {
                expect(s.find("Nyx Horse").abilities[0].toCapitalizedString()).to.equal("Mountainwalk");
                expect(s.find("Nyx Horse").abilities[1].toCapitalizedString()).to.equal("Mountainwalk");
                expect(s.find("Nyx Horse").abilities[2].toCapitalizedString()).to.equal("Forestwalk");
            });
        }),
    new Scenario("Urborg + Blood Moon")
        .addCard(Recipes.Urborg)
        .addCard(Recipes.BloodMoon)
        .withVerification((f,s)=>{
            it ("Urborg is just a Mountain.", ()=>{
                expect(f[0].typeline.landTypes).to.eql([LandType.Mountain]);
            })
        }),
    new Scenario("Change lands via text")
        .addCard(Recipes.Forest)
        .addCard(Recipes.Mountain) .addCard({
        name: "Mind Bend",
        card: "artifact",
        abilities: [["lands","changetype:mountain=>forest"]]
    }) .addCard({
        name: "Mind Bend",
        card: "artifact",
        abilities: [["lands","changetype:forest=>plains"]]
    })
        .withVerification((f,s)=>{
            it("Both lands are Plains.", ()=>{
                expect(f[0].typeline.landTypes).eql([LandType.Plains]);
                expect(f[1].typeline.landTypes).eql([LandType.Plains]);
            })
        }),
    new Scenario("Change lands via text (2)")
        .addCard(Recipes.Forest)
        .addCard(Recipes.BloodMoon)
        .addCard({
          name: "Mind Bend",
          card: "artifact",
          abilities: [["lands","changetype:mountain=>plains"]]
        })
        .withVerification((f,s)=>{
            it("It's a Mountain, not a Plains.", ()=>{
                expect(f[0].typeline.landTypes).eql([LandType.Mountain]);
            })
        }),
    new Scenario("Neurok Transmuter")
        .addCard({
            name: "Thing",
            card: "artifact",
            abilities: []
        })
        .addCard({
            name: "March of the Machines",
            card: "blue enchantment",
            abilities: [
                [
                    "noncreature artifact",
                    "addtype:creature",
                    "setpt:3/3"
                ]
            ]
        })
        .addCard({
            name: "Neurok Transmuter",
            card: "blue 2/2 creature Human Wizard",
            abilities: [
                [
                    "setcolor:blue",
                    "losetype:artifact"
                ]
            ]
        }).withVerification((f,s)=>{
                it ("The thing is just blue.", ()=>{
                    expect(f[0].typeline.types).to.be.empty;
                    expect(f[0].color).to.eql([Color.Blue]);
                });
           }),
    getConversionScenarioBase("Conversion 1")
        .addCard({
            name: "Construct",
            card: "1/1 white Construct",
            abilities: []
        })
        .withVerification((f,s)=>{
            it ("An Advisor.", () =>{
                expect(s.find("Construct").typeline.creatureSubtypes).eql([CreatureSubtype.Advisor]);
            })
        }),
    getConversionScenarioBase("Conversion 2")
            .addCard({
                name: "Advisor Bear",
                card: "1/1 white Advisor Bear",
                abilities: []
            })
            .withVerification((f,s)=>{
                it ("Just an advisor.", () =>{
                    expect(s.find("Advisor Bear").typeline.creatureSubtypes).eql([CreatureSubtype.Advisor]);
                })
            }),
    getConversionScenarioBase("Conversion dependency loop")
            .addCard({
                name: "A",
                card: "1/1 white Advisor",
                abilities: []
            }) .addCard({
        name: "A",
        card: "1/1 green Bear",
        abilities: []
    }) .addCard({
        name: "A",
        card: "1/1 Construct",
        abilities: []
    }) .addCard({
        name: "A",
        card: "1/1 red Dragon",
        abilities: []
    }) .addCard({
        name: "A",
        card: "1/1 green Elf",
        abilities: []
    })
            .withVerification((f,s)=>{
                it ("Just an advisor.", () =>{
                    for (let perm of f) {
                        if (perm.name == "A") {
                            expect(perm.typeline.creatureSubtypes).eql([CreatureSubtype.Advisor]);
                        }
                    }
                })
            }),

]).concat(OrderOfOperationsScenarios.getThem())
.concat(OrderOfOperationsScenariosL6.getThem());