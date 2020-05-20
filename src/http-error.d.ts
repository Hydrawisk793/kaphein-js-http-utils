export declare class HttpError extends Error
{
    public constructor();

    public constructor(
        src : HttpError
    );

    public constructor(
        src : Error
    );

    public constructor(
        status : number
    );

    public constructor(
        message : string
    );

    public constructor(
        status : number,
        message : string
    );

    public constructor(
        status : number,
        headers : Record<string, string> | null,
        body : any
    );

    public readonly status : number;

    public readonly headers : Record<string, string>;

    public readonly body : any;
}
