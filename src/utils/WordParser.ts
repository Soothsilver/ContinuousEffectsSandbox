import {LandType} from "../enumerations/LandType";

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
}