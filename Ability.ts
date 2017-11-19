
class Ability implements ICopiable<Ability> {


    primitiveName : string = null;
    parseError : string = null;
    effect : Effect = new Effect();

    copy(): Ability {
        let copie = new Ability();
        copie.primitiveName = this.primitiveName;
        copie.parseError = this.parseError;
        copie.effect = this.effect.copy();
        return copie;
    }


    toCapitalizedString() : string {
        return capitalizeFirstLetter(this.toString());
    }
    toString() : string {
        if (this.primitiveName != null) {
            return this.primitiveName;
        } else if (this.parseError != null) {
            return "[[" + this.parseError + "]]";
        } else if (this.effect != null) {
            return this.effect.toString();
        } else {
            return "substance";
        }
    }

    static flying() : Ability {
        let a = new Ability();
        a.primitiveName = "flying";
        return a;
    }

    copyAndInitialize(target: Permanent) : Ability {
        let ab = this.copy();
        ab.effect.source = target;
        return ab;
    }

    hasEffect() : boolean {
        return this.primitiveName == null && this.parseError == null && this.effect != null;
    }
}