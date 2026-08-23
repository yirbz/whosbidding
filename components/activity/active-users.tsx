"use client";

import { useActiveUsers } from "@/hooks/use-active-users";

export function ActiveUsersCounter() {
  const { activeCount } = useActiveUsers();
  const count = activeCount || 1;

  return (
    <div className="inline-flex items-center gap-3 px-4 py-2 bg-[#efefef] rounded-[200px] border border-[#e8e8e8]">
      <span className="h-2.5 w-2.5 rounded-full bg-[#ff682c]" />
      <span className="font-polysans text-[20px] text-[#202020] leading-[1.0]">
        {count}
      </span>
      <span className="font-inter text-[14px] text-[#4d4d4d]">
        {count === 1 ? "viewer online" : "viewers online"}
      </span>
    </div>
  );
}
