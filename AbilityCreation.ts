
class AbilityCreator {
    ability : Ability = new Ability();
    effect: Effect = new Effect();
    parsingModifications: boolean = false;

    parseScript(script : string): void {
        console.log('a');
        let lines = script.split("\n");
        console.log(this.effect);
        for (let i = 0; i < lines.length; i++) {
            this.parseLine(lines[i].trim().toLowerCase());
        }
        console.log(this.effect);
        this.ability.effect = this.effect;
    }

    private parseLine(line : string) {
        if (line == "") return;
        if (line.substr(0,2) == "//") return;
        if (this.checkForMiddleLine(line)) return;
        if (["flying"].includes(line)) {
            this.ability.primitiveName = "Flying";
        }
        if (["this", "cardname"].includes(line) && !this.parsingModifications) {
            this.effect.acquisition.addSubjectThis();
        }
        if (line.includes("/")) {
            let [power, toughness] = this.parsePT(line);
            this.effect.modification.addPTModification(power, toughness);
        }
    }

    private parsePT(line: string) : [number, number] {
        let split = line.split("/");
        let power = split[0].trim();
        if (power[0] == '+') {
            power = power.substr(1);
        }
        let toughenss = split[1].trim();
        if (toughenss[0] == '+') {
            toughenss = toughenss.substr(1);
        }
        return [Number.parseInt(power), Number.parseInt(toughenss)];
    }

    private checkForMiddleLine(line: string) :boolean {
        let gwords: string[] = ["get", "gets", "has", "have", "gain", "gains"];
        if (gwords.includes(line)) {
            this.parsingModifications = true;
            return true;
        }
        return false;
    }
}

function parseAsAbility(script : string) : Ability {
    console.log('p');
    let abilityCreator = new AbilityCreator();
    abilityCreator.parseScript(script);
    return abilityCreator.ability;
}
