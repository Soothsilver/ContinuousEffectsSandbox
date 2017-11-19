class PowerToughnessModification extends SingleModification {


    power : number;
    toughness : number;

    toString(plural: boolean) : string {
        return (plural ? "get" : "gets") + " " + (this.power >= 0 ? "+" : "") + this.power + "/" +
            (this.toughness >= 0 ? "+" : "") + this.toughness;
    }
    getLayer() : Layer {
        return Layer.L7c_PnTModifications;
    }
    applyTo(target: Permanent, battlefield: Permanent[], source: Permanent) {
        target.power += this.power;
        target.toughness += this.toughness;

    }
    constructor(power : number, toughness : number) {
        super();
        this.power = power;
        this.toughness = toughness;

    }
}
class LosePrimitiveModification extends SingleModification {
    private abilityname: string;
    constructor(abilityname : string) {
        super();
        this.abilityname = abilityname;
    }

    getLayer(): Layer {
        return Layer.L6_Abilities;
    }

    toString(plural: boolean) {
        return (plural ? "lose" : "loses") + " " + this.abilityname.toLowerCase();
    }

    applyTo(target: Permanent, battlefield: Permanent[], source: Permanent) {
        target.abilities = target.abilities.filter(ability => ability.primitiveName.toLowerCase() != this.abilityname.toLowerCase());
    }

}
class SetColorToModification extends SingleModification {
    private clr: Color;

    constructor(clr : Color) {
        super();
        this.clr = clr;
    }

    getLayer(): Layer {
        return Layer.L5_Color;
    }
    applyTo(target: Permanent, battlefield: Permanent[], source: Permanent) {
        target.color = [this.clr];
    }
    toString(plural: boolean) {
        return (plural ? "are" : "is") + " " + Color[this.clr].toLowerCase();
    }
}
class AddAbilityModification extends SingleModification {

    toString(plural: boolean) {
        return (plural ? "have" : "has") + " " + this.addWhat.toString();
    }

    addWhat: Ability;

    getLayer() : Layer {
        return Layer.L6_Abilities;
    }

    applyTo(target: Permanent, battlefield: Permanent[], source: Permanent)  {
        target.abilities.push(this.addWhat.copyAndInitialize(target));
    }
    constructor(addWhat :Ability) {
        super();
        this.addWhat = addWhat;
    }

}
class SwitchPTModification extends SingleModification {
    getLayer(): Layer {
        return Layer.L7e_PnTSwitch;
    }

    toString(plural: boolean) {
        return (plural ? "have their power and toughness switched" : "has its power and toughness switched");
    }

    applyTo(target: Permanent, battlefield: Permanent[], source: Permanent) {
        const swap = target.toughness;
        target.toughness = target.power;
        target.power = swap;
    }

}