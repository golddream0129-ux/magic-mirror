"use strict";

import {Fortune} from "../model/Fortune";
import {FortunesLoveData} from "./fortunes/FortunesLoveData";
import {FortunesProsperityData} from "./fortunes/FortunesProsperityData";
import {FortunesBodyMindData} from "./fortunes/FortunesBodyMindData";
import {FortunesMysteryData} from "./fortunes/FortunesMysteryData";

export const FortunesData: FortunesData = {
    "love": FortunesLoveData,
    "prosperity": FortunesProsperityData,
    "body & mind": FortunesBodyMindData,
    "mystery": FortunesMysteryData,
};

interface FortunesData {
    [categoryName: string]: Fortune[];
}