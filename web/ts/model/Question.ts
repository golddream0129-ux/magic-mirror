import {Answer} from "./Answer";
import {Category} from "./Category";

export class Question {

    private _category: Category;

    private _sequence: number;

    constructor(private _wording: string, private _answers: QuestionAnswers) {
        for (let answerKey in _answers) {
            _answers[answerKey].question = this;
            _answers[answerKey].sequence = answerKey;
        }
    }

    set category(category: Category) {
        this._category = category;
    }

    get sequence(): number {
        return this._sequence;
    }

    set sequence(value) {
        this._sequence = value;
    }

    get category(): Category {
        return this._category;
    }

    get wording(): string {
        return this._wording;
    }

    get answers(): QuestionAnswers {
        return this._answers;
    }
}

export interface QuestionAnswers {
    A: Answer;
    B: Answer;
    C?: Answer;
    D?: Answer;
}