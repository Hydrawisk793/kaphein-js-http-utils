var extendClass = require("kaphein-js").extendClass;
var isUndefinedOrNull = require("kaphein-js").isUndefinedOrNull;
var isString = require("kaphein-js").isString;
var HttpHeaderMap = require("./http-header-map").HttpHeaderMap;

module.exports = (function ()
{
    var mineTypeText = "text/plain; charset=utf-8"

    var HttpError = extendClass(
        Error,
        /**
         *  @constructor
         */
        function HttpError()
        {
            switch(arguments.length)
            {
            case 0:
                _constructWithStatusAndMessage(
                    this,
                    400,
                    "A HTTP request has failed with status " + 400 + "."
                );
                break;
            case 1:
                if(arguments[0] instanceof HttpError)
                {
                    Error.call(this, arguments[0].message);

                    this.status = arguments[0].status;
                    this.headers = new HttpHeaderMap(arguments[0].headers);
                    this.body = Object.assign({}, arguments[0].body);
                }
                else if(arguments[0] instanceof Error)
                {
                    _constructWithStatusAndMessage(this, 400, arguments[0].message);
                }
                else if(isString(arguments[0]))
                {
                    _constructWithStatusAndMessage(this, 400, arguments[0]);
                }
                else if(Number.isSafeInteger(arguments[0]))
                {
                    _constructWithStatusAndMessage(
                        this,
                        arguments[0],
                        "A HTTP request has failed with status " + arguments[0] + "."
                    );
                }
                else
                {
                    throw new TypeError("The parameter must be a safe integer, a string, an instance of 'Error' or an instance of 'HttpError'.");
                }
                break;
            case 2:
                _constructWithStatusAndMessage(
                    this,
                    arguments[0],
                    arguments[1]
                );
                break;
            case 3:
                if(!Number.isSafeInteger(arguments[0]))
                {
                    throw new TypeError("'status' must be a safe integer.");
                }

                Error.call(this, "A HTTP request has failed with status " + arguments[0] + ".");

                this.status = arguments[0];
                this.headers = new HttpHeaderMap(arguments[1]);
                this.body = (isUndefinedOrNull(arguments[2]) ? null : arguments[2]);
                break;
            default:
                throw new Error("An unknown combination of parameters has been passed.");
            }

            if(Error.captureStackTrace)
            {
                Error.captureStackTrace(this, HttpError);
            }

            this.name = "HttpError";
        },
        {
            status : 400,

            /** @type {HttpHeaderMap} */headers : null,

            /** @type {any} */body : null
        }
    );

    /**
     *  @param {HttpError} thisRef
     *  @param {number} status
     *  @param {string} message
     */
    function _constructWithStatusAndMessage(thisRef, status, message)
    {
        if(!Number.isSafeInteger(status))
        {
            throw new TypeError("'status' must be a safe integer.");
        }

        if(!isString(message))
        {
            throw new TypeError("'message', must be a string");
        }

        Error.call(thisRef, message);

        thisRef.status = status;
        thisRef.headers = new HttpHeaderMap({
            "content-type" : mineTypeText
        });
        thisRef.body = message;
    }

    return {
        HttpError : HttpError
    };
})();
