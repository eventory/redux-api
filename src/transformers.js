"use strict";

const toString = Object.prototype.toString;
const OBJECT = "[object Object]";

const transformEmpty = response => {
  const keys = Object.keys(response);
  return keys.length < 2 || !!(response.items && response.items.length === 0);
}

const transformPerforming = response => {
  if(response.api.error) return false
  return response.api.loading || response.api.syncing || !response.api.sync
}

export const responseTransform = response => {
  if (response.api) {
    response.api.empty = transformEmpty(response)
    response.api.performing = transformPerforming(response)
  }
  return response;
};

/**
 * Default responce transformens
 */
export default {
  array(data) {
    return !data ? [] : Array.isArray(data) ? data : [data];
  },
  object(data) {
    if (!data) {
      return {};
    }
    return toString.call(data) === OBJECT ? data : { data };
  }
};
