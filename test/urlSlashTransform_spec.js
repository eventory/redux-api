"use strict";

/* global describe, it */
/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
import { expect } from "chai";
import urlSlashTransform from "../src/utils/urlSlashTransform";

describe("urlSlashTransform", function() {
  it("check slash", function() {
    expect(urlSlashTransform("/api/test/")).to.eql("/api/test");
    expect(urlSlashTransform("/api/test")).to.eql("/api/test");
    expect(urlSlashTransform("/api/test?p=5")).to.eql("/api/test?p=5");
    expect(urlSlashTransform("/api/test/?p=5")).to.eql("/api/test/?p=5");
    expect(urlSlashTransform("/api/")).to.eql("/api");
  });
});
