import { describe, expect, it } from "vitest";
import {
  calculateEditDistance,
  calculateNameScore,
  calculateSimilarity,
  calculateUrlScore,
  extractDomain,
  normalizeInstitutionName,
  normalizeUrl,
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

  describe("normalizeUrl", () => {
    it("should remove http, https, www, and common TLDs", () => {
      const testCases = [
        ["http://www.example.com", "example"],
        ["https://example.net", "example"],
        ["http://example.org", "example"],
        ["www.example.com", "example"],
        ["example.com", "example"],
        ["example.net", "example"],
        ["example.org", "example"],
        ["example", "example"],
      ];

      for (const [input, expected] of testCases) {
        expect(normalizeUrl(input)).toBe(expected);
      }
    });
  });

  describe("extractDomain", () => {
    it("should extract the domain from a normalized URL", () => {
      const testCases = [
        ["http://www.example.com/path", "example"],
        ["https://subdomain.subdomain.example.net/anotherpath", "example"],
        ["http://example.org", "example"],
        ["www.example.com", "example"],
        ["example.com/path", "example"],
        ["example.net", "example"],
        ["example.org/some/page", "example"],
        ["example", "example"],
      ];

      for (const [input, expected] of testCases) {
        expect(extractDomain(normalizeUrl(input))).toBe(expected);
      }
    });
  });

  describe("calculateUrlScore", () => {
    it("returns 1 if the normalized URLs are identical", () => {
      expect(calculateUrlScore("http://www.example.com", "example.com")).toBe(
        1.0
      );
    });

    it("uses a similarity score of the normalized URLs if they are closer than the domains", () => {
      const score = calculateUrlScore(
        "http://subdomain.example.com",
        "subdomainz.example.com"
      );
      expect(score).toBeCloseTo(0.94);
    });

    it("multiplies the similarity score by .9 if the domains are closer than the regular urls", () => {
      const score = calculateUrlScore(
        "http://subdomain.example.com",
        "example.com"
      );
      expect(score).toBe(0.9);
    });

    it("returns 0 if either URL is missing", () => {
      expect(calculateUrlScore("", "example.com")).toBe(0);
      expect(calculateUrlScore("http://example.com", "")).toBe(0);
      expect(calculateUrlScore("", "")).toBe(0);
    });
  });
});
