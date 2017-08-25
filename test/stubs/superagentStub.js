/* eslint-disable no-unused-vars */
const Stream = require('stream');
const { inherits } = require('util');

class Request {
  constructor(method, url) {
    Stream.call(this);
    this.method = method;
  }

  set(key, value) {
    return this;
  }

  type(type) {
    return this;
  }

  query(query) {
    return this;
  }

  responseType() {
    return this;
  }

  send(contents) {
    return this;
  }

  end(callback) {
    callback(null);
    return this;
  }
}

inherits(Request, Stream);

const agent = {
  get(uri) {
    return new Request('GET', uri);
  },
  post(uri) {
    return new Request('POST', uri);
  },
  put(uri) {
    return new Request('PUT', uri);
  },
  head(uri) {
    return new Request('HEAD', uri);
  },
  delete(uri) {
    return new Request('DELETE', uri);
  },
};

module.exports = {
  agent,
  Request,
};
