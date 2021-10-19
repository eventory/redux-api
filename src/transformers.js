"use strict";

/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}], no-void: 0 */
import uniqBy from "lodash/unionBy";

const transformEmpty = response => {
  const keys = Object.keys(response);
  return keys.length < 2 || !!(response.items && response.items.length === 0);
};

const transformPerforming = response => {
  if (response.api.error && response.api.error.constructor === Object)
    return false;
  return response.api.loading || response.api.syncing || !response.api.sync;
};

export const responseTransform = response => {
  if (response.api) {
    response.api.empty = transformEmpty(response);
    response.api.performing = transformPerforming(response);
  }
  return response;
};

const transformCollection = data => {
  if (!data)
    return {
      items: [],
      meta: {
        next: null,
        page: 1,
        pages: 0,
        per_page: 25,
        previous: null,
        total: 0
      }
    };
  return data;
};

/**
 * Default response transformers
 */
export default {
  array(data) {
    return !data ? [] : Array.isArray(data) ? data : [data];
  },
  collection(data) {
    return transformCollection(data);
  },
  object(data) {
    return data || {};
  },
  infiniteCollection(next, prev) {
    const prevCollection = transformCollection(prev);
    const nextCollection = transformCollection(next);

    nextCollection.items = uniqBy(
      [...prevCollection.items, ...nextCollection.items],
      "id"
    );
    return nextCollection;
  }
};
