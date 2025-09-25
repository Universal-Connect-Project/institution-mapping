import { describe, expect, it } from "vitest";
import {
  calculateEditDistance,
  calculateNameScore,
  calculateSimilarity,
  normalizeInstitutionName,
} from "./match";

describe("match institutions", () => {
  describe("normalizeInstitutionName", () => {
    it("should normalize institution names", () => {
      const testCases = [
        [" Federal Credit Union Test ", "federal test"],
        ["Test CU", "test"],
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
        ["", "", 0],
      ];

      for (const [str1, str2, expected] of testCases) {
        expect(calculateEditDistance(str1, str2)).toBe(expected);
      }
    });
  });

  describe("calculateSimilarity", () => {
    it("should calculate similarity between two strings", () => {
      const testCases: [string, string, number][] = [
        ["kitten", "sitting", (7 - 3) / 7],
        ["flaw", "lawn", 0.5],
        ["", "", 1.0],
        ["a", "", 0.0],
        ["", "a", 0.0],
        ["abc", "abc", 1.0],
      ];

      for (const [str1, str2, expected] of testCases) {
        expect(calculateSimilarity(str1, str2)).toBeCloseTo(expected);
      }
    });
  });

  describe("calculateNameScore", () => {
    it("returns 1 if the trimmed and lowercased names are identical", () => {
      expect(calculateNameScore("  Bank of America  ", "bank of america")).toBe(
        1.0
      );
    });

    it("returns 0.95 if the normalized names are identical", () => {
      expect(calculateNameScore("Bank of America CU", "Bank of America")).toBe(
        0.95
      );
    });

    it("returns a similarity score if its at least .5", () => {
      const score = calculateNameScore("abcd", "ab");
      expect(score).toBe(0.5);
    });

    it("returns 0 if the similarity score is less than .5", () => {
      const score = calculateNameScore("abc", "b");
      expect(score).toBe(0);
    });

    it("returns .4 if one name starts with the other", () => {
      expect(calculateNameScore("abcdef", "ab")).toBe(0.4);
      expect(calculateNameScore("ab", "abcdef")).toBe(0.4);
    });

    it("decreases score by 0.1 if one name includes 'business' and the other 'personal'", () => {
      expect(
        calculateNameScore(
          "abcdefghijklmnop Personal",
          "abcdefghijklmnop Business"
        )
      ).toBeCloseTo(0.608);

      expect(
        calculateNameScore(
          "abcdefghijklmnop Business",
          "abcdefghijklmnop Personal"
        )
      ).toBeCloseTo(0.608);
    });
  });
});
