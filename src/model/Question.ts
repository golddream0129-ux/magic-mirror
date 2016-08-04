import {Answer} from "./Answer";
import {Category} from "./Category";

export class Question {

    private _category: Category;

    constructor(private _sequence, private _wording: string, private _answers: Answer[]) {
        let answer: Answer;

        for (answer of _answers) {
            answer.question = this;
        }
    }

    set category(category: Category) {
        this._category = category;
    }

    get sequence(): number {
        return this._sequence;
    }

    get category(): Category {
        return this._category;
    }

    get wording(): string {
        return this._wording;
    }

    get answers(): Answer[] {
        return this._answers;
    }
}