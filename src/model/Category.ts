import {Question} from "./Question";

export class Category {

    constructor(private _name: string, private _questions: Question[]) {
        let question: Question;

        for (question of _questions) {
            question.category = this;
        }
    }

    get name(): string {
        return this._name;
    }

    get questions(): Question[] {
        return this._questions;
    }
}