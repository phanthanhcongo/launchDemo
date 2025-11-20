import { SearchBar, UserMenu } from "@/components/molecules";
import { cn } from "@/lib/cn";
import { useState } from "react";

export function StatusSummaryBar({
  totalUnits,
  soldUnits,
  heldUnits,
  className
}: {
  totalUnits: number;
  soldUnits: number;
  heldUnits: number;
  className?: string;
}) {

  const availableUnits = totalUnits - soldUnits - heldUnits;
  const soldPercent = Math.round((soldUnits / totalUnits) * 100);
  const [localSearch, setLocalSearch] = useState("");

  return (
    <div
      className={cn(
        "w-full px-4 sm:px-6 lg:px-10 py-3 sm:py-4",
        "bg-gradient-to-r from-[#e8e2db] to-[#f4f0eb]",
        "border-b border-primary/20 shadow-sm",
        "justify-between",
        className
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">

        {/* LEFT SUMMARY */}
        <div className="flex flex-col">
          {/* MAIN TITLE */}
          <div className="text-[34px] sm:text-[40px] md:text-[40px] lg:text-[40px] 
                  font-serif text-[#b4533a] leading-tight">
            {soldUnits} of {totalUnits} Units{" "}
            <span className="italic font-normal text-[#b4533a]">
              Sold
            </span>
          </div>
          {/* SUBTEXT */}
          <div className="mt-1 text-[12px] sm:text-[14px] md:text-[15px] 
                  font-sans tracking-wide uppercase">
            <span className="text-[#b4533a] font-semibold">
              {soldPercent}% Sold
            </span>
            <span className="mx-2 text-black/50">·</span>
            <span className="text-black font-bold">
              {availableUnits} Units Available
            </span>
          </div>
        </div>

        {/* MIDDLE USERS ONLINE */}
        <div className="hidden sm:flex">
          <span
            className="
                px-8 
                py-2.5 
                rounded-full 
                bg-[#b4533a] 
                text-white/95 
                font-serif 
                text-[16px] 
                tracking-wide 
                shadow-[0_4px_12px_rgba(0,0,0,0.2)]
                whitespace-nowrap,
                ml-[85px]
               "
          >
            300 USERS ONLINE
          </span>
        </div>

        {/* RIGHT SEARCH BAR + USER MENU */}
        <div className="flex items-center gap-3">
          <div className="w-full max-w-xs sm:max-w-sm">
            <SearchBar
              value={localSearch}
              onChange={setLocalSearch}
              placeholder="Search by unit code, floor, type..."
              className="w-full bg-white shadow-md rounded-full"
              units={[]}        // nếu component yêu cầu
              onUnitSelect={() => { }} // nếu yêu cầu
            />
          </div>
          <UserMenu />
        </div>
      </div>
    </div>
  );
}
