export declare class HttpHeaderMap implements Map<string, string>
{
    public constructor();

    public constructor(
        iterable : Iterable<[string, string]>
    );

    public constructor(
        record : Record<string, string>
    );

    public [Symbol.toStringTag] : string;

    public readonly size : number;

    public getSize() : number;

    public clear(): void;

    public delete(
        key : string
    ) : boolean;

    public forEach(
        callbackFn : (
            value : string,
            key : string,
            map : HttpHeaderMap
        ) => void,
        thisArg? : any
    ) : void;

    public map<R>(
        callbackFn : (
            value : string,
            key : string,
            map : HttpHeaderMap
        ) => R,
        thisArg? : any
    ) : R[];

    public [Symbol.iterator]() : IterableIterator<[string, string]>;

    public entries() : IterableIterator<[string, string]>;

    public keys() : IterableIterator<string>;

    public values() : IterableIterator<string>;

    public get(
        key : string
    ) : string | undefined;

    public has(
        key : string
    ) : boolean;

    public set(
        key : string,
        value : string
    ) : this;

    public toRecord(
        letterCase? : "kebab" | "cobol" | "train"
    ) : Record<string, string>;
}
