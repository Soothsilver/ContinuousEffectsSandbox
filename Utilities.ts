function capitalizeFirstLetter(s: string) : string {
    if (s.length == 0) { return ""; }
    return s[0].toUpperCase() + s.substr(1);
}
function joinList(pole : string[]) : string {
    if (pole.length == 0) return "";
    if (pole.length == 1) return pole[0];
    let s = "";
    for (let i =0; i < pole.length - 2;i++) {
        s += pole[i] + ", ";
    }
    s += pole[pole.length - 2] + " and " + pole[pole.length - 1];
    return s;
}
interface ICopiable<T> {
    copy() : T;
}
function getCssColor(color: Color[]): string {
    if (color.length == 0) {
        return "";
    } else if (color.length == 1) {
        switch (color[0]) {
            case Color.Black: return "black";
            case Color.Blue: return "blue";
            case Color.Green: return "green";
            case Color.Red: return "red";
            case Color.White: return "white";
        }
    } else {
        return "gold";
    }
}
function shallowCopy<T>(array : T[]) : T[] {
    let newArray : T[] = [];
    for(let element of array) {
        newArray.push(element);
    }
    return newArray;
}
function deepCopy<T extends ICopiable<T>>(array : T[]) : T[] {
    let newArray : T[] = [];
    for(let element of array) {
        newArray.push(element.copy());
    }
    return newArray;
}
function removeDuplicates<T>(array: T[]) : T[] {
    let newArray : T[] = [];
    outerFor: for(let element of array) {
       for (let n of newArray) {
           if (element == n) {
               continue outerFor;
           }
       }
       newArray.push(element);
    }
    return newArray;
}