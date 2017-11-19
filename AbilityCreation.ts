
class AbilityCreator {
    ability : Ability = new Ability();
    effect: Effect = new Effect();
    parsingModifications: boolean = false;
    parseScript(script : string): void {
        let lines = script.split("\n");
        if (script.trim() == "flying") {
            this.ability.primitiveName = "Flying";
            return;
        }
        for (let i = 0; i < lines.length; i++) {
            this.parseLine(lines[i].trim().toLowerCase());
        }
        this.ability.effect = this.effect;
    }

    private parseLine(line : string) {
        if (line == "") return;
        if (line.substr(0,2) == "//") return;
        if (this.checkForMiddleLine(line)) return;
        if (["flying"].includes(line)) {
            this.effect.modification.addGrantPrimitiveAbility(Ability.flying());
        }
        else if (["this", "cardname"].includes(line)) {
            this.effect.acquisition.addSubjectThis();
        }
        else if (["switch"].includes(line)) {
            this.effect.modification.parts.push(new SwitchPTModification());
        }
        else if (line.includes("/") && !isNaN(parsePT(line)[0]) && !isNaN(parsePT(line)[1])) {
            let [power, toughness] = parsePT(line);
            this.effect.modification.addPTModification(power, toughness);
        }
        else if (!this.parsingModifications && this.wordForWordParse(line) != null) {
            this.effect.acquisition.addComplexAcquisition(this.wordForWordParse(line));
        }
        else {
            this.ability.parseError = "unrecognized: " + line;
        }
    }

    private wordForWordParse(line: string) : SingleAcquisition {
        let words = line.split(' ');
        let ca =new ComplexAcquisition();
        for (let word of words) {
            if (word == 'white') ca.conditions.push(AcquisitionCondition.color(Color.White));
            else if (word == 'blue') ca.conditions.push(AcquisitionCondition.color(Color.Blue));
            else if (word == 'black') ca.conditions.push(AcquisitionCondition.color(Color.Black));
            else if (word == 'red') ca.conditions.push(AcquisitionCondition.color(Color.Red));
            else if (word == 'green') ca.conditions.push(AcquisitionCondition.color(Color.Green));
            else if (stringToType(word) != null) ca.conditions.push(AcquisitionCondition.type(stringToType(word)));
            else return null;
        }
        return ca;
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
