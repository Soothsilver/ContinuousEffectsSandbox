import {Permanent} from "../structures/Permanent";
import {Card} from "../structures/Card";
import {CardRecipe, SampleLoader} from "../examples/SampleLoader";

export class HashSerialization {

    static serialize(battlefield: Permanent[], hand: Card[]) : string {
        let preSerialize = {
            "battlefield": battlefield.map(pm => pm.originalCard).map(crd => crd.recipe),
            "hand": hand.map(crd => crd.recipe)
        };
        return "#" + JSON.stringify(preSerialize);
    }

    static deserialize(hash: string) : [Permanent[], Card[]] {
        let deserialized : { battlefield: CardRecipe[], hand: CardRecipe[] } = JSON.parse(hash.substr(1));
        return [
                deserialized.battlefield.map(rcp => SampleLoader.createCard(rcp).asPermanent()),
                deserialized.hand.map(rcp=>SampleLoader.createCard(rcp))
            ];
    }
}