### Redux-api
Flux REST API for redux infrastructure

[![Build Status](https://travis-ci.org/lexich/redux-api.svg)](https://travis-ci.org/lexich/redux-api)
[![NPM version](https://badge.fury.io/js/redux-api.svg)](http://badge.fury.io/js/redux-api)
[![Coverage Status](https://coveralls.io/repos/lexich/redux-api/badge.png?branch=master)](https://coveralls.io/r/lexich/redux-api?branch=master)

## Introduction
`redux-api` solves the problem of writing clients to communicate with backends. It generates [actions](http://redux.js.org/docs/basics/Actions.html) and [reducers](http://redux.js.org/docs/basics/Reducers.html) for making AJAX calls to API endpoints. You don't need to write a lot of [boilerplate code](http://redux.js.org/docs/advanced/ExampleRedditAPI.html) if you use `redux` and want to exchange data with server.

Inspired by [Redux-rest](https://github.com/Kvoti/redux-rest) and is intended to be used with [Redux](https://github.com/gaearon/redux).


## Documentation
See [DOCS.md](docs/DOCS.md) for API documentation.
## Use cases
* [AuthorizationJWT.md](docs/AuthorizationJWT.md) - example of JWT Authorization  
* [Scoping.md](docs/Scoping.md) - use scoping or using multiple redux-api instance without naming intersections.

## Install
With npm:
```sh
npm install redux-api --save
```
With bower:
```sh
bower install redux-api --save
```

If you don't use tools like webpack, browserify, etc and you want to load redux-api manually, the best way to add redux-api to your project is:
```js
<script src="(...)/redux-api.min.js"></script>
<script>
  window.ReduxApi = window["redux-api"];
  // or
  var ReduxApi = window["redux-api"];
  // initialization code
</script>
```

=======
## Remote calls

`redux-api` doesn't bind you to a technology to make AJAX calls. It uses configurable `adapters` - a pretty simple function which receives 2 arguments: `endpoint` and `options`, and returns a Promise as result. The default adapter uses [isomorphic-fetch](https://github.com/matthew-andrews/isomorphic-fetch), and has an implementation like this:
```js
function adapterFetch(url, options) {
  return fetch(url, options);
}
```

However, you are not tied to using isomorphic-fetch. For instance, if you prefer to use jQuery, you can use the following adapter:
```js
function adapterJquery(url, options) {
  return new Promise((success, error)=> {
    $.ajax({ ...options, url, success, error });
  });
}
```
This implementation allows you to make any request and process any response.

And of course you have to set up adapter to your `redux-api` instance before using.
```
  reduxApi(....).use("fetch", adapterFetch)
```

=======
## Examples

### Basic usage
api/test.js
```js
import reduxApi, { transformers } from 'redux-api'
import fetch from 'isomorphic-fetch'

import adapterFetch from 'api/helpers/fetch'
import { getRequestHeaders } from 'api/helpers/actions'

export default reduxApi({
  objects: {
    url: '/webapi/v1/test/list',
    options: {
      method: 'GET',
    },
    transformer: transformers.collection,
  },
  createObject: {
    url: '/webapi/v1/test/creator',
    virtual: true,
    options: {
      method: 'POST',
    },
    transformer: transformers.object,
  },
}).use('fetch', adapterFetch(fetch)).use('options', () => ({
  headers: getRequestHeaders(),
}))
```

`transformers.collection`: returns response or when it's undefined { items: [], meta: { ... }}
`transformers.object`: returns response or empty object when it's undefined

### Multiple requests for same resource
api/test.js
```js
import reduxApi, { transformers, HASH } from 'redux-api'
import fetch from 'isomorphic-fetch'

import adapterFetch from 'api/helpers/fetch'
import { getRequestHeaders } from 'api/helpers/actions'

export default reduxApi({
  test: {
    url: 'http://localhost:3000/',
    options: {
      method: 'POST',
    },
    transformer: transformers.object,
    composeHashFrom: [HASH.URL],
  },
}).use('fetch', adapterFetch(fetch)).use('options', () => ({
  headers: getRequestHeaders(),
}))
```

`composeHashFrom` is an object with { URL, HEADERS, BODY } parameters. The purpose of that object is to generate hash which leads to recognize
newest request for same/similiar resource.

`GET` /api/test `composeHashFrom` - [URL] could be enough

`POST` /api/test/create `composeHashFrom` - [URL] could not be enough 'cause for example body in POST is changing every request. In that case it should be [HASH.BODY, HASH.URL]

Test.js
```js
import React, { useEffect } from 'react'
import { connect } from 'react-redux'

import testApi from 'api/test'

const tickets = ({
  test,
  fetchTest,
}) => {
  useEffect(() => {
    for (let i = 0; i <= 20; i++) fetchTest({}, { x: i })
  }, [])
  return <span>{test.x}</span>
}

const mapStateToProps = state => ({
  test: state.test,
})

const mapDispatchToProps = ({
  fetchTest: testApi.actions.test.force,
})

export default connect(mapStateToProps, mapDispatchToProps)(tickets)
```