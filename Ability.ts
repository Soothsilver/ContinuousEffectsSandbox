class AcquireOneOrMoreObjects {
    private keyword : string = null;
    plural: boolean = false;

    private constructor(key : string, plural: boolean) {
        this.keyword = key;
        this.plural = plural;
    }

    toString() : string {
        switch (this.keyword) {
            case "self": return "this permanent";
            default: return "WHO?";
        }
    }

    static acquireSelf() : AcquireOneOrMoreObjects {
        return new AcquireOneOrMoreObjects("self", false);
    }
}
class Acquisition {
    multipleTargets: boolean = false;
    parts: AcquireOneOrMoreObjects[] = [];


    toString() : string {
        let strs : string[] = [];
        for (let i = 0; i < this.parts.length; i++) {
            strs.push(this.parts[i].toString());
        }
        return strs.join(", ");
    }

    addSubjectThis() {
        this.parts.push(AcquireOneOrMoreObjects.acquireSelf())
        this.reevaluatePlural();
    }

    private reevaluatePlural() {
        if (this.parts.length > 1 ||
            this.parts[0].plural) {
            this.multipleTargets = true;
        } else {
            this.multipleTargets = false;
        }
    }
}
abstract class SingleModification {

    abstract toString(plural : boolean);

}
class PowerToughnessModification extends SingleModification {
    power : number;
    toughness : number;

    toString(plural: boolean) : string {
        return (plural ? "get" : "gets") + " " + (this.power > 0 ? "+" : "") + this.power + "/" +
            (this.toughness > 0 ? "+" : "") + this.toughness;
    }

    constructor(power : number, toughness : number) {
        super();
        this.power = power;
        this.toughness = toughness;

    }
}
class Modification  {
    parts: SingleModification[] = [];

    toString(multipleTargets : boolean) : string {
        let strs : string[] = [];
        for (let i = 0; i < this.parts.length; i++) {
            strs.push(this.parts[i].toString(multipleTargets));
        }
        return strs.join(", ");
    }

    addPTModification(power: number, toughness: number) {
        this.parts.push(new PowerToughnessModification(power, toughness));
    }
}
function capitalizeFirstLetter(s: string) {
    return s[0].toUpperCase() + s.substr(1);
}
class Effect {
    acquisition : Acquisition = new Acquisition();
    modification : Modification = new Modification();

    toString() : string {
        return capitalizeFirstLetter(this.acquisition.toString()) + " " + this.modification.toString(this.acquisition.multipleTargets) + ".";
    }
}
class Ability {
    primitiveName : string = null;
    parseError : string = null;
    effect : Effect = null;

    constructor() {
    }

    toString() : string {
        if (this.primitiveName != null) {
            return this.primitiveName;
        } else if (this.parseError != null) {
            return "<font color='red'>" + this.parseError + "</font>";
        } else if (this.effect != null) {
            return this.effect.toString();
        } else {
            return "Substance";
        }
    }
}