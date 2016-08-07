import {Question} from "./Question";

export class Answer {

    private _question: Question;

    private _sequence: string;

    constructor(private _wording: string) {
    }

    set question(q: Question) {
        this._question = q;
    }

    get question(): Question {
        return this._question;
    }

    get sequence(): string {
        return this._sequence;
    }

    set sequence(value: string) {
        this._sequence = value;
    }

    get wording(): string {
        return this._wording;
    }
}