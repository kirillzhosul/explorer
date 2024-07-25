import { expect, test } from "vitest";
import { getReadableFileSizeString } from "../shared/lib/size";

test("getReadableFileSizeString", () => {
    expect(getReadableFileSizeString(0)).toEqual("0.1 kB");
    expect(getReadableFileSizeString(15)).toEqual("0.1 kB");
    expect(getReadableFileSizeString(1024)).toEqual("1.0 kB");
    expect(getReadableFileSizeString(2400)).toEqual("2.3 kB");
    expect(getReadableFileSizeString(9149999)).toEqual("8.7 MB");
});
