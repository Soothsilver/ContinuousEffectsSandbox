import {LandType} from "../enumerations/LandType";
import {stringToSubtype} from "../structures/Typeline";

export class WordParser {

    static parseLandType(word: string) : LandType {
        switch (word.toLowerCase()) {
            case "plains": return LandType.Plains;
            case "mountain": return LandType.Mountain;
            case "island": return LandType.Island;
            case "forest": return LandType.Forest;
            case "swamp": return LandType.Swamp;
        }
        return null;
    }

    static isLandType(word: string) {
        return (WordParser.parseLandType(word) != null);
    }

    static isCreatureType(word: string) {
        return WordParser.parseCreatureType(word) != null;
    }

    static parseCreatureType(word: string) {
        return stringToSubtype(word);
    }
}