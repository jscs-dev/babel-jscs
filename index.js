var acornToEsprima = require("./acorn-to-esprima");
var parse          = require("babel-core").parse;

exports.parse = function (code, mode) {
  var opts = {
    locations: true,
    ranges: true,
    strictMode: !mode || mode === "strict"
  };

  var comments = opts.onComment = [];
  var tokens = opts.onToken = [];

  var ast;
  try {
    ast = parse(code, opts);
  } catch (err) {
    if (err instanceof SyntaxError) {
      err.lineNumber = err.loc.line;
      err.column = err.loc.column;

      // remove trailing "(LINE:COLUMN)" acorn message and add in esprima syntax error message start
      err.message = "Line X: " + err.message.replace(/ \((\d+):(\d+)\)$/, "");
    }

    throw err;
  }

  // remove EOF token, eslint doesn't use this for anything and it interferes with some rules
  // see https://github.com/babel/babel-eslint/issues/2 for more info
  // todo: find a more elegant way to do this
  tokens.pop();

  // convert tokens
  ast.tokens = acornToEsprima.toTokens(tokens, code);

  // add comments
  ast.comments = comments;

  // transform esprima and acorn divergent nodes
  acornToEsprima.toAST(ast);

  return ast;
};
