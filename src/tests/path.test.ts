import { expect, test } from "vitest";
import { getFileExtension, getPathTarget, OsPathStyle, splitPath } from "../shared/lib/path";

test("getFileExtension", () => {
    expect(getFileExtension("file.txt", OsPathStyle.posix)).toEqual("txt");
    expect(getFileExtension("file.txt", OsPathStyle.windows)).toEqual("txt");

    expect(getFileExtension("/home/test/file.txt", OsPathStyle.posix)).toEqual("txt");
    expect(getFileExtension("C:\\home\\test\\file.txt", OsPathStyle.windows)).toEqual("txt");

    expect(getFileExtension("/home/test/file", OsPathStyle.posix)).toEqual("");
    expect(getFileExtension("C:\\home\\test\\file", OsPathStyle.windows)).toEqual("");

    expect(getFileExtension("/home/test", OsPathStyle.posix)).toEqual("");
    expect(getFileExtension("C:\\home\\test", OsPathStyle.windows)).toEqual("");

    expect(getFileExtension("\\", OsPathStyle.windows)).toEqual("");
    expect(getFileExtension("/", OsPathStyle.posix)).toEqual("");
});

test("splitPath", () => {
    expect(splitPath("file.txt", OsPathStyle.posix)).toEqual(["file.txt"]);
    expect(splitPath("file.txt", OsPathStyle.windows)).toEqual(["file.txt"]);

    expect(splitPath("/home/test/file.txt", OsPathStyle.posix)).toEqual(["home", "test", "file.txt"]);
    expect(splitPath("C:\\home\\test\\file.txt", OsPathStyle.windows)).toEqual(["C", "home", "test", "file.txt"]);

    expect(splitPath("/home/test/file", OsPathStyle.posix)).toEqual(["home", "test", "file"]);
    expect(splitPath("C:\\home\\test\\file", OsPathStyle.windows)).toEqual(["C", "home", "test", "file"]);

    expect(splitPath("/home/test", OsPathStyle.posix)).toEqual(["home", "test"]);
    expect(splitPath("C:\\home\\test", OsPathStyle.windows)).toEqual(["C", "home", "test"]);

    expect(splitPath("\\", OsPathStyle.windows)).toEqual([]);
    expect(splitPath("/", OsPathStyle.posix)).toEqual(["/"]);
});


test("getPathTarget", () => {
    expect(getPathTarget("file.txt", OsPathStyle.posix)).toEqual("file.txt");
    expect(getPathTarget("file.txt", OsPathStyle.windows)).toEqual("file.txt");

    expect(getPathTarget("/home/test/file.txt", OsPathStyle.posix)).toEqual("file.txt");
    expect(getPathTarget("C:\\home\\test\\file.txt", OsPathStyle.windows)).toEqual("file.txt");

    expect(getPathTarget("/home/test/file", OsPathStyle.posix)).toEqual("file");
    expect(getPathTarget("C:\\home\\test\\file", OsPathStyle.windows)).toEqual("file");

    expect(getPathTarget("/home/test", OsPathStyle.posix)).toEqual("test");
    expect(getPathTarget("C:\\home\\test", OsPathStyle.windows)).toEqual("test");

    expect(getPathTarget("\\", OsPathStyle.windows)).toEqual("");
    expect(getPathTarget("/", OsPathStyle.posix)).toEqual("/");
});
