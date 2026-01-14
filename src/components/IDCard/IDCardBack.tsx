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
      data-id-card
      className="bg-card-orange rounded-lg overflow-hidden border-2 border-card-border relative"
      style={{ width: "54mm", height: "87mm" }}
    >
      {/* SIDEBAR STRIP - ON CONTRACT */}
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

      {/* MAIN CONTENT AREA */}
      <div className="ml-8 h-full flex flex-col px-2 py-2 text-card-text font-card">
        {/* TOP ROW — QR & BLOOD GROUP */}
        <div className="flex justify-between gap-1 items-center mb-2">
          {/* ✅ QR CODE (UPDATED: GRID CENTER) */}
          <div
            data-mm-box
            className="w-[20mm] h-[20mm] border border-card-border overflow-hidden relative"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <QRCodeSVG
                value={qrData}
                size={68}
                level="L"
                style={{ display: "block" }}
              />
            </div>
          </div>

          {/* ✅ BLOOD GROUP (GRID CENTER) */}
          <div
            data-mm-box
            className="w-[20mm] h-[20mm] border border-card-border overflow-hidden relative"
          >
            <div
              data-center-overlay
              className="absolute inset-0 flex items-center justify-center"
            >
              <span className="font-extrabold text-[30px] leading-none">
                {data.bloodGroup || "B+"}
              </span>
            </div>
          </div>
        </div>

        {/* ✅ DESIGNATION (GRID CENTER) */}
        <div
          data-designation-box
          className="border border-card-border h-[32px] mb-2 overflow-hidden px-1 relative"
        >
          <div
            data-center-overlay
            className="absolute inset-0 flex items-center justify-center px-1"
          >
            <span className="text-[16px] font-extrabold leading-none whitespace-nowrap">
              {data.designation || "Hirer"}
            </span>
          </div>
        </div>

        {/* MOBILE NUMBER */}
        <div className="text-center text-[18px] font-extrabold mb-2 leading-none">
          {data.mobileNumber || "9999999999"}
        </div>

        {/* COMPANY NAME */}
        <div className="text-[9px] font-semibold mb-1">
          {data.profileName || "Company Name"}
        </div>

        {/* VALIDITY DATES */}
        <div className="text-[8px] leading-tight mb-1">
          <p className="font-bold">Validity of Contract:</p>
          <p className="font-bold uppercase">
            From {formatDate(data.contractValidityDate)} To{" "}
            {formatDate(data.contractExpiryDate)}
          </p>
        </div>

        {/* ISSUE INFO */}
        <div className="text-[8px] leading-tight border-card-border pt-1 mb-auto">
          <p className="font-bold">Date of Issue</p>
          <p className="font-bold">Validity: 01 year from the date of issue</p>
        </div>

        {/* INSTRUCTION — FIXED AT BOTTOM */}
        <div className="text-[7px] leading-tight border-t border-card-border pt-1 text-center mt-auto">
          <p className="font-bold">Instruction</p>
          <p className="font-bold">
            Please surrender to issuing authority on completion of contractual
            services
          </p>
        </div>
      </div>
    </div>
  );
};

export default IDCardBack;
