namespace Examples {


    function parseAsAbilityFromLines(...lines: string[]) {
        return parseAsAbility(lines.join("\n"));
    }

    export function createExample(identifier: string, battlefield : Permanent[], hand : Card[]) {
        battlefield.length = 0;
        hand.length = 0;
        let c : Card = null;
        let c2 : Card = null;
        let p : Permanent = null;
        switch (identifier) {
            case "613.3e1":
                /* Example: A 1/3 creature is given +0/+1 by an effect. Then another effect switches the creature’s power and toughness. Its new power and toughness is 4/1. A new effect gives the creature +5/+0. Its “unswitched” power and toughness would be 6/4, so its actual power and toughness is 4/6. */
                 c = CardCreator.parse("Spider\n1/3 green Spider creature");
                c.abilities.push(parseAsAbilityFromLines('this', 'gets','+0/+1'));
                c.abilities.push(parseAsAbilityFromLines('this', 'gets','switch'));
                c.abilities.push(parseAsAbilityFromLines('this', 'gets','+5/+0'));
                 p = Permanent.fromCard(c);
                battlefield.push(p);
                break;
            case "613.3e2":
                /* Example: A 1/3 creature is given +0/+1 by an effect. Then another effect switches the creature’s power and toughness. Its new power and toughness is 4/1. If the +0/+1 effect ends before the switch effect ends, the creature becomes 3/1.*/
                c = CardCreator.parse("Spider\n1/3 green Spider creature");
                c.abilities.push(parseAsAbilityFromLines('this', 'gets','switch'));
                p = Permanent.fromCard(c);
                c2 = CardCreator.parse("Defensive Booster\nartifact");
                c2.abilities.push(parseAsAbilityFromLines('creatures','get','+0/+1'));
                let p2 = Permanent.fromCard(c2);
                p2.phasedOut = true;
                battlefield.push(p2);
                battlefield.push(p);
                break;
            case "613.3e3":
                /*Example: A 1/3 creature is given +0/+1 by an effect. Then another effect switches the creature’s power and toughness. Then another effect switches its power and toughness again. The two switches essentially cancel each other, and the creature becomes 1/4.*/
                {
                    let c = CardCreator.parse("Spider\n1/3 green Spider creature");
                    battlefield.push(Permanent.fromCard(c));
                    let a1 = CardCreator.parse("Defensive Booster\nartifact");
                    a1.abilities.push(parseAsAbilityFromLines('creatures','get','+0/+1'));
                    battlefield.push(Permanent.fromCard(a1));
                    let a2 = CardCreator.parse("Switcher\nartifact");
                    a2.abilities.push(parseAsAbilityFromLines('creatures','get','switch'));
                    battlefield.push(Permanent.fromCard(a2));
                    battlefield.push(Permanent.fromCard(a2));
                }
                break;
        }
    }
}