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
class ControlChangeModification extends SingleModification {
    controlGoesToYou: boolean;

    private getPlayerName() : string {
        return (this.controlGoesToYou) ? "you" : "Player 2";
    }

    toString(plural: boolean) : string {
        return (plural ? "are controlled by " : "is controlled by ") + this.getPlayerName();
    }
    getLayer() : Layer {
        return Layer.L2_Control;
    }
    applyTo(target: Permanent, battlefield: Permanent[], source: Permanent) {
        target.controlledByOpponent = !this.controlGoesToYou;

    }
    constructor(controlGoesToYou : boolean) {
        super();
        this.controlGoesToYou = controlGoesToYou;

    }
}
class SilenceModification extends SingleModification {
    toString(plural: boolean) {
        return (plural ? "lose all abilities" : "loses all abilities");
    }

    getLayer(): Layer {
        return Layer.L6_Abilities;
    }

    applyTo(target: Permanent, battlefield: Permanent[], source: Permanent) {
        target.abilities.length = 0;
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
class SetPowerToughnessModification extends SingleModification {
    private power: number;
    private toughness: number;

    constructor(power : number, toughness: number) {
        super();
        this.power = power;
        this.toughness = toughness;
    }

    getLayer(): Layer {
        return Layer.L7b_PnTSetSpecificValue;
    }

    toString(plural: boolean) {
        return (plural ? "have base power and toughness" : "has base power and toughness") + " " + this.power + "/" + this.toughness;
    }

    applyTo(target: Permanent, battlefield: Permanent[], source: Permanent) {
        target.power = this.power;
        target.toughness = this.toughness;
    }
}
class AddTypeModification extends  SingleModification {
    private type: Type;

    constructor(type : Type) {
        super();
        this.type = type;
    }

    getLayer(): Layer {
        return Layer.L4_Type;
    }

    toString(plural: boolean) {
        return (plural ? "are" : "is a") + " " + Type[this.type].toLowerCase() + (plural ? "s in addition to their other types" : " in addition to its other types.");
    }

    applyTo(target: Permanent, battlefield: Permanent[], source: Permanent) {
        target.typeline.types.push(this.type);
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