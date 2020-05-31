const { assert } = require("chai");

const { HttpError } = require("../src/http-error");

describe("HttpError", function ()
{
    const mineTypeTextPlain = "text/plain; charset=utf-8";
    const mineTypeAppJson = "application/json; charset=utf-8";

    describe("Error class extention", function ()
    {
        const res = new HttpError();

        it("should be an instance of Error", function ()
        {
            assert.instanceOf(res, Error, "The instanceof operator must return true.");
        });
    });

    describe("default constructor", function ()
    {
        const res = new HttpError();

        it("should set status code to 400", function ()
        {
            assert.equal(res.status, 400, "'status' must be 400.");
        });

        it("should set 'Content-Type' header and body.", function ()
        {
            assert.equal(res.headers.get("Content-Type"), mineTypeTextPlain, `'${ "Content-Type" }' must be '${ mineTypeTextPlain }'.`);
            assert.isString(res.body, "'body' must be a string.");
        });
    });

    describe("construction with a status code", function ()
    {
        const res = new HttpError(401);

        it("should set status code", function ()
        {
            assert.equal(res.status, 401, "'status' must be 401.");
        });

        it("should set 'Content-Type' header and body.", function ()
        {
            assert.equal(res.headers.get("Content-Type"), mineTypeTextPlain, `'${ "Content-Type" }' must be '${ mineTypeTextPlain }'.`);
            assert.isString(res.body, "'body' must be a string.");
        });
    });

    describe("construction with a message", function ()
    {
        const msg = "An error message";
        const res = new HttpError(msg);

        it("should set status code to 400", function ()
        {
            assert.equal(res.status, 400, "'status' must be 400.");
        });

        it("should set 'Content-Type' header and body.", function ()
        {
            assert.equal(res.headers.get("Content-Type"), mineTypeTextPlain, `'${ "Content-Type" }' must be '${ mineTypeTextPlain }'.`);
            assert.isString(res.body, "'body' must be a string.");
            assert.equal(res.body, msg, `'body' must be equal to '${ msg }'.`);
        });
    });

    describe("construction with a status and a message", function ()
    {
        const status = 401;
        const msg = "An error message";
        const res = new HttpError(status, msg);

        it(`should set status code to ${ status }`, function ()
        {
            assert.equal(res.status, status, `'status' must be ${ status }.`);
        });

        it("should set 'Content-Type' header and body.", function ()
        {
            assert.equal(res.headers.get("Content-Type"), mineTypeTextPlain, `'${ "Content-Type" }' must be '${ mineTypeTextPlain }'.`);
            assert.isString(res.body, "'body' must be a string.");
            assert.equal(res.body, msg, `'body' must be equal to '${ msg }'.`);
        });
    });

    describe("construction with a status, headers and a body", function ()
    {
        const status = 401;
        const msg = "An error message";
        const headers = {
            "Content-Type" : mineTypeAppJson
        };
        const body = {
            "error" : {
                "message" : msg
            }
        };
        const res = new HttpError(status, headers, body);

        it(`should set status code to ${ status }`, function ()
        {
            assert.equal(res.status, status, `'status' must be ${ status }.`);
        });

        it("should set 'Content-Type' header and body.", function ()
        {
            assert.notEqual(res.headers.toRecord("train"), headers, "headers must be cloned.");
            assert.deepEqual(res.headers.toRecord("train"), headers, `'headers' must be deep-equal to '${ headers }'.`);

            assert.isObject(res.body, "'body' must be an object.");
            assert.deepEqual(res.body, body, `'body' must be deep-equal to '${ body }'.`);
            assert.equal(res.body, body, `'body' must be same as '${ body }'.`);
        });
    });

    describe("copy construction", function ()
    {
        const status = 401;
        const msg = "An error message";
        const headers = {
            "Content-Type" : mineTypeAppJson
        };
        const body = {
            "error" : {
                "message" : msg
            }
        };
        const res = new HttpError(status, headers, body);
        const copyOfRes = new HttpError(res);

        it("should equal to the original.", function ()
        {
            assert.deepEqual(copyOfRes.status, res.status, `'status' must be ${ status }.`);
            assert.deepEqual(copyOfRes.headers.toRecord(), res.headers.toRecord(), `'headers' must be deep-equal to '${ headers }'.`);
            assert.deepEqual(copyOfRes.body, res.body, `'body' must be deep-equal to '${ body }'.`);
        });
    });

    describe("construction with an Error", function ()
    {
        const error = new Error("An error message");
        const res = new HttpError(error);

        it(`should set status code to ${ 400 }`, function ()
        {
            assert.equal(res.status, 400, `'status' must be ${ 400 }.`);
        });

        it("should set 'Content-Type' header and body.", function ()
        {
            assert.equal(res.headers.get("Content-Type"), mineTypeTextPlain, `'${ "Content-Type" }' must be '${ mineTypeTextPlain }'.`);
            assert.isString(res.body, "'body' must be a string.");
            assert.equal(res.body, error.message, `'body' must be equal to '${ error.message }'.`);
        });
    });
});
