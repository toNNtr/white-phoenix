import { useId } from "../helpers";
import { expect, test } from "vitest";

test("creates unique IDs", () => {
    const IDs = [];

    for (let i = 0; i < 50000; i++) {
        IDs.push(useId());
    }

    const uniqueIDs = [...new Set(IDs)];

    expect(uniqueIDs.length).toBe(IDs.length);
});
