class SingleAcquisition {
    private keyword : string = null;
    plural: boolean = false;

    protected constructor(key : string, plural: boolean) {
        this.keyword = key;
        this.plural = plural;
    }

    toString() : string {
        switch (this.keyword) {
            case "self": return "this permanent";
            default: return "WHO?";
        }
    }

    static acquireSelf() : SingleAcquisition {
        return new SingleAcquisition("self", false);
    }

    getAcquiredObjects(battlefield: Permanent[], source : Permanent) : Permanent[] {
        if (this.keyword == "self") {
            return [source];
        }
        return [];
    }
}
class AcquisitionCondition {
    mustBeThisColor: Color = null;
    mustBeThisType: Type = null;
    mustBeThisSubtype: CreatureSubtype = null;
    suppressTypePlural: boolean = false;
    mustBeControlledByYou: boolean = false;
    mustBeControlledByOpponent: boolean = false;

    static color(clr: Color) {
        let ac = new AcquisitionCondition();
        ac.mustBeThisColor = clr;
        return ac;
    }

    toString(): String {
        if (this.mustBeThisColor != null) {
            return Color[this.mustBeThisColor].toLowerCase();
        }
        if (this.mustBeThisType != null) {
            return Type[this.mustBeThisType].toLowerCase() + (this.suppressTypePlural ? "" : "s");
        }
        if (this.mustBeThisSubtype != null) {
            return CreatureSubtype[this.mustBeThisSubtype].toLowerCase() + (this.suppressTypePlural ? "" : " creatures");
        }
        if (this.mustBeControlledByYou) {
            return "you control";
        }
        if (this.mustBeControlledByOpponent) {
            return "you don't control";
        }
    }

    satisfiedBy(target: Permanent, source: Permanent, battlefield: Permanent[]) {
        if (this.mustBeThisColor != null) {
            if (!target.color.includes(this.mustBeThisColor)) {
                return false;
            }
        }
        if (this.mustBeThisType != null) {
            if (!target.typeline.types.includes(this.mustBeThisType)) {
                return false;
            }
        }
        if (this.mustBeThisSubtype != null) {
            if (!target.typeline.creatureSubtypes.includes(this.mustBeThisSubtype)) {
                return false;
            }
        }
        if (this.mustBeControlledByYou) {
            if (target.controlledByOpponent) {
                return false;
            }
        }
        if (this.mustBeControlledByOpponent) {
            if (!target.controlledByOpponent) {
                return false;
            }
        }
        return true;
    }

    static type(theType: Type) {
        let ac = new AcquisitionCondition();
        ac.mustBeThisType = theType;
        return ac;
    }

    static subtype(theType: CreatureSubtype) {
        let ac = new AcquisitionCondition();
        ac.mustBeThisSubtype = theType;
        return ac;
    }

    static controller(you: boolean) {
        let ac = new AcquisitionCondition();
        if (you) ac.mustBeControlledByYou = true;
        else ac.mustBeControlledByOpponent = true;
        return ac;
    }
}
class ComplexAcquisition extends SingleAcquisition {
    conditions : AcquisitionCondition[] = [];

    constructor() {
        super(null, true);
    }
    toString() : string {
        return (this.conditions.join(" "));
    }
    getAcquiredObjects(battlefield: Permanent[], source : Permanent) : Permanent[] {
        let filtered = shallowCopy(battlefield);
        for (let condition of this.conditions) {
            filtered = filtered.filter((target) => condition.satisfiedBy(target, source, battlefield));
        }
        return filtered;
    }
}
class Acquisition {
    multipleTargets: boolean = true;
    parts: SingleAcquisition[] = [];


    toString() : string {
        if (this.parts.length == 0) {
            return "all permanents";
        }
        let strs : string[] = [];
        for (let i = 0; i < this.parts.length; i++) {
            strs.push(this.parts[i].toString());
        }
        return joinList(strs);
    }

    addSubjectThis() {
        this.parts.push(SingleAcquisition.acquireSelf())
        this.reevaluatePlural();
    }
    addComplexAcquisition(complex: SingleAcquisition) {
        this.parts.push(complex);
        this.reevaluatePlural();
    }

    private reevaluatePlural() {
        if (this.parts.length > 1 ||
            this.parts[0].plural) {
            this.multipleTargets = true;
        } else if (this.parts.length == 1) {
            this.multipleTargets = false;
        } else {
            this.multipleTargets = true;
        }
    }

    getAcquiredObjects(battlefield: Permanent[], source : Permanent) {
        let objs : Permanent[] = [];
        if (this.parts.length == 0){
            return battlefield;
        }
        for(let a of this.parts) {
            objs = objs.concat(a.getAcquiredObjects(battlefield, source));
        }
        objs = removeDuplicates(objs);
        return objs;
    }


}