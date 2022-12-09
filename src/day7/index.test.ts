import { Readable } from "stream";
import { createFileSystemObject, FileSystem, printFileSystem } from "./index";
import createReadStreamSafe from "../utils/createReadStreamSafe";

jest.mock("../utils/createReadStreamSafe", () => ({
  __esModule: true,
  default: jest.fn().mockImplementation((filename) => {
    const readable = new Readable();

    switch (filename) {
      case "root":
        readable.push("$ cd /\n");
        readable.push(null);
        return Promise.resolve(readable);
      case "first":
        readable.push("$ cd /\n");
        readable.push("$ ls\n");
        readable.push("dir a\n");
        readable.push("14848514 b.txt\n");
        readable.push("8504156 c.dat\n");
        readable.push("dir d\n");
        readable.push(null);
        return Promise.resolve(readable);
      case "second":
        readable.push("$ cd /\n");
        readable.push("$ ls\n");
        readable.push("dir a\n");
        readable.push("14848514 b.txt\n");
        readable.push("8504156 c.dat\n");
        readable.push("dir d\n");
        readable.push("$ cd a\n");
        readable.push("$ ls\n");
        readable.push("dir e\n");
        readable.push("29116 f\n");
        readable.push("2557 g\n");
        readable.push("62596 h.lst\n");
        readable.push(null);
        return Promise.resolve(readable);

      case "test_input.txt":
        readable.push("$ cd /\n");
        readable.push("$ ls\n");
        readable.push("dir a\n");
        readable.push("14848514 b.txt\n");
        readable.push("8504156 c.dat\n");
        readable.push("dir d\n");
        readable.push("$ cd a\n");
        readable.push("$ ls\n");
        readable.push("dir e\n");
        readable.push("29116 f\n");
        readable.push("2557 g\n");
        readable.push("62596 h.lst\n");
        readable.push("$ cd e\n");
        readable.push("$ ls\n");
        readable.push("584 i\n");
        readable.push("$ cd ..\n"); // a
        readable.push("$ cd ..\n"); // root
        readable.push("$ cd d\n");
        readable.push("$ ls\n");
        readable.push("4060174 j\n");
        readable.push("8033020 d.log\n");
        readable.push("5626152 d.ext\n");
        readable.push("7214296 k\n");
        readable.push(null);
        return Promise.resolve(readable);
      case "real_input":
        readable.push("$ cd /\n");
        readable.push("$ ls\n");
        readable.push("246027 gldg.jrd\n");
        readable.push("dir qffvbf\n");
        readable.push("dir qjjgh\n");
        readable.push("dir vpjqpqfm\n");
        readable.push("$ cd qffvbf\n");
        readable.push("$ ls\n");
        readable.push("dir dcqf\n");
        readable.push("dir grcj\n");
        readable.push("dir hwllqcd\n");
        readable.push("76103 jrhp.hgg\n");
        readable.push("253696 nscv.wvb\n");
        readable.push("dir stnrzs\n");
        readable.push("dir vzgpfd\n");
        readable.push("$ cd dcqf\n");
        readable.push("$ ls\n");
        readable.push("dir gcjmpnsl\n");
        readable.push("$ cd gcjmpnsl\n");
        readable.push("$ ls\n");
        readable.push("198360 gldg.jrd\n");
        readable.push("$ cd ..\n");
        readable.push("$ cd ..\n");
        readable.push("$ cd grcj\n");
        readable.push("$ ls\n");
        readable.push("56512 grgtnhn.zdn\n");
        readable.push("$ cd ..\n");
        readable.push("$ cd hwllqcd\n");
        readable.push("$ ls\n");
        readable.push(null);
        return Promise.resolve(readable);
      default:
        readable.push(null);
        return Promise.resolve(readable);
    }
  }),
}));

describe("index", () => {
  describe("createFileSystemObject", () => {
    it("calls the mocked function", async () => {
      expect.assertions(1);
      // This is what I would eventually like to call
      const res = await createReadStreamSafe("foo.txt");
      expect(createReadStreamSafe).toHaveBeenCalled();
    });

    it.skip("should create file system object with root", async () => {
      expect.assertions(1);
      const result = await createFileSystemObject("root");

      const expected: FileSystem = {
        "/": {
          name: "/",
          parent: null,
        },
      };
      expect(result).toEqual(expected);
    });

    it("should create file system object from first ls output", async () => {
      expect.assertions(1);
      const result = await createFileSystemObject("first");

      const expected: FileSystem = {
        "/": {
          name: "/",
          parent: null,
          children: {
            a: {
              name: "a",
              parent: {
                name: "/",
                parent: null,
              },
            },
            "b.txt": {
              name: "b.txt",
              size: 14848514,
            },
            "c.dat": {
              name: "c.dat",
              size: 8504156,
            },
            d: {
              name: "d",
              parent: {
                name: "/",
                parent: null,
              },
            },
          },
        },
      };
      expect(result).toEqual(expected);
    });

    it("should create file system object from second ls output", async () => {
      expect.assertions(1);
      const result = await createFileSystemObject("second");

      const expected: FileSystem = {
        "/": {
          name: "/",
          parent: null,
          children: {
            a: {
              name: "a",
              parent: {
                name: "/",
                parent: null,
              },
              children: {
                e: {
                  name: "e",
                  parent: {
                    name: "a",
                    parent: expect.objectContaining({ name: "/" }),
                  },
                },
                f: {
                  name: "f",
                  size: 29116,
                },
                g: {
                  name: "g",
                  size: 2557,
                },
                "h.lst": {
                  name: "h.lst",
                  size: 62596,
                },
              },
            },
            "b.txt": {
              name: "b.txt",
              size: 14848514,
            },
            "c.dat": {
              name: "c.dat",
              size: 8504156,
            },
            d: {
              name: "d",
              parent: {
                name: "/",
                parent: null,
              },
            },
          },
        },
      };
      expect(result).toEqual(expected);
    });

    it("should create file system object from mocked test_input", async () => {
      expect.assertions(1);
      const result = await createFileSystemObject("test_input.txt");

      const expected: FileSystem = {
        "/": {
          name: "/",
          parent: null,
          children: {
            a: {
              name: "a",
              parent: {
                name: "/",
                parent: null,
              },
              children: {
                e: {
                  name: "e",
                  parent: {
                    name: "a",
                    parent: expect.objectContaining({ name: "/" }),
                  },
                  children: {
                    i: {
                      name: "i",
                      size: 584,
                    },
                  },
                },
                f: {
                  name: "f",
                  size: 29116,
                },
                g: {
                  name: "g",
                  size: 2557,
                },
                "h.lst": {
                  name: "h.lst",
                  size: 62596,
                },
              },
            },
            "b.txt": {
              name: "b.txt",
              size: 14848514,
            },
            "c.dat": {
              name: "c.dat",
              size: 8504156,
            },
            d: {
              name: "d",
              parent: {
                name: "/",
                parent: null,
              },
              children: {
                j: {
                  name: "j",
                  size: 4060174,
                },
                "d.log": {
                  name: "d.log",
                  size: 8033020,
                },
                "d.ext": {
                  name: "d.ext",
                  size: 5626152,
                },
                k: {
                  name: "k",
                  size: 7214296,
                },
              },
            },
          },
        },
      };
      expect(result).toEqual(expected);
    });

    it.only("should create file system object from mocked real_input", async () => {
      expect.assertions(1);
      const result = await createFileSystemObject("real_input");

      const expected: FileSystem = {
        "/": {
          name: "/",
          parent: null,
          children: {
            "gldg.jrd": {
              name: "gldg.jrd",
              size: 246027,
            },
            qffvbf: {
              name: "qffvbf",
              parent: expect.objectContaining({ name: "/" }),
              children: {
                dcqf: {
                  name: "dcqf",
                  parent: expect.objectContaining({ name: "qffvbf" }),
                  children: {
                    gcjmpnsl: {
                      name: "gcjmpnsl",
                      parent: expect.objectContaining({ name: "dcqf" }),
                      children: {
                        "gldg.jrd": {
                          name: "gldg.jrd",
                          size: 198360,
                        },
                      },
                    },
                  },
                },
                grcj: {
                  name: "grcj",
                  parent: expect.objectContaining({ name: "qffvbf" }),
                  children: {
                    "grgtnhn.zdn": {
                      name: "grgtnhn.zdn",
                      size: 56512,
                    },
                  },
                },
                hwllqcd: {
                  name: "hwllqcd",
                  parent: expect.objectContaining({ name: "qffvbf" }),
                },
                "jrhp.hgg": {
                  name: "jrhp.hgg",
                  size: 76103,
                },
                "nscv.wvb": {
                  name: "nscv.wvb",
                  size: 253696,
                },
                stnrzs: {
                  name: "stnrzs",
                  parent: expect.objectContaining({ name: "qffvbf" }),
                },
                vzgpfd: {
                  name: "vzgpfd",
                  parent: expect.objectContaining({ name: "qffvbf" }),
                },
              },
            },
            qjjgh: {
              name: "qjjgh",
              parent: {
                name: "/",
                parent: null,
              },
            },
            vpjqpqfm: {
              name: "vpjqpqfm",
              parent: {
                name: "/",
                parent: null,
              },
            },
          },
        },
      };
      expect(result).toEqual(expected);
    });

    describe.skip("with actual test input", () => {
      beforeAll(() => {
        jest.resetAllMocks();
        jest.requireActual("../utils/createReadStreamSafe");
        jest.restoreAllMocks();
        jest.resetModules();
      });

      it("should create file system object from test input", async () => {
        expect.assertions(1);

        const result = await createFileSystemObject(
          "./src/day7/input_test.txt"
        );

        expect(result).toEqual({
          "/": {
            a: {
              e: {
                i: {
                  name: "i",
                  size: 584,
                },
              },
              f: {
                name: "f",
                size: 29116,
              },
              g: {
                name: "g",
                size: 2557,
              },
              "h.lst": {
                name: "h.lst",
                size: 62596,
              },
            },
            "b.txt": {
              name: "b.txt",
              size: 14848514,
            },
            "c.dat": {
              name: "c.dat",
              size: 8504156,
            },
            d: {
              j: {
                name: "j",
                size: 4060174,
              },
              "d.log": {
                name: "d.log",
                size: 8033020,
              },
              "d.ext": {
                name: "d.ext",
                size: 5626152,
              },
              k: {
                name: "k",
                size: 7214296,
              },
            },
          },
        });
      });
    });
  });

  describe("printFileSystem", () => {
    it("should pretty print output", () => {
      expect.assertions(0);
      const expected: FileSystem = {
        "/": {
          name: "/",
          parent: null,
          children: {
            a: {
              name: "a",
              parent: {
                name: "/",
                parent: null,
              },
              children: {
                e: {
                  name: "e",
                  parent: {
                    name: "a",
                    parent: expect.objectContaining({ name: "/" }),
                  },
                  children: {
                    i: {
                      name: "i",
                      size: 584,
                    },
                  },
                },
                f: {
                  name: "f",
                  size: 29116,
                },
                g: {
                  name: "g",
                  size: 2557,
                },
                "h.lst": {
                  name: "h.lst",
                  size: 62596,
                },
              },
            },
            "b.txt": {
              name: "b.txt",
              size: 14848514,
            },
            "c.dat": {
              name: "c.dat",
              size: 8504156,
            },
            d: {
              name: "d",
              parent: {
                name: "/",
                parent: null,
              },
              children: {
                j: {
                  name: "j",
                  size: 4060174,
                },
                "d.log": {
                  name: "d.log",
                  size: 8033020,
                },
                "d.ext": {
                  name: "d.ext",
                  size: 5626152,
                },
                k: {
                  name: "k",
                  size: 7214296,
                },
              },
            },
          },
        },
      };
      printFileSystem(expected);
    });
  });
});
