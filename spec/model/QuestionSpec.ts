/* jslint node: true */
/* global describe, it, expect */
/// <reference path="../../../typings/globals/jasmine/index.d.ts" />

"use strict";

import {Question} from "../../../src/ts/model/Question";

describe("Question", function () {
    it("has wording", function(){
        let q = new Question("Question wording");


    });
});