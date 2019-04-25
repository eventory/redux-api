export default function(response) {
  const pure = { ...response };
  delete pure.api;
  return pure;
}
