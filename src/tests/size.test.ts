import { expect, test } from "vitest";
import { getReadableFileSizeString } from "../shared/lib/size";

test("getReadableFileSizeString", () => {
    expect(getReadableFileSizeString(0, false)).toEqual("0.1 KB");
    expect(getReadableFileSizeString(15, false)).toEqual("0.1 KB");
    expect(getReadableFileSizeString(1024, false)).toEqual("1.0 KB");
    expect(getReadableFileSizeString(2400, false)).toEqual("2.3 KB");
    expect(getReadableFileSizeString(9149999, false)).toEqual("8.7 MB");
});

test("getReadableFileSizeStringSI", () => {
    expect(getReadableFileSizeString(0, true)).toEqual("0.1 KiB");
    expect(getReadableFileSizeString(15, true)).toEqual("0.1 KiB");
    expect(getReadableFileSizeString(1024, true)).toEqual("1.0 KiB");
    expect(getReadableFileSizeString(2400, true)).toEqual("2.4 KiB");
    expect(getReadableFileSizeString(9149999, true)).toEqual("9.1 MiB");
});
