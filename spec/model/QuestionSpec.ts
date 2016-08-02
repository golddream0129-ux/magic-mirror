/* jslint node: true */
/* global describe, it, expect */

/// <reference path="../../typings/index.d.ts" />

"use strict";

import {Question} from "../../src/model/Question";

describe("Question", function () {
    it("has wording, and answers", function () {
        let wording = "Question wording",
            answers = {A: "Answer A", B: "Answer B"};

        let q = new Question(wording, answers);

        expect(q.wording).toBe(wording);
        expect(q.answers).toBe(answers);
    });
});