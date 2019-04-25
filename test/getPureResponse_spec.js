"use strict";

/* global describe, it */
/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
import { expect } from "chai";
import getPureResponse from "../src/utils/getPureResponse";

describe("getPureResponse", () => {
  it("check without api", () => {
    let data = [
      {
        api: { loading: true},
        xyz: 5
      },
      {
        xyz: 5
      }
    ]

    expect(getPureResponse(data[0])).to.eql(data[1]);

    data = [
      {
        api: { loading: true},
        items: [{a: 5}],
        meta: {total: 1}
      },
      {
        items: [{a: 5}],
        meta: {total: 1}
      }
    ]

    expect(getPureResponse(data[0])).to.eql(data[1]);    
  })

  it("check without api integrity", () => {
    const data = [
      {
        api: { loading: true},
        xyz: 5
      },
      {
        xyz: 5
      }
    ]

    expect(getPureResponse(data[0])).to.eql(data[1]);

    const before = {
      api: { loading: true },
      xyz: 5
    }

    expect(data[0]).to.eql(before);
    expect(getPureResponse(before)).to.eql(data[1]);
  })
})