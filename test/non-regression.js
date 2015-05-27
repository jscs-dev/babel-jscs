var assign  = require("lodash.assign");
var Checker = require("jscs/lib/checker");
var util    = require("util");

function verifyAndAssertMessages(code, rules, expectedMessages) {
  var config = {
    esnext: true,
    esprima: require.resolve("..")
  };
  assign(config, rules);

  var checker = new Checker();
  checker.registerDefaultRules();
  checker.configure(config);
  var messages = checker.checkString(code);

  if (messages.getErrorCount() !== expectedMessages.length) {
    throw new Error("Expected " + expectedMessages.length + " message(s), got " + messages.getErrorCount() + " " + util.inspect(messages.getErrorList()));
  }

  messages.getErrorList().forEach(function (message, i) {
    var formatedMessage = message.line + ":" + message.column + " " + message.message + (message.ruleId ? " " + message.ruleId : "");
    if (formatedMessage !== expectedMessages[i]) {
      throw new Error("Message " + i + " does not match:\nExpected: " + expectedMessages[i] + "\nActual:   " + formatedMessage);
    }
  });
}

describe("verify", function () {
  it("Modules support", function () {
    verifyAndAssertMessages(
      "import Foo from 'foo';\n" +
      "export default Foo;",
      {},
      []
    );
  });

  it("flow type", function () {
    verifyAndAssertMessages(
      "type SomeNewType = any;",
      {},
      []
    );
  });

  it("type cast expression", function () {
    verifyAndAssertMessages(
      "for (let a of (a: Array)) {}",
      {},
      []
    );
  });

  it("doesn't error with a true option", function () {
    verifyAndAssertMessages(
      "var a = [1,2,3,];",
      { "requireTrailingComma": true },
      []
    );
  });

  it("does error with a true option", function () {
    verifyAndAssertMessages(
      "var a = [1,2,3];",
      { "requireTrailingComma": true },
      ["1:14 Missing comma before closing  bracket"]
    );
  });

  it("template with destructuring", function () {
    verifyAndAssertMessages([
      "module.exports = {",
        "render() {",
          "var {name} = this.props;",
          "return Math.max(null, `Name: ${name}, Name: ${name}`);",
        "}",
      "};"].join("\n"),
      {},
      []
    );
  });
});
