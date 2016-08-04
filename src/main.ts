///<reference path="../typings/index.d.ts"/>

import {App} from "./App";
import {Category} from "./model/Category";

window.onload = function () {
    let app = new App("body");

    app.addCategory(new Category("love", []));
    app.addCategory(new Category("prosperity", []));
    app.addCategory(new Category("body & mind", []));
    app.addCategory(new Category("mystery", []));

    app.boot();

    window["app"] = app;
};