const { assert } = require("chai");

const { HttpHeaderMap } = require("../src");

describe("HttpHeaderMap", function ()
{
    const toCurrentCase = function ()
    {
        return this + "";
    };
    const caseConversionFunctions = [
        toCurrentCase,
        String.prototype.toLowerCase,
        String.prototype.toUpperCase,
    ];

    const record = {
        "Content-Type" : "application/json; charset=utf-8",
        "Authorization" : "foo.bar.baz"
    };
    const arrayOfPairsOfRecord = Array.from(Object.keys(record)).map((key) => [key, record[key]]);
    const keysOfRecord = arrayOfPairsOfRecord.map((pair) => pair[0]);
    const cobolCasedKeysOfRecord = keysOfRecord.map((key) => key.toUpperCase());
    const kebabCasedKeysOfRecord = keysOfRecord.map((key) => key.toLowerCase());
    const kebabCasedKeyRecord = arrayOfPairsOfRecord.reduce(
        (acc, pair) =>
        {
            acc[pair[0].toLowerCase()] = pair[1];

            return acc;
        },
        /** @type {Record<string, string>} */({})
    );

    describe("default constructor", function ()
    {
        it("should have no elements", function ()
        {
            const map = new HttpHeaderMap();

            assert.equal(map.size, 0, "The map must have no elements.");
        });
    });

    describe("construction with an undefined value", function ()
    {
        it("should have no elements", function ()
        {
            const map = new HttpHeaderMap(void 0);

            assert.equal(map.size, 0, "The map must have no elements.");
        });
    });

    describe("construction with a null value", function ()
    {
        it("should have no elements", function ()
        {
            const map = new HttpHeaderMap(null);

            assert.equal(map.size, 0, "The map must have no elements.");
        });
    });

    describe("construction with an iterable", function ()
    {
        const map = new HttpHeaderMap(arrayOfPairsOfRecord);

        it("should have same number of elements as the number of elements of the iterable.", function ()
        {
            assert.equal(map.size, arrayOfPairsOfRecord.length, "The number of elements does not match.");
        });

        it("should lower-case the keys", function ()
        {
            assert.deepEqual(Array.from(map.keys()), kebabCasedKeysOfRecord, "The keys must be lower-cased.");
        });

        it("should have same values as the original record's values", function ()
        {
            assert.equal(
                Array
                    .from(kebabCasedKeysOfRecord)
                    .reduce(
                        (acc, key) =>
                        {
                            acc = acc && map.get(key) === kebabCasedKeyRecord[key];

                            return acc;
                        },
                        true
                    ),
                true,
                "Values does not match."
            );
        });
    });

    describe("construction with a record", function ()
    {
        const map = new HttpHeaderMap(record);

        it("should have same number of elements as the original record", function ()
        {
            assert.equal(map.size, Object.keys(record).length, "The number of elements does not match.");
        });

        it("should lower-case the keys", function ()
        {
            assert.deepEqual(Array.from(map.keys()), kebabCasedKeysOfRecord, "The keys must be lower-cased.");
        });

        it("should have same values as the original record's values", function ()
        {
            assert.equal(
                Array
                    .from(kebabCasedKeysOfRecord)
                    .reduce(
                        (acc, key) =>
                        {
                            acc = acc && map.get(key) === kebabCasedKeyRecord[key];

                            return acc;
                        },
                        true
                    ),
                true,
                "Values does not match."
            );
        });
    });

    describe("get method", function ()
    {
        it("should ignore case sensitivity of keys", function ()
        {
            const map = new HttpHeaderMap(record);
            const key = "Content-Type";
            const originalValue = record[key];

            for(let i = 0; i < caseConversionFunctions.length; ++i)
            {
                const caseConversionFunction = caseConversionFunctions[i];
                const keyValue = caseConversionFunction.call(key);

                assert.equal(map.get(keyValue), originalValue, "Values are must be equal.");
            }
        });
    });

    describe("set method", function ()
    {
        it("should ignore case sensitivity of keys", function ()
        {
            const key = "Content-Type";
            const mineTypes = [
                "application/json; charset=utf-8",
                "text/plain; charset=utf-8"
            ];

            for(let i = 0; i < mineTypes.length; ++i)
            {
                const mineType = mineTypes[i];

                for(let j = 0; j < caseConversionFunctions.length; ++j)
                {
                    const caseConversionFunction = caseConversionFunctions[j];
                    const keyValueForSet = caseConversionFunction.call(key);
                    const map = new HttpHeaderMap();

                    map.set(keyValueForSet, mineType);

                    for(let k = 0; k < caseConversionFunctions.length; ++k)
                    {
                        const caseConversionFunction = caseConversionFunctions[k];
                        const keyValueForGet = caseConversionFunction.call(key);

                        assert.equal(map.has(keyValueForGet), true, "The map must have the key-value pair.");
                        assert.equal(map.get(keyValueForGet), mineType, "Values are must be equal.");
                    }
                }
            }
        });
    });

    describe("set method and delete method", function ()
    {
        const map = new HttpHeaderMap();

        it("should increase the size", function ()
        {
            map.set("Content-Type", "text/plain");
            assert.equal(map.size, 1, "The size must be increased.");
        });

        it("should not increase the size", function ()
        {
            map.set("content-type", "application/json");
            assert.equal(map.size, 1, "The size must not be increased.");
        });

        it("should decrease the size", function ()
        {
            map["delete"]("content-type");
            assert.equal(map.size, 0, "The size must be decreased.");
        });

        it("should not decrease the size", function ()
        {
            map["delete"]("Content-type");
            assert.equal(map.size, 0, "The size must not be decreased.");
        });
    });

    describe("toRecord method", function ()
    {
        it("should have same values as the original record's values", function ()
        {
            const map = new HttpHeaderMap(arrayOfPairsOfRecord);
            const rec = map.toRecord();

            assert.equal(
                Array
                    .from(kebabCasedKeysOfRecord)
                    .reduce(
                        (acc, key) =>
                        {
                            acc = acc && rec[key] === kebabCasedKeyRecord[key];

                            return acc;
                        },
                        true
                    ),
                true,
                "Values does not match."
            );
        });

        it("should kebab-case keys with no parameters", function ()
        {
            const map = new HttpHeaderMap(record);
            const r = map.toRecord();
            assert.containsAllKeys(r, kebabCasedKeysOfRecord, "The keys must be kebab-cased.");
        });

        it("should kebab-case keys with a 'kebab' parameter", function ()
        {
            const map = new HttpHeaderMap(record);
            const r = map.toRecord("kebab");
            assert.hasAllKeys(r, kebabCasedKeysOfRecord, "The keys must be kebab-cased.");
        });

        it("should cobol-case keys with a 'cobol' parameter", function ()
        {
            const map = new HttpHeaderMap(kebabCasedKeyRecord);
            const r = map.toRecord("cobol");
            assert.hasAllKeys(r, cobolCasedKeysOfRecord, "The keys must be cobol-cased.");
        });

        it("should train-case keys with a 'train' parameter", function ()
        {
            const map = new HttpHeaderMap(kebabCasedKeyRecord);
            const r = map.toRecord("train");
            assert.hasAllKeys(r, keysOfRecord, "The keys must be train-cased.");
        });
    });
});
