import { Response } from 'express';

export function createWriteHead(prevWriteHead: Function, listener: Function) {
  var fired = false;

  // return function with core name and argument list
  return function writeHead() {
    // set headers from arguments
    var args = setWriteHeadHeaders.apply(this, arguments);
    // fire listener
    if (!fired) {
      fired = true;
      listener.call(this);

      // pass-along an updated status code
      if (typeof args[0] === 'number' && this.statusCode !== args[0]) {
        args[0] = this.statusCode;
        args.length = 1;
      }
    }
    return prevWriteHead.apply(this, args);
  };
}

function setWriteHeadHeaders(statusCode: number) {
  var length = arguments.length;
  var headerIndex = length > 1 && typeof arguments[1] === 'string' ? 2 : 1;

  var headers = length >= headerIndex + 1 ? arguments[headerIndex] : undefined;

  this.statusCode = statusCode;

  if (Array.isArray(headers)) {
    // handle array case
    setHeadersFromArray(this, headers);
  } else if (headers) {
    // handle object case
    setHeadersFromObject(this, headers);
  }

  var args = new Array(Math.min(length, headerIndex));

  for (var i = 0; i < args.length; i++) {
    args[i] = arguments[i];
  }

  return args;
}

function setHeadersFromArray(res: Response, headers: { [key: string]: any }[]) {
  for (var i = 0; i < headers.length; i++) {
    res.setHeader(headers[i][0], headers[i][1]);
  }
}

function setHeadersFromObject(res: Response, headers: { [key: string]: any }) {
  var keys = Object.keys(headers);
  for (var i = 0; i < keys.length; i++) {
    var k = keys[i];
    if (k) res.setHeader(k, headers[k]);
  }
}
