import {Question} from "./Question";

export class Answer {

    private _question: Question;

    constructor(private _key: string, private _wording: string) {
    }

    set question(q: Question) {
        this._question = q;
    }

    get question(): Question {
        return this._question;
    }

    get key(): string {
        return this._key;
    }

    get wording(): string {
        return this._wording;
    }
}