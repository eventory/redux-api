"use strict";

/* global describe, it */
/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
import { expect } from "chai";
import composeHashFrom, {
  URL,
  BODY,
  HEADERS
} from "../src/utils/composeHashFrom";

describe("composeHashFrom", () => {
  it("check URL", () => {
    expect(composeHashFrom("/api/v1/test", {}, [URL])).to.eql("/api/v1/test");
    expect(composeHashFrom("/api/v1/test2", {}, [URL])).to.eql("/api/v1/test2");
  });

  it("check body", () => {
    expect(composeHashFrom("/api/v1/test", { body: { a: 5 } }, [BODY])).to.eql(
      '{"a":5}'
    );
    expect(
      composeHashFrom("/api/v1/test", { body: { a: 12, b: 13, c: "test" } }, [
        BODY
      ])
    ).to.eql('{"a":12,"b":13,"c":"test"}');
    expect(composeHashFrom("/api/v1/test", { body: "test" }, [BODY])).to.eql(
      "test"
    );
    expect(composeHashFrom("/api/v1/test", { body: 50000 }, [BODY])).to.eql(
      "50000"
    );
    expect(composeHashFrom("/api/v1/test", { body: "test" }, [BODY])).to.eql(
      "test"
    );
    expect(
      composeHashFrom("/api/v1/test", { body: '{"x":51}' }, [BODY])
    ).to.eql('{"x":51}');
    expect(composeHashFrom("/api/v1/test", { body: null }, [BODY])).to.eql(
      "{}"
    );
    expect(composeHashFrom("/api/v1/test", { body: undefined }, [BODY])).to.eql(
      "{}"
    );
    expect(composeHashFrom("/api/v1/test", {}, [BODY])).to.eql("{}");
    expect(composeHashFrom("/api/v1/test", undefined, [BODY])).to.eql("{}");
    expect(composeHashFrom("/api/v1/test", null, [BODY])).to.eql("{}");
  });

  it("check headers", () => {
    expect(
      composeHashFrom("/api/v1/test", { headers: null }, [HEADERS])
    ).to.eql("{}");
    expect(
      composeHashFrom(
        "/api/v1/test",
        { headers: { Accept: "application/json" } },
        [HEADERS]
      )
    ).to.eql('{"Accept":"application/json"}');
  });

  it("check body + headers", () => {
    expect(
      composeHashFrom("/api/v1/test", { headers: { a: 5 }, body: { b: 10 } }, [
        HEADERS,
        BODY
      ])
    ).to.eql('{"b":10}{"a":5}');
    expect(
      composeHashFrom("/api/v1/test", { headers: { a: 5 } }, [HEADERS, BODY])
    ).to.eql('{}{"a":5}');
    expect(composeHashFrom("/api/v1/test", {}, [HEADERS, BODY])).to.eql("{}{}");
  });

  it("check body + headers + url", () => {
    expect(
      composeHashFrom("/api/v1/test", { headers: { a: 5 }, body: { b: 10 } }, [
        URL,
        HEADERS,
        BODY
      ])
    ).to.eql('{"b":10}{"a":5}/api/v1/test');
    expect(
      composeHashFrom("/api/v1/test", { headers: { a: 5 } }, [
        URL,
        HEADERS,
        BODY
      ])
    ).to.eql('{}{"a":5}/api/v1/test');
    expect(composeHashFrom("/api/v1/test", {}, [URL, HEADERS, BODY])).to.eql(
      "{}{}/api/v1/test"
    );
    expect(composeHashFrom(null, {}, [URL, HEADERS, BODY])).to.eql("{}{}null");
  });
});
