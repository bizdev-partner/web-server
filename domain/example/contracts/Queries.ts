
export class GetAllExamplesQuery {}

export class GetExampleByIdQuery {
    constructor(public readonly id: string) {}
}

export class GetExampleByNameQuery {
    constructor(public readonly name: string) {}
}

