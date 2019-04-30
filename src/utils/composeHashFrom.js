export const URL = "url";
export const BODY = "body";
export const HEADERS = "headers";
export const ARRAY_DEFAULT = [URL, BODY, HEADERS];

export default function(url, opts, composeHashFrom = []) {
  if (!opts) opts = {};
  return composeHashFrom.reduce((prev, curr) => {
    const produceEach = () => {
      switch (curr) {
        case URL:
          return url;
        case HEADERS:
          return JSON.stringify(opts.headers || {});
        case BODY:
          if (typeof opts.body === "string") return opts.body;
          return JSON.stringify(opts.body || {});
        default:
          throw new Error("Undefined type");
      }
    };
    return produceEach() + prev;
  }, "");
}
