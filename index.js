var acornToEsprima = require("acorn-to-esprima");
var parse          = require("babylon").parse;
var t              = require("babel-types");
var tt             = require("babylon").tokTypes;
var traverse       = require("babel-traverse").default;

exports.parse = function (code) {
  var opts = {
    sourceType: "module",
    strictMode: true,
    allowImportExportEverywhere: false, // consistent with espree
    allowReturnOutsideFunction: true,
    allowSuperOutsideMethod: true,
    plugins: [
        "flow",
        "jsx",
        "asyncFunctions",
        "asyncGenerators",
        "classConstructorCall",
        "classProperties",
        "decorators",
        "doExpressions",
        "exponentiationOperator",
        "exportExtensions",
        "functionBind",
        "functionSent",
        "objectRestSpread",
        "trailingFunctionCommas"
    ]
  };

  var ast;
  try {
    ast = parse(code, opts);
  } catch (err) {
    if (err instanceof SyntaxError) {
      err.lineNumber = err.loc.line;
      err.column = err.loc.column;

      // remove trailing "(LINE:COLUMN)" acorn message and add in esprima syntax error message start
      err.message = "Line " + err.lineNumber + ": " + err.message.replace(/ \((\d+):(\d+)\)$/, "");
    }

    throw err;
  }

  // remove EOF token, eslint doesn't use this for anything and it interferes with some rules
  // see https://github.com/babel/babel-eslint/issues/2 for more info
  // todo: find a more elegant way to do this
  ast.tokens.pop();

  // convert tokens
  ast.tokens = acornToEsprima.toTokens(ast.tokens, tt, code);

  // add comments
  acornToEsprima.convertComments(ast.comments);

  // transform esprima and acorn divergent nodes
  acornToEsprima.toAST(ast, traverse, code);

  // ast.program.tokens = ast.tokens;
  // ast.program.comments = ast.comments;
  // ast = ast.program;

  // remove File
  ast.type = 'Program';
  ast.sourceType = ast.program.sourceType;
  ast.directives = ast.program.directives;
  ast.body = ast.program.body;
  delete ast.program;
  delete ast._paths;

  acornToEsprima.attachComments(ast, ast.comments, ast.tokens);

  return ast;
}
