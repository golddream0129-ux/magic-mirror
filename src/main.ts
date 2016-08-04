///<reference path="../typings/index.d.ts"/>

import {App} from "./App";
import {Category} from "./model/Category";
import {Question} from "./model/Question";
import {Answer} from "./model/Answer";

window.onload = function () {
    let app = new App("body");

    app.addCategory(new Category("love", {
        1: new Question(
            1,
            "Love Question 1",
            [new Answer("A", "Q:1 A:A"), new Answer("B", "Q:1 A:B"), new Answer("C", "Q:1 C:A"), new Answer("D", "Q:1 D:A")]
        ),
        2: new Question(
            2,
            "Love Question 2",
            [new Answer("A", "Q:2 A:A"), new Answer("B", "Q:2 A:B")]
        ),
        3: new Question(
            3,
            "Love Question 3",
            [new Answer("A", "Q:3 A:A"), new Answer("B", "Q:3 A:B"), new Answer("C", "Q:3 C:A"), new Answer("D", "Q:3 D:A")]
        ),
    }));
    app.addCategory(new Category("prosperity", {
        1: new Question(
            1,
            "Prosperity Question 1",
            [new Answer("A", "Q:1 A:A"), new Answer("B", "Q:1 A:B"), new Answer("C", "Q:1 C:A"), new Answer("D", "Q:1 D:A")]
        ),
    }));
    app.addCategory(new Category("body & mind", {
        1: new Question(
            1,
            "Body & mind Question 1",
            [new Answer("A", "Q:1 A:A"), new Answer("B", "Q:1 A:B")]
        ),
    }));
    app.addCategory(new Category("mystery", {
        1: new Question(
            1,
            "Mystery Question 1",
            [new Answer("A", "Q:1 A:A"), new Answer("B", "Q:1 A:B"), new Answer("C", "Q:1 C:A"), new Answer("D", "Q:1 D:A")]
        ),
    }));

    app.boot();

    window["app"] = app;
};