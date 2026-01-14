import { forwardRef } from "react";
import { CardDataComplete } from "@/types/card";
import { QRCodeSVG } from "qrcode.react";
import { format } from "date-fns";
import { User } from "lucide-react";

interface IDCardVerticalProps {
  data: CardDataComplete;
  photoUrl?: string;
  signUrl?: string;
  sealUrl?: string;
  cardId?: string;
  forDownload?: boolean; // ✅ NEW
}

const IDCardVertical = forwardRef<HTMLDivElement, IDCardVerticalProps>(
  ({ data, photoUrl, signUrl, sealUrl, cardId, forDownload = false }, ref) => {
    const formatDate = (dateStr?: string) => {
      if (!dateStr) return "";
      try {
        return format(new Date(dateStr), "dd/MM/yyyy");
      } catch {
        return dateStr;
      }
    };

    const baseUrl = window.location.origin;
    const qrData = `${baseUrl}/card/${cardId || data._id || ""}`;

    return (
      <div
        ref={ref}
        className={
          forDownload
            ? "flex flex-col items-center gap-2 bg-white"
            : "bg-white p-4 inline-block"
        }
      >
        {/* FRONT */}
        <div
          className="bg-card-orange rounded-lg overflow-hidden border-2 border-card-border relative"
          style={
            forDownload
              ? { width: "54mm", height: "87mm" }
              : { width: "340px", height: "215px" }
          }
        >
          {/* ON CONTRACT */}
          <div className="absolute left-0 top-0 bottom-0 w-6 bg-card-orange-dark flex items-center justify-center">
            <span
              className="text-black font-bold text-[10px] tracking-wider"
              style={{
                writingMode: "vertical-rl",
                transform: "rotate(180deg)",
              }}
            >
              ON CONTRACT
            </span>
          </div>

          <div className="ml-6 h-full flex flex-col p-3">
            <div className="text-center mb-2">
              <h1 className="text-base font-bold">Entry Pass</h1>
              <p className="text-[9px]">{data.hirer}</p>
            </div>

            <div className="flex flex-1 gap-3">
              <div className="flex flex-col items-center">
                <div className="w-20 h-24 bg-white border-2 overflow-hidden">
                  {photoUrl || data.photo ? (
                    <img
                      src={photoUrl || data.photo}
                      className="w-full h-full object-cover"
                      crossOrigin="anonymous"
                    />
                  ) : (
                    <User className="w-10 h-10 mt-6" />
                  )}
                </div>
                <div className="w-20 h-6 mt-1 bg-white border flex items-center justify-center">
                  {signUrl || data.sign ? (
                    <img
                      src={signUrl || data.sign}
                      className="max-h-full"
                      crossOrigin="anonymous"
                    />
                  ) : (
                    <span className="text-[6px]">Signature</span>
                  )}
                </div>
              </div>

              <div className="flex-1 text-[9px]">
                <p>
                  <b>Name:</b> {data.employeeName}
                </p>
                <p>
                  <b>Designation:</b> {data.designation}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* BACK */}
        <div
          className="bg-card-orange rounded-lg overflow-hidden border-2 border-card-border relative"
          style={
            forDownload
              ? { width: "54mm", height: "87mm" }
              : { width: "340px", height: "215px" }
          }
        >
          <div className="absolute left-0 top-0 bottom-0 w-6 bg-card-orange-dark flex items-center justify-center">
            <span
              className="text-black font-bold text-[10px]"
              style={{
                writingMode: "vertical-rl",
                transform: "rotate(180deg)",
              }}
            >
              ON CONTRACT
            </span>
          </div>

          <div className="ml-6 h-full flex flex-col p-3">
            {/* QR and Blood Group row - using table layout for html2canvas compatibility */}
            <table style={{ width: "100%", marginBottom: "8px", borderCollapse: "collapse" }}>
              <tbody>
                <tr>
                  <td style={{ width: "50%", textAlign: "center", verticalAlign: "middle", padding: "0 4px 0 0" }}>
                    <div style={{ width: "64px", height: "64px", border: "1px solid #000", padding: "2px", display: "inline-block", backgroundColor: "white", lineHeight: 0 }}>
                      <QRCodeSVG value={qrData} size={56} />
                    </div>
                  </td>
                  <td style={{ width: "50%", textAlign: "center", verticalAlign: "middle", padding: "0 0 0 4px" }}>
                    <div style={{ width: "64px", height: "64px", border: "1px solid #000", display: "inline-flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "24px", backgroundColor: "white" }}>
                      {data.bloodGroup}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            <div style={{ border: "1px solid #000", textAlign: "center", fontWeight: 800, padding: "4px 0", marginBottom: "4px", backgroundColor: "white" }}>
              {data.divisionName}
            </div>

            <div style={{ textAlign: "center", fontSize: "18px", fontWeight: 700, marginBottom: "4px" }}>
              {data.mobileNumber}
            </div>

            <div className="text-[8px] mt-auto">
              <p>
                From {formatDate(data.dateOfIssue)} To{" "}
                {formatDate(data.validTill)}
              </p>
              <p className="mt-1 text-[7px]">
                Please surrender to issuing authority on completion of services
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

IDCardVertical.displayName = "IDCardVertical";
export default IDCardVertical;
