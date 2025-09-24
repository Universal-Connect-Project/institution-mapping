import { describe, expect, it } from "vitest";
import { calculateEditDistance, normalizeInstitutionName } from "./match";

describe("match institutions", () => {
  describe("normalizeInstitutionName", () => {
    it("should normalize institution names", () => {
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

    it("keeps bank of, in, and for, but not bank", () => {
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

  describe("calculateEditDistance", () => {
    it("should calculate edit distance between two strings", () => {
      const testCases: [string, string, number][] = [
        ["kitten", "sitting", 3],
        ["flaw", "lawn", 2],
        ["intention", "execution", 5],
        ["", "", 0],
        ["a", "", 1],
        ["", "a", 1],
        ["abc", "abc", 0],
      ];

      for (const [str1, str2, expected] of testCases) {
        expect(calculateEditDistance(str1, str2)).toBe(expected);
      }
    });
  });
});
