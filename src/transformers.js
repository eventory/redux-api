"use strict";

import { forEach } from "lodash";

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

/**
 * Default response transformers
 */
export default {
  array(data) {
    return !data ? [] : Array.isArray(data) ? data : [data];
  },
  collection(data) {
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
  },
  object(data) {
    return data || {};
  },
  infiniteCollection(prev, next) {
    const prevCollection = collection(prev)
    const nextCollection = collection(next)
    const mapCollection = new Map()

    prevCollection.items.forEach(item => map.set(item.id, item))
    nextCollection.items.forEach(item => map.set(item.id, item))

    return [...mapCollection.values()]
  }
};
