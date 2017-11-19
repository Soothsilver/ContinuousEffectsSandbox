namespace Examples {


    function parseAsAbilityFromLines(...lines: string[]) {
        return parseAsAbility(lines.join("\n"));
    }

    export function createExample(identifier: string, battlefield : Permanent[], hand : Card[]) {
        switch (identifier) {
            case "613.3e1":
                /* Example: A 1/3 creature is given +0/+1 by an effect. Then another effect switches the creature’s power and toughness. Its new power and toughness is 4/1. A new effect gives the creature +5/+0. Its “unswitched” power and toughness would be 6/4, so its actual power and toughness is 4/6. */
                battlefield.length = 0;
                hand.length = 0;
                let c = CardCreator.parse("Spider\n1/3 green Spider creature");
                c.abilities.push(parseAsAbilityFromLines('this', 'gets','+0/+1'));
                c.abilities.push(parseAsAbilityFromLines('this', 'gets','switch'));
                c.abilities.push(parseAsAbilityFromLines('this', 'gets','+5/+0'));
                let p = Permanent.fromCard(c);
                battlefield.push(p);
                break;
        }
    }
}