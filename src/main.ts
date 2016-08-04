///<reference path="../typings/index.d.ts"/>

import {App} from "./App";
import {Category} from "./model/Category";
import {Question} from "./model/Question";
import {Answer} from "./model/Answer";

window.onload = function () {
    let app = new App("body");

    app.addCategory(new Category("love", {
        1: new Question(
            "Love Question 1",
            {
                A: new Answer("A", "Q:1 A:A"),
                B: new Answer("B", "Q:1 A:B"),
                C: new Answer("C", "Q:1 C:A"),
                D: new Answer("D", "Q:1 D:A")
            }
        ),
        2: new Question(
            "Love Question 2",
            {A: new Answer("A", "Q:2 A:A"), B: new Answer("B", "Q:2 A:B")}
        ),
        3: new Question(
            "Love Question 3",
            {
                A: new Answer("A", "Q:3 A:A"),
                B: new Answer("B", "Q:3 A:B"),
                C: new Answer("C", "Q:3 C:A"),
                D: new Answer("D", "Q:3 D:A")
            }
        ),
    }));
    app.addCategory(new Category("prosperity", {
        1: new Question(
            "Prosperity Question 1",
            {
                A: new Answer("A", "Q:1 A:A"),
                B: new Answer("B", "Q:1 A:B"),
                C: new Answer("C", "Q:1 C:A"),
                D: new Answer("D", "Q:1 D:A")
            }
        ),
    }));
    app.addCategory(new Category("body & mind", {
        1: new Question(
            "Body & mind Question 1",
            {A: new Answer("A", "Q:1 A:A"), B: new Answer("B", "Q:1 A:B")}
        ),
    }));
    app.addCategory(new Category("mystery", {
        1: new Question(
            "Mystery Question 1",
            {
                A: new Answer("A", "Q:1 A:A"),
                B: new Answer("B", "Q:1 A:B"),
                C: new Answer("C", "Q:1 C:A"),
                D: new Answer("D", "Q:1 D:A")
            }
        ),
    }));

    app.boot();

    window["app"] = app;
};