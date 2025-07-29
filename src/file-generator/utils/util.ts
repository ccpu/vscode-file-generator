import * as fs from "fs";
import * as path from "path";
import isWindows = require("is-windows");

export const getDirectoryPath = (filePath: string): string => {
  const splitPath: string[] = filePath.split(path.sep);
  splitPath.pop(); // Remove the file name

  return path.isAbsolute(filePath) && !isWindows()
    ? path.join(path.sep, ...splitPath)
    : path.join(...splitPath);
};

export const isDirectory = (filePath: string): boolean => {
  return fs.lstatSync(filePath).isDirectory();
};

export const isFile = (filePath: string): boolean => {
  return fs.lstatSync(filePath).isFile();
};

export const replaceSourceDir = (
  filePath: string,
  sourceDir: string
): string => {
  if (!sourceDir) {
    return filePath;
  }

  // Create regex pattern to match sourceDir in different positions:
  // - At the beginning: sourceDir/
  // - In the middle: /sourceDir/
  // - At the end: /sourceDir
  const sepEscaped = path.sep === "\\" ? "\\\\" : path.sep;
  const pattern = new RegExp(
    `(^${sourceDir}${sepEscaped}|${sepEscaped}${sourceDir}${sepEscaped}|${sepEscaped}${sourceDir}$)`,
    "g"
  );

  return filePath.replace(pattern, (match) => {
    // If it's at the beginning, replace with empty string
    if (match.startsWith(sourceDir)) {
      return "";
    }
    // If it's in the middle or at the end, replace with single separator
    return path.sep;
  });
};

export function findClosestPackageRoot(filePath: string): string | undefined {
  let dir = path.dirname(filePath);
  while (true) {
    const pkgPath = path.join(dir, "package.json");
    if (fs.existsSync(pkgPath)) {
      return dir;
    }
    const parentDir = path.dirname(dir);
    if (parentDir === dir) break;
    dir = parentDir;
  }
  return undefined;
}
