import {Question} from "./Question";

export class Category {

    constructor(private _name: string, private _questions: CategoryQuestions) {
        for (let questionNo in _questions) {
            _questions[questionNo].category = this;
        }
    }

    get name(): string {
        return this._name;
    }

    get questions(): CategoryQuestions {
        return this._questions;
    }
}

interface CategoryQuestions {
    1: Question;
    2?: Question;
    3?: Question;
}