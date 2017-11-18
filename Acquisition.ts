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

    getAcquiredObjects(battlefield: Permanent[], source : Permanent) : Permanent[] {
        if (this.keyword == "self") {
            return [source];
        }
        return [];
    }
}
class Acquisition {
    multipleTargets: boolean = true;
    parts: AcquireOneOrMoreObjects[] = [];


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
        this.parts.push(AcquireOneOrMoreObjects.acquireSelf())
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