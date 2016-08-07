///<reference path="../typings/index.d.ts"/>

"use strict";

import {App} from "./App";
import {Fortune} from "./model/Fortune";
import {CategoriesData} from "./data/CategoriesData";
import {FortunesData} from "./data/FortunesData";

window.onload = function () {
    let app = new App("body");

    for (let categoryName in CategoriesData) {
        app.addCategory(CategoriesData[categoryName]);
    }

    for (let categoryName in FortunesData) {
        let categoryFortunes = FortunesData[categoryName];
        for (let fortuneIndex in categoryFortunes) {
            app.addFortune(categoryName, categoryFortunes[fortuneIndex]);
        }
    }

    app.boot();

    window["app"] = app;
};