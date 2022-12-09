import { createLineProcessor, REAL_INPUT, TEST_INPUT } from "../utils";

async function calculateDirectorySize(filename = REAL_INPUT) {
  await createFileSystemObject(filename);
}

type FileSystem = Record<Directory["name"], FileSystemNode>;

type File = {
  name: string;
  size: number;
  parent?: Directory;
};

type Directory = {
  name: string;
  parent: Directory | null;
  children?: FileSystem;
};

type FileSystemNode = File | Directory;

type ListCommand = [cmd: "ls"];
type ChangeDirectoryCommand = [cmd: "cd", dir: string];

type FileI = [size: number, name: string];

type DirectoryI = [prefix: "dir", name: string];

type Command<T extends string[]> = [prefix: "$", ...rest: T];

function isFileInput(input: unknown[]): input is FileI {
  return Number(input[0]) >= 0;
}

function isDirectoryInput(input: unknown): input is DirectoryI {
  return (input as DirectoryI)[0] === "dir";
}

function isCommandInput(
  input: unknown
): input is Command<ListCommand | ChangeDirectoryCommand> {
  return (input as Command<ListCommand | ChangeDirectoryCommand>)[0] === "$";
}

async function createFileSystemObject(filename: string) {
  const processor = await createLineProcessor(filename);

  const ROOT: Directory = {
    name: "/",
    parent: null,
  };

  let currentDirectory: Directory = ROOT;
  let fileSystem: FileSystem = {
    "/": ROOT,
  };

  // let node: typeof fileSystem = {};
  console.log("FS", fileSystem);

  function callback(line: string | string[]) {
    if (typeof line !== "string") {
      throw new Error("oops");
    }

    // console.log("line", line);
    const input = line.split(" ");

    if (isFileInput(input)) {
      const [size, name] = input;
      console.log("isFile", name);
      // node[name] = {
      //   name,
      //   size,
      // };

      // if (
      //   (fileSystem[currentDirectory.name] as Directory).children === undefined
      // ) {
      //   (fileSystem[currentDirectory.name] as Directory).children = {
      //     [name]: {
      //       name,
      //       size: Number(size),
      //     },
      //   };
      // } else {
      //   (fileSystem[currentDirectory.name] as Directory).children = {
      //     ...(fileSystem[currentDirectory.name] as Directory).children,
      //     [name]: {
      //       name,
      //       size: Number(size),
      //     },
      //   };
      // }

      if (currentDirectory.parent === null) {
        if (
          (fileSystem[currentDirectory.name] as Directory).children ===
          undefined
        ) {
          console.log("file currentDir.parent === null without children");
          (fileSystem[currentDirectory.name] as Directory).children = {
            [name]: {
              name,
              size: Number(size),
            },
          };
        } else {
          console.log("file currentDir.parent === null with children");

          (fileSystem[currentDirectory.name] as Directory).children = {
            ...(fileSystem[currentDirectory.name] as Directory).children,
            [name]: {
              name,
              size: Number(size),
            },
          };
        }
      } else if (
        (
          currentDirectory.parent?.children &&
          (currentDirectory.parent?.children[
            currentDirectory.name
          ] as Directory)
        )?.children === undefined
      ) {
        console.log("isFile current no children", currentDirectory);
        // console.log("HERE 1.1", currentDirectory.parent);
        // console.log("HERE 1.2", currentDirectory.parent.children);

        currentDirectory.children = {
          ...currentDirectory.children,
          [name]: {
            name,
            size: Number(size),
          },
        };

        // currentDirectory.parent.children  &&
        //  (currentDirectory.parent.children[currentDirectory.name] as Directory).children = currentDirectory.children;

        // (currentDirectory.parent.children[
        //       currentDirectory.name
        //     ] as Directory))!.children

        console.log('foo', currentDirectory.children);
        
        (currentDirectory.children && currentDirectory.parent &&
          currentDirectory.parent.children &&
          (currentDirectory.parent.children[
            currentDirectory.name
          ] as Directory))!.children = {
          ...currentDirectory.children,
        };

        // console.log("HERE 1.3", currentDirectory);
      } else {
        console.log("isFile current has children", currentDirectory);
        const dir =
          currentDirectory.parent?.children &&
          currentDirectory.parent?.children[currentDirectory.name];
        // console.log("HERE 2.1, dir", dir);
        const children = (dir as Directory).children || {};
        console.log("isFile current 2, children", children);

        (currentDirectory.parent?.children &&
          (currentDirectory.parent?.children[
            currentDirectory.name
          ] as Directory))!.children = {
          ...children,
          [name]: {
            name,
            size: Number(size),
          },
        };
      }
      console.log("current Dir after add file", currentDirectory);

      console.log("FS after add file", fileSystem);

      // fileSystem[currentDirectory.name] = {
      //   ...fileSystem[currentDirectory.name],
      //   [name]: {
      //     name,
      //     size: Number(size),
      //   },
      // };
    } else if (isDirectoryInput(input)) {
      const [, name] = input;
      console.log("isDirectory", name);
      console.log("currentDirectory", currentDirectory);
      // console.log("currentDirectory.children", currentDirectory.children);

      if (currentDirectory.parent === null) {
        if (
          (fileSystem[currentDirectory.name] as Directory).children ===
          undefined
        ) {
          console.log("isDirectory current.parent === null without children");
          (fileSystem[currentDirectory.name] as Directory).children = {
            [name]: {
              name,
              parent: {
                name: currentDirectory.name,
                parent: currentDirectory.parent,
              },
              // children: currentDirectory.children
            },
          };
        } else {
          console.log("isDirectory current.parent === null with children");

          (fileSystem[currentDirectory.name] as Directory).children = {
            ...(fileSystem[currentDirectory.name] as Directory).children,
            [name]: {
              name,
              parent: {
                name: currentDirectory.name,
                parent: currentDirectory.parent,
              },
              // children: currentDirectory.children
            },
          };
        }
      } else if (
        (
          currentDirectory.parent?.children &&
          (currentDirectory.parent?.children[
            currentDirectory.name
          ] as Directory)
        )?.children === undefined
      ) {
        console.log("isDirectory current with no children", currentDirectory);
        currentDirectory.children = {
          ...currentDirectory.children,
          [name]: {
            name,
            parent: {
              name: currentDirectory.name,
              parent: currentDirectory.parent,
            },
            // children: currentDirectory.children

          },
        };
        // console.log("isDirectory 1.1", currentDirectory);
      } else {
        console.log("isDirectory current with children");
        const dir =
          currentDirectory.parent?.children &&
          currentDirectory.parent?.children[currentDirectory.name];
        const children = (dir as Directory).children || {};
        console.log("isDirectory current 2, children", children);


        // (currentDirectory.parent?.children &&
        //   (currentDirectory.parent?.children[
        //     currentDirectory.name
        //   ] as Directory))!.children = {
        //   ...children,
        //   [name]: {
        //     name,
        //     parent: {
        //       name: currentDirectory.name,
        //       parent: currentDirectory.parent,
        //     },
        //   },
        // };
        (currentDirectory.parent?.children &&
          (currentDirectory.parent?.children[
            currentDirectory.name
          ] as Directory))!.children = {
          ...children,
          [name]: {
            name,
            parent: {
              name: currentDirectory.name,
              parent: currentDirectory.parent,
            },
            // children: currentDirectory.children

          },
        };
      }
      console.log("current Dir after add directory", currentDirectory);
      console.log("FS after add directory", fileSystem);
    } else if (isCommandInput(input)) {
      if (input[1] === "cd") {
        const [, , dir] = input;
        console.log(`is CD command ${dir}, current: ${currentDirectory.name}`);
        if (dir === "..") {
          console.log("change dir parent, curr: ", currentDirectory);
          currentDirectory = currentDirectory.parent || ROOT; // should not be null
          console.log("new curr:", currentDirectory);
        } else if (dir === ROOT["name"]) {
          currentDirectory = ROOT;
        } else {
          // console.log(`fileSystem[${currentDirectory.name}]`, fileSystem[currentDirectory.name]);
          currentDirectory = {
            name: dir,
            parent: currentDirectory,
          }; // have to check if dir exists?
          //   if (dir in fileSystem[currentDirectory.name]) {
          //     console.log("here");
          //   }
        }
      } else {
        // fileSystem[currentDirectory.name] = node[0];
        console.log("is List Command", input);
        // node = {};
      }
    }
  }

  try {
    await processor({
      callback: (line) => callback(line),
      //   startLine: 2,
    });
    console.log("FS", fileSystem);

    console.log("current dir", currentDirectory);
    printFileSystem(fileSystem);
    return fileSystem;
  } catch (error) {
    console.error("error", error);
  }
}

function printFileSystem(
  fileSystem: Awaited<ReturnType<typeof createFileSystemObject>>
) {
  if (!fileSystem) {
    throw Error("can not print if file system is undefined :(");
  }
  let done = false;
  let level = 0;
  console.log("fs", fileSystem);
// @ts-ignore
  console.log('bar', fileSystem['/'].children['qffvbf'].children['dcqf'].children);
  
  let root = fileSystem["/"] as Directory;
  console.log("ROOT", root);
  let children = [...Object.values(root.children!)];
  // console.log("fs", fileSystem);
  console.log(`${root.name}\n`);
  while (!done) {
    level++;
    const nextLevel: FileSystemNode[] = [];
    children.forEach((child) => {
      console.log(
        "-".repeat(level) + `${child.name} > ${child.parent?.name}\n`
      );
      if ((child as Directory).children !== undefined) {
        nextLevel.push(...Object.values((child as Directory).children || {}));
      }
    });
    children = nextLevel;

    if (children.length === 0) {
      done = true;
    }
  }
}

(async function run() {
  if (process.env.NODE_ENV === "test") return;

  await calculateDirectorySize();
})();

// for tests
export { createFileSystemObject, FileSystem, printFileSystem };
