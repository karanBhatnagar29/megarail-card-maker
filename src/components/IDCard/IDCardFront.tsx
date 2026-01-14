import { CardDataComplete } from "@/types/card";
import { User } from "lucide-react";

interface IDCardFrontProps {
  data: CardDataComplete;
  photoUrl?: string;
  signUrl?: string;
  sealUrl?: string;
}

const IDCardFront = ({ data, photoUrl }: IDCardFrontProps) => {
  return (
    <div
      className="bg-card-orange rounded-lg overflow-hidden border-2 border-card-border relative"
      style={{ width: "54mm", height: "87mm" }}
    >
      {/* ON CONTRACT – SAME ORANGE with slight black divider */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-card-orange flex items-center justify-center border-r border-black/40">
        <span
          className="text-black font-extrabold text-[18px] tracking-widest"
          style={{
            writingMode: "vertical-lr",
            textOrientation: "upright",
            letterSpacing: "2px",
          }}
        >
          ON CONTRACT
        </span>
      </div>

      {/* Main Content */}
      <div className="ml-8 h-full flex flex-col px-2 py-2 text-card-text font-card">
        {/* Header */}
        <div className="text-center mb-1">
          <h1 className="text-sm font-bold">Entry Pass</h1>
          <p className="text-[10px] font-bold">
            {data.profileName || "Company Name"}
          </p>
          <p className="text-[10px] font-bold">
            ID CARD No. {data.cardNo || "ID"}
          </p>
        </div>

        {/* PHOTO */}
        <div className="flex justify-center mb-2 mt-1">
          <div className="w-[150px] h-[150px] bg-white border-2 border-card-border overflow-hidden">
            {photoUrl || data.photo ? (
              <img
                src={photoUrl || data.photo}
                alt={data.employeeName}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-16 h-16 mx-auto mt-8 text-muted-foreground" />
            )}
          </div>
        </div>

        {/* Manual Name / Designation Box */}
        <div className="flex justify-center mb-2">
          <div className="w-[150px] h-[22px] bg-white border border-card-border"></div>
        </div>

        {/* Employee Name */}
        <div className="text-center mb-5">
          <p className="text-[10px] font-bold uppercase tracking-wide">
            {data.employeeName || "EMPLOYEE NAME"}
          </p>
        </div>

        {/* Bottom Right Signature Text */}
        <div className="absolute bottom-2 right-2 text-right font-bold text-[8px] leading-tight">
          <p>{data.hirer}</p>
          <p>Designation of Issuing Authority</p>
        </div>
      </div>
    </div>
  );
};

export default IDCardFront;
