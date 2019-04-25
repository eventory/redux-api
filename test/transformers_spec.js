"use strict";

/* global describe, it */
/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
import { expect } from "chai";
import { responseTransform } from "../src/transformers"

describe("transformers", () => {
  it("check performing", () => {
    let data = [
      {
        api: {
          sync: false,
          syncing: false,
          loading: false
        }
      },
      {
        api: {
          sync: false,
          syncing: false,
          loading: false,
          performing: true,
          empty: true
        }
      }
    ]

    expect(responseTransform(data[0])).to.eql(data[1]);

    data = [
      {
        api: {
          sync: true,
          syncing: false,
          loading: false
        }
      },
      {
        api: {
          sync: true,
          syncing: false,
          loading: false,
          performing: false,
          empty: true
        }
      }
    ]

    expect(responseTransform(data[0])).to.eql(data[1]);

    data = [
      {
        api: {
          sync: false,
          syncing: true,
          loading: false
        }
      },
      {
        api: {
          sync: false,
          syncing: true,
          loading: false,
          performing: true,
          empty: true
        }
      }
    ]

    expect(responseTransform(data[0])).to.eql(data[1]);

    data = [
      {
        api: {
          sync: false,
          syncing: false,
          loading: true
        }
      },
      {
        api: {
          sync: false,
          syncing: false,
          loading: true,
          performing: true,
          empty: true
        }
      }
    ]

    expect(responseTransform(data[0])).to.eql(data[1]);
  })

  it("check performing with errors", () => {
    let data = [
      {
        api: {
          sync: false,
          syncing: true,
          loading: false,
          error: "?"
        }
      },
      {
        api: {
          sync: false,
          syncing: true,
          loading: false,
          performing: false,
          empty: true,
          error: "?"
        }
      }
    ]

    expect(responseTransform(data[0])).to.eql(data[1]);

    data = [
      {
        api: {
          sync: true,
          syncing: false,
          loading: false,
          error: null
        }
      },
      {
        api: {
          sync: true,
          syncing: false,
          loading: false,
          performing: false,
          empty: true,
          error: null
        }
      }
    ]

    expect(responseTransform(data[0])).to.eql(data[1]);
  })

  it("check empty", () => {
    let data = [
      {
        api: {
          sync: false,
          syncing: true,
          loading: false,          
        },
        xyz: 5
      },
      {
        api: {
          sync: false,
          syncing: true,
          loading: false,
          performing: true,
          empty: false,
        },
        xyz: 5
      }
    ]

    expect(responseTransform(data[0])).to.eql(data[1]);

    data = [
      {
        api: {
          sync: true,
          syncing: false,
          loading: false,
          error: null
        },
        items: []
      },
      {
        api: {
          sync: true,
          syncing: false,
          loading: false,
          performing: false,
          empty: true,
          error: null
        },
        items: []
      }
    ]

    expect(responseTransform(data[0])).to.eql(data[1]);

    data = [
      {
        api: {
          sync: true,
          syncing: false,
          loading: false,
          error: null
        },
        items: [{a: 5}]
      },
      {
        api: {
          sync: true,
          syncing: false,
          loading: false,
          performing: false,
          empty: false,
          error: null
        },
        items: [{a: 5}]
      }
    ]

    expect(responseTransform(data[0])).to.eql(data[1]);

    data = [
      {
        api: {
          sync: true,
          syncing: false,
          loading: false,
          error: null
        },
        items: [],
        meta: {total: 0}
      },
      {
        api: {
          sync: true,
          syncing: false,
          loading: false,
          performing: false,
          empty: true,
          error: null
        },
        items: [],
        meta: {total: 0}
      }
    ]

    expect(responseTransform(data[0])).to.eql(data[1]);
  })
})