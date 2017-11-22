import {definitions} from "./SampleCards";
import {Card} from "../structures/Card";
import {CardCreator} from "../creators/CardCreator";
import {parseAsAbility} from "../creators/AbilityCreation";

function form(ability: string[]) : string {
    return ability.join("\n");
}

export class CardRecipe {
    name : string;
    card : string;
    abilities : string[][];


}

export module SampleLoader {

    export function getCardRecipes() : CardRecipe[] {
        return definitions;
    }
    export function createCard(recipe : CardRecipe) : Card {
        let c = CardCreator.parse(recipe.name + "\n" + recipe.card);
        for (let ability of recipe.abilities) {
            c.abilities.push(parseAsAbility(form(ability)));
        }
        return c;
    }
}