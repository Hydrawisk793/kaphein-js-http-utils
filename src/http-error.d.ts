import { HttpHeaderMap } from "./http-header-map";

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

    /**
     *  @param body A HTTP response body.  
     *  Any `undefined` values will be treated as a `null` value.  
     *  The body will not be cloned but referenced by the error object.
     */
    public constructor(
        status : number,
        headers : Record<string, string> | Iterable<[string, string]> | null,
        body : any
    );

    public readonly status : number;

    public readonly headers : HttpHeaderMap;

    public readonly body : any;
}
