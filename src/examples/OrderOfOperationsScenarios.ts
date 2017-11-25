import {Scenario} from "./Scenario";
import {CardRecipe} from "./SampleLoader";
import {Recipes} from "./Recipes";
import {expect} from "chai";

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
                })
        ];
    }
}