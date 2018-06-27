/* eslint-env mocha */
const assert = require("assert");
const path = require("path");
const {withDir} = require("tempdir-yaml");

describe("resource", () => {
  const {createResourceLoader} = require("inline-js-core/lib/resource");
  const {RESOURCES, PATH_LIKE} = require("..");
  
  const resource = createResourceLoader();
  RESOURCES.forEach(resource.add);
  
  const DEFAULT_OPTIONS = {
    dir:`
      - foo
      - foo.css
      - foo.png
    `
  };
  
  function prepare(baseOptions) {
    return options => {
      options = Object.assign({}, DEFAULT_OPTIONS, baseOptions, options);
      return withDir(options.dir, async resolve => {
        if (PATH_LIKE.has(options.name)) {
          options.args[0] = resolve(options.args[0]);
        }
        const content = await resource.read(null, options);
        if (options.expectType) {
          if (options.expectType === "buffer") {
            assert(Buffer.isBuffer(content));
          } else {
            assert.equal(typeof content, options.expectType);
          }
        }
        if (options.expect) {
          if (Buffer.isBuffer(content)) {
            assert.equal(content.compare(options.expect), 0);
          } else {
            assert.equal(content, options.expect);
          }
        }
      });
    };
  }
  
	it("file", () => {
    const test = prepare({name: "file"});
    return Promise.all([
      test({args: ["foo"], expectType: "string"}),
      test({args: ["foo.css"], expectType: "string"}),
      test({args: ["foo.png"], expectType: "buffer"})
    ]);
	});
	
	it("raw", () => {
    const test = prepare({name: "raw"});
    return Promise.all([
      test({args: ["foo"], expectType: "buffer"}),
      test({args: ["foo.css"], expectType: "buffer"}),
      test({args: ["foo.png"], expectType: "buffer"})
    ]);
	});
	
	it("text", () => {
    const test = prepare({name: "text"});
    return Promise.all([
      test({args: ["foo"], expectType: "string"}),
      test({args: ["foo.css"], expectType: "string"}),
      test({args: ["foo.png"], expectType: "string"})
    ]);
	});
	
	it("cmd", t => {
    t.timeout(5000);
    const command = 'node -e "console.log(1 + 1)"';
    const test = prepare({name: "cmd"});
		return Promise.all([
      test({
        args: [command],
        expectType: "string",
        expect: "2\n"
      }),
      test({
        args: [command, "buffer"],
        expectType: "buffer",
        expect: Buffer.from("2\n")
      }),
      assert.rejects(test({
        args: ["exit 1"]
      }), /Non-zero exit code/)
    ]);
	});
  
  it("resolve two paths", () => {
    const source = {name: "text", args: ["foo/bar.txt"]};
    const target = {name: "file", args: ["baz/bak.txt"]};
    resource.resolve(source, target);
    assert.equal(target.args[0], path.resolve("foo/baz/bak.txt"));
  });
});
