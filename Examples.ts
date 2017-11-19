namespace Examples {


    function form(...lines: string[]) {
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
                c.abilities.push(form('this', 'gets','+0/+1'));
                c.abilities.push(form('this', 'gets','switch'));
                c.abilities.push(form('this', 'gets','+5/+0'));
                 p = Permanent.fromCard(c);
                battlefield.push(p);
                break;
            case "613.3e2":
                /* Example: A 1/3 creature is given +0/+1 by an effect. Then another effect switches the creature’s power and toughness. Its new power and toughness is 4/1. If the +0/+1 effect ends before the switch effect ends, the creature becomes 3/1.*/
                c = CardCreator.parse("Spider\n1/3 green Spider creature");
                c.abilities.push(form('this', 'gets','switch'));
                p = Permanent.fromCard(c);
                c2 = CardCreator.parse("Defensive Booster\nartifact");
                c2.abilities.push(form('creatures','get','+0/+1'));
                let p2 = Permanent.fromCard(c2);
                battlefield.push(p2);
                battlefield.push(p);
                break;
            case "613.3e3":
                /*Example: A 1/3 creature is given +0/+1 by an effect. Then another effect switches the creature’s power and toughness. Then another effect switches its power and toughness again. The two switches essentially cancel each other, and the creature becomes 1/4.*/
                {
                    let c = CardCreator.parse("Spider\n1/3 green Spider creature");
                    battlefield.push(Permanent.fromCard(c));
                    let a1 = CardCreator.parse("Defensive Booster\nartifact");
                    a1.abilities.push(form('creatures','get','+0/+1'));
                    battlefield.push(Permanent.fromCard(a1));
                    let a2 = CardCreator.parse("Switcher\nartifact");
                    a2.abilities.push(form('creatures','get','switch'));
                    battlefield.push(Permanent.fromCard(a2));
                    battlefield.push(Permanent.fromCard(a2));
                }
                break;
            case "613.8.1":
                /*Example: Two effects are affecting the same creature: one from an Aura that says “Enchanted creature gains flying” and one from an Aura that says “Enchanted creature loses flying.” Neither of these depends on the other, since nothing changes what they affect or what they’re doing to it. Applying them in timestamp order means the one that was generated last “wins.” The same process would be followed, and the same result reached, if either of the effects had a duration (such as “Target creature loses flying until end of turn”) or came from a non-Aura source (such as “All creatures lose flying”).*/
            {
                let c = Card.createBear();
                let a1 = Card.createArtifact();
                let a2 = Card.createArtifact();
                a1.abilities.push(form('Bear', 'get','flying'));
                a2.abilities.push(form('Bear', 'get','loseprimitive:flying'));
                battlefield.push(c.asPermanent());
                battlefield.push(a1.asPermanent());
                battlefield.push(a2.asPermanent());
            }
                break;
            case "613.8.2":
                /*Example: One effect reads, “White creatures get +1/+1,” and another reads, “Enchanted creature is white.” The enchanted creature gets +1/+1 from the first effect, regardless of its previous color.*/
            {
                let c = Card.createBear();
                let a1 = Card.createArtifact();
                a1.abilities.push(form('white creatures','get','+1/+1'));
                a1.abilities.push(form('creatures','get','setcolor:white'));
                battlefield.push(c.asPermanent());
                battlefield.push(a1.asPermanent());
            }
                break;
            case "613.4e1":
            {
                /*Example: Honor of the Pure is an enchantment that reads “White creatures you control get +1/+1.” Honor of the Pure and a 2/2 black creature are on the battlefield under your control. If an effect then turns the creature white (layer 5), it gets +1/+1 from Honor of the Pure (layer 7c), becoming 3/3. If the creature’s color is later changed to red (layer 5), Honor of the Pure’s effect stops applying to it, and it will return to being 2/2.*/
                let c = CardCreator.parse("Honor of the Pure\nwhite enchantment");
                c.abilities.push(form('white creatures youcontrol', 'get', '+1/+1'));
                battlefield.push(c.asPermanent());
                battlefield.push(Card.createBear().asPermanent());
                let d = Card.createArtifact();
                d.abilities.push(form('bear', 'get', 'setcolor:white'));
                battlefield.push(d.asPermanent());
                let e = Card.createArtifact();
                e.abilities.push(form('bear', 'get', 'setcolor:red'));
                hand.push(e);
            }
                break;
            case "613.4e2":
            {
                /*Example: Gray Ogre, a 2/2 creature, is on the battlefield. An effect puts a +1/+1 counter on it (layer 7d), making it 3/3. A spell targeting it that says “Target creature gets +4/+4 until end of turn” resolves (layer 7c), making it 7/7. An enchantment that says “Creatures you control get +0/+2” enters the battlefield (layer 7c), making it 7/9. An effect that says “Target creature becomes 0/1 until end of turn” is applied to it (layer 7b), making it 5/8 (0/1, with +4/+4 from the resolved spell, +0/+2 from the enchantment, and +1/+1 from the counter).*/
                let p = Card.createBear().asPermanent();
                battlefield.push(p);
                p.counters.push(new Counter(1,1));
                let a = Card.createArtifact();
                a.abilities.push(form('bear', 'get','+4/+4'));
                let b = Card.createArtifact();
                b.abilities.push(form('bear', 'get','+0/+2'));
                let c = Card.createArtifact();
                c.abilities.push(form('bear','get','setpt:0/1'));
                battlefield.push(a.asPermanent(),b.asPermanent(),c.asPermanent());
            }
                break;
            case "613.5e1": {
                /*Example: An effect that reads “Wild Mongrel gets +1/+1 and becomes the color of your choice until end of turn” is both a power- and toughness-changing effect and a color-changing effect. The “becomes the color of your choice” part is applied in layer 5, and then the “gets +1/+1” part is applied in layer 7c.*/
                let p = CardCreator.parse("Wild Mongrel\n2/2 green creature");
                p.abilities.push(form("this", "gets", "+1/+1", "setcolor:blue"));
                battlefield.push(p.asPermanent());
            }
                break;
            case "613.5e2":
            case "613.5e3":
            case "613.5e4":
                break;
        }
    }
}