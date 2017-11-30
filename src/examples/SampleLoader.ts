import {definitions} from "./SampleCards";
import {Card} from "../structures/Card";
import {CardCreator} from "../creators/CardCreator";
import {parseAsAbility} from "../creators/AbilityCreation";
import {shallowCopy} from "../Utilities";

function form(ability: string[]) : string {
    return ability.join("\n");
}

export class CardRecipe {
    name : string;
    card : string;
    abilities : string[][];

    constructor(name : string, card : string, abilities: string[][] = []) {
        this.name = name;
        this.card = card;
        this.abilities = abilities;
    }

}

export module SampleLoader {

    export function getCardRecipes() : CardRecipe[] {
        return definitions;
    }

    function copyRecipe(recipe: CardRecipe) {
        return new CardRecipe(recipe.name, recipe.card, shallowCopy(recipe.abilities));
    }

    export function createCard(recipe : CardRecipe) : Card {
        let rcp = copyRecipe(recipe);
        let c = CardCreator.parse(rcp.name + "\n" + rcp.card);
        for (let ability of rcp.abilities) {
            c.abilities.push(parseAsAbility(form(ability)));
        }
        c.recipe = rcp;
        return c;
    }
}