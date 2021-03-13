var kapheinJsTypeTrait = require("kaphein-js-type-trait");
var isNonNullObject = kapheinJsTypeTrait.isNonNullObject;
var isString = kapheinJsTypeTrait.isString;
var isIterable = kapheinJsTypeTrait.isIterable;
var kapheinJsCollection = require("kaphein-js-collection");
var StringKeyMap = kapheinJsCollection.StringKeyMap;

module.exports = (function ()
{
    var isSymbolSupported = Symbol && "function" === typeof Symbol;

    /**
     *  @constructor
     *  @param {Iterable<[string, string]>} [iterable]
     */
    function HttpHeaderMap()
    {
        /** @type {Iterable<[string, string]>} */var finalIterable = null;
        if(isIterable(arguments[0]))
        {
            finalIterable = Array
                .from(/** @type {Iterable<[string, string]>} */(arguments[0]))
                .map(
                    function (pair)
                    {
                        var value = pair[1];
                        if(!isString(value))
                        {
                            throw new TypeError("Only string values are allowed.");
                        }

                        return [pair[0].toLowerCase(), pair[1]];
                    }
                )
            ;
        }
        else if(isNonNullObject(arguments[0]))
        {
            var record = arguments[0];

            finalIterable = Object
                .keys(record)
                .map(
                    function (key)
                    {
                        var value = record[key];
                        if(!isString(value))
                        {
                            throw new TypeError("Only string values are allowed.");
                        }

                        return [key.toLowerCase(), value];
                    }
                )
            ;
        }

        this._map = new StringKeyMap(finalIterable);
        this.size = this._map.size;
    }

    HttpHeaderMap.prototype = {
        constructor : HttpHeaderMap,

        getSize : function getSize()
        {
            return this._map.size;
        },

        clear : function clear()
        {
            this._map.clear();
            this.size = this._map.size;
        },

        /**
         *  @param {string} key
         */
        "delete" : function (key)
        {
            var result = this._map["delete"](key.toLocaleLowerCase());
            this.size = this._map.size;

            return result;
        },

        entries : function entries()
        {
            return this._map.entries();
        },

        forEach : function forEach(callback)
        {
            var thisArg = arguments[1];

            var i, key;
            var keys = Array.from(this.keys());
            for(i = 0; i < keys.length; ++i)
            {
                key = keys[i];

                callback.call(thisArg, this.get(key), key, this);
            }
        },

        map : function map(callback)
        {
            var thisArg = arguments[1];

            var results = [];
            var i, key;
            var keys = Array.from(this.keys());
            for(i = 0; i < keys.length; ++i)
            {
                key = keys[i];

                results.push(callback.call(thisArg, this.get(key), key, this));
            }

            return results;
        },

        /**
         *  @param {string} key
         */
        get : function get(key)
        {
            return this._map.get(key.toLowerCase());
        },

        /**
         *  @param {string} key
         */
        has : function has(key)
        {
            return this._map.has(key.toLowerCase());
        },

        keys : function keys()
        {
            return this._map.keys();
        },

        /**
         *  @param {string} key
         *  @param {string} value
         */
        set : function set(key, value)
        {
            if(!isString(value))
            {
                throw new TypeError("Only string values are allowed.");
            }

            this._map.set(key.toLowerCase(), value);
            this.size = this._map.size;

            return this;
        },

        values : function values()
        {
            return this._map.values();
        },

        toRecord : function toRecord()
        {
            var letterCase = arguments[0];
            if(!isString(letterCase))
            {
                letterCase = "kebab";
            }

            /** @type {Record<string, string>} */var record = null;
            switch(letterCase.toLowerCase())
            {
            case "kebab":
                record = this._map.toRecord();
                break;
            case "cobol":
                record = Array
                    .from(this.entries())
                    .reduce(
                        function (acc, pair)
                        {
                            acc[pair[0].toUpperCase()] = pair[1];

                            return acc;
                        },
                        /** @type {Record<string, string>} */({})
                    )
                ;
                break;
            case "train":
                record = Array
                    .from(this.entries())
                    .reduce(
                        function (acc, pair)
                        {
                            var key = pair[0]
                                .split("-")
                                .filter(
                                    function (token)
                                    {
                                        return token.length > 0;
                                    }
                                )
                                .map(
                                    function (token)
                                    {
                                        return token[0].toUpperCase() + token.slice(1);
                                    }
                                )
                                .join("-")
                            ;

                            acc[key] = pair[1];

                            return acc;
                        },
                        /** @type {Record<string, string>} */({})
                    )
                ;
                break;
            default:
                throw new RangeError("'letterCase' must be 'kebab', 'cobol' or 'train'.");
            }

            return record;
        }
    };

    if(isSymbolSupported)
    {
        HttpHeaderMap.prototype[Symbol.iterator] = HttpHeaderMap.prototype.entries;

        HttpHeaderMap.prototype[Symbol.toStringTag] = "HttpHeaderMap";
    }

    return {
        HttpHeaderMap : HttpHeaderMap
    };
})();
