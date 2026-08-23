import { describe, it, expect } from "vitest";
import { rankStartups, getLeader } from "@/lib/domain/leaderboard";
import { Startup } from "@/lib/domain/types";

describe("rankStartups", () => {
  it("ranks startups by total_bid descending", () => {
    const startups: Startup[] = [
      { id: "1", handle: "@B", total_bid: 10, created_at: "", updated_at: "" },
      { id: "2", handle: "@A", total_bid: 50, created_at: "", updated_at: "" },
    ];

    const ranked = rankStartups(startups);
    expect(ranked[0].handle).toBe("@A");
    expect(ranked[0].rank).toBe(1);
    expect(ranked[1].handle).toBe("@B");
    expect(ranked[1].rank).toBe(2);
  });

  it("breaks ties using earliest updated_at", () => {
    const startups: Startup[] = [
      { id: "1", handle: "@B", total_bid: 50, created_at: "", updated_at: "2026-08-23T01:00:00Z" },
      { id: "2", handle: "@A", total_bid: 50, created_at: "", updated_at: "2026-08-23T00:00:00Z" },
    ];

    const ranked = rankStartups(startups);
    expect(ranked[0].handle).toBe("@A");
    expect(ranked[1].handle).toBe("@B");
  });

  it("getLeader returns top entry", () => {
    const startups: Startup[] = [
      { id: "1", handle: "@A", total_bid: 100, created_at: "", updated_at: "" },
    ];
    const leader = getLeader(startups);
    expect(leader?.handle).toBe("@A");
  });
});
