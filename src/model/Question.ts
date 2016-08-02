import {Answers} from "./Answers";

export class Question {
    constructor(private _wording: string, private _answers: Answers) {
    }

    get wording(): string {
        return this._wording;
    }

    get answers(): Answers {
        return this._answers;
    }
}