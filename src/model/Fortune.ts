export class Fortune {
    constructor(private _answer1: string,
                private _answer2: string,
                private _answer3: string,
                private _fortune: string) {
    }

    get answer1(): string {
        return this._answer1;
    }


    get answer2(): string {
        return this._answer2;
    }

    get answer3(): string {
        return this._answer3;
    }

    get fortune(): string {
        return this._fortune;
    }
}