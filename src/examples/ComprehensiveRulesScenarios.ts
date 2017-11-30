import {Scenario} from "./Scenario"
import {expect} from "chai";
import {CardRecipe} from "./SampleLoader";
import {Recipes} from "./Recipes";
import {Color, Type} from "../structures/Typeline";

export class ComprehensiveRulesScenarios {
    static getThem(): Scenario[] {
        return [
          new Scenario("613.3e1")
              .addCard({
                  name: "Spider",
                  card: "1/3 green Spider",
                  abilities: [
                      ["this", "gets","+0/+1"],
                      ["this", "gets","switch"],
                      ["this", "gets","+5/+0"],
                  ]
              })
              .withVerification((f,s)=>{
                    it ("Spider is 4/6", ()=>{
                        expect(f[0].power).to.equal(4);
                        expect(f[0].toughness).to.equal(6);
                    })
              }),
            new Scenario("613.3e2")
                .addCard(new CardRecipe("Spider", "1/3 green Spider creature", [["this","switch"]]))
                .addCard(new CardRecipe("Defensive Booster", "artifact", [["creatures", "get", "+0/+1"]]))
                .withVerification((f,s)=>{
                    it ("Spider is 4/1.", ()=>{
                        expect(f[0].getPT()).eql([4,1]);
                    })
                }),
            new Scenario("613.3e3")
                .addCard(new CardRecipe("Spider", "1/3 green Spider creature", []))
                .addCard(new CardRecipe("Defensive Booster", "artifact", [["creatures", "get", "+0/+1"]]))
                .addCard(new CardRecipe("Switcher", "artifact",
                    [["creatures","switch"]]))
                .addCard(new CardRecipe("Switcher", "artifact",
                    [["creatures","switch"]]))
                .withVerification((f,s)=>{
                    it ("Spider is 1/4.", ()=>{
                        expect(f[0].getPT()).eql([1,4]);
                    })
                }),
            new Scenario("613.8e1")
                .addCard(Recipes.RuneclawBear)
                .addCard(new CardRecipe("Thing", "artifact", [["Bear", "flying"]]))
                .addCard(new CardRecipe("Thing", "artifact",
                    [["Bear","loseprimitive:flying"]]))
                .withVerification((f,s)=>{
                    it ("Bear has no abilities.", ()=>{
                        expect(f[0].abilities.length).to.equal(0);
                    })
                }),
            new Scenario("613.8e2")
                .addCard(Recipes.RuneclawBear)
                .addCard(Recipes.HonorOfThePure)
                .addCard(new CardRecipe("Whiter", "artifact", [["creatures","setcolor:white"]]))
                .withVerification((f,s)=>{
                    it ("The Bear is 3/3.", ()=>{
                        expect(f[0].getPT()).to.eql([3,3]);
                    })
                }),
            new Scenario("613.4e1")
                .addCard(Recipes.HonorOfThePure)
                .addCard(Recipes.RuneclawBear)
                .addCard(new CardRecipe("Whiter", "artifact", [["creatures","setcolor:white"]]))
                .addCard(new CardRecipe("Redder", "artifact", [["creatures","setcolor:red"]]))
                .withVerification((f,s)=>{
                    it ("It's only 2/2.", ()=>{
                        expect(f[1].getPT()).eql([2,2]);
                    })
                }),
            new Scenario("613.4e2")
                .addCard(Recipes.RuneclawBear)
                .addCard(ComprehensiveRulesScenarios.artifact("bear", "get", "+4/+4"))
                .addCard(ComprehensiveRulesScenarios.artifact("bear", "get","+0/+2"))
                .addCard(ComprehensiveRulesScenarios.artifact("bear", "setpt:0/1"))
                .withVerification((f,s)=>{
                    it ("The Bear is 4/7", ()=>{
                        expect(f[0].getPT()).eql([4,7]);
                    })
                }),
            new Scenario("613.5e1")
                .addCard(new CardRecipe("Wild Mongrel", "2/2 green creature", [["this", "gets", "+1/+1", "setcolor:blue"]]))
                .withVerification((f,s)=>{
                    it ("It's a 3/3 blue.", ()=>{
                        expect(f[0].getPT()).eql([3,3]);
                        expect(f[0].color).eql([Color.Blue]);
                    })
                }),
            new Scenario("613.5e2")
                .addCard(Recipes.RuneclawBear)
                .addCard(new CardRecipe("Act of Treason", "red enchantment",
                    [["bear","gets","gainscontrol:2", "haste"]]))
                .withVerification((f,s)=>{
                    it ("Your opponent has the bear and it has haste.", ()=>{
                        expect(f[0].abilities[0].primitiveName.toLowerCase()).equal("haste");
                        expect(f[0].controlledByOpponent).to.be.true;
                    })
                }),
            new Scenario("613.5e3")
                .addCard(Recipes.Thing)
                .addCard(new CardRecipe("Little March", "blue enchantment", [["noncreature artifact", "setpt:2/2", "addtype:creature"]]))
                .withVerification((f,s)=>{
                    it ("It's a 2/2 artifact creature.", ()=>{
                        expect(f[0].getPT()).eql([2,2]);
                        expect(f[0].typeline.types).eql([Type.Artifact, Type.Creature]);
                    });
                }),
            new Scenario("613.5e4")
                .addCard({
                    name: "Svogthos, the Restless Tomb",
                    card: "land",
                    abilities: []
                })
                .addCard(ComprehensiveRulesScenarios.artifact("lands youcontrol", "setpt:3/3", "addtype:creature"))
                .addCard({
                    name: "Glorious Anthem",
                    card: "white enchantment",
                    abilities: [ ["creatures youcontrol", "get", "+1/+1" ] ]
                })
                .addCard({
                    name: "Svogthos's Ability",
                    card: "black enchantment",
                    abilities: [
                        [
                            "lands", "gets", "losecolors", "addcolor:black", "addcolor:green", "addtype:creature", "namedability:ScionOfTheWild"
                        ]
                    ]
                })
                .withVerification((f,s)=>{
                    it ("It's 2/2.", ()=>{
                        expect(f[0].getPT()).eql([2,2]);
                    })
                })
        ];
    }

    private static artifact(...abilityParts : string[]) {
        return new CardRecipe("Thing", "artifact",[abilityParts]);
    }
}