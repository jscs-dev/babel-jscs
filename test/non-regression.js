var assign  = require("lodash.assign");
var Checker = require("jscs/lib/checker");

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
    throw new Error("Expected " + expectedMessages.length + " message(s), got " + messages.getErrorCount() + " " + JSON.stringify(messages));
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
});
