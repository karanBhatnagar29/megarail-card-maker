import { CardDataComplete } from "@/types/card";
import { QRCodeSVG } from "qrcode.react";
import { format } from "date-fns";

interface IDCardBackProps {
  data: CardDataComplete;
  cardId?: string;
  sealUrl?: string;
}

const IDCardBack = ({ data, cardId }: IDCardBackProps) => {
  const qrData = `https://megarail.vercel.app/verify/${
    cardId || data._id || ""
  }`;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      return format(new Date(dateStr), "dd/MM/yyyy");
    } catch {
      return dateStr;
    }
  };

  return (
    <div
      className="bg-card-orange rounded-lg overflow-hidden border-2 border-card-border relative"
      style={{ width: "54mm", height: "87mm" }}
    >
      {/* ON CONTRACT STRIP — SAME ORANGE with divider */}
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

      {/* MAIN CONTENT */}
      <div className="ml-8 h-full flex flex-col px-2 py-2 text-card-text font-card">
        {/* TOP ROW — QR & BLOOD */}
        <div className="flex justify-between gap-1 items-center mb-2">
          {/* QR CODE */}
          <div className="w-[20mm] h-[20mm] border border-card-border p-0.25 flex items-center justify-center bg-white">
            <QRCodeSVG value={qrData} size={72} level="L" />
          </div>

          {/* BLOOD GROUP */}
          <div className="w-[20mm] h-[20mm] border border-card-border flex items-center justify-center font-extrabold text-[30px] bg-white">
            {data.bloodGroup || "B+"}
          </div>
        </div>

        {/* DIVISION / DEPARTMENT */}
        <div className="border border-card-border text-center text-[16px] font-extrabold py-2 mb-2 bg-white">
          {data.designation || "Hirer"}
        </div>

        {/* MOBILE NUMBER */}
        <div className="text-center text-[18px] font-extrabold mb-2">
          {data.mobileNumber || "9999999999"}
        </div>

        {/* COMPANY NAME */}
        <div className="text-[9px] font-semibold mb-1">
          {data.profileName || "Company Name"}
        </div>

        {/* VALIDITY */}
        <div className="text-[8px] leading-tight mb-1">
          <p className="font-semibold">Validity of Contract:</p>
          <p>
            From {formatDate(data.contractValidityDate)} To{" "}
            {formatDate(data.contractExpiryDate)}
          </p>
        </div>

        {/* ISSUE INFO */}
        <div className="text-[8px] leading-tight border-t border-card-border pt-1 mb-auto">
          <p className="font-semibold">Date of Issue</p>
          <p>Validity: 01 year from the date of issue</p>
        </div>

        {/* INSTRUCTION — BOTTOM */}
        <div className="text-[7px] leading-tight border-t border-card-border pt-1 text-center">
          <p className="font-bold">Instruction</p>
          <p>
            Please surrender to issuing authority on completion of contractual
            services
          </p>
        </div>
      </div>
    </div>
  );
};

export default IDCardBack;
