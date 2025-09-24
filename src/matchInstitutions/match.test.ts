import { describe, expect, it } from "vitest";
import { normalizeInstitutionName } from "./match";

describe("match institutions", () => {
  describe("normalizeInstitutionName", () => {
    it("should normalize institution names", () => {
      // federal credit union|fcu|credit union|cu|national bank|state bank|community bank|savings bank|trust company|corp|corporation|inc|llc
      const testCases = [
        [" Federal Credit Union Test ", "test"],
        ["Test FCU", "test"],
        ["Test Credit Union", "test"],
        ["Test CU", "test"],
        ["Test National Bank", "test"],
        ["Test State Bank", "test"],
        ["Test Community Bank", "test"],
        ["Test Savings Bank", "test"],
        ["Test Trust Company", "test"],
        ["Test Corp", "test"],
        ["Test Corporation", "test"],
        ["Test INC", "test"],
        ["Test LLC", "test"],
      ];

      for (const [input, expected] of testCases) {
        expect(normalizeInstitutionName(input)).toBe(expected);
      }
    });

    it("keeps bank of, in, and for", () => {
      const testCases = [
        ["Bank of America", "bank of america"],
        ["Bank for Savings", "bank for savings"],
        ["Bank in the City", "bank in the city"],
        ["Test Bank", "test"],
      ];

      for (const [input, expected] of testCases) {
        expect(normalizeInstitutionName(input)).toBe(expected);
      }
    });
  });
});
