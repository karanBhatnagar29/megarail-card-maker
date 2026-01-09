import { CardDataComplete } from '@/types/card';
import { QRCodeSVG } from 'qrcode.react';
import { format } from 'date-fns';

interface IDCardBackProps {
  data: CardDataComplete;
  sealUrl?: string;
}

const IDCardBack = ({ data, sealUrl }: IDCardBackProps) => {
  const qrData = JSON.stringify({
    name: data.employeeName,
    designation: data.designation,
    mobile: data.mobileNumber,
    aadhar: data.adharCardNumber,
    cardNo: data.cardNo,
    validTill: data.validTill,
  });

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      return format(new Date(dateStr), 'dd/MM/yyyy');
    } catch {
      return dateStr;
    }
  };

  return (
    <div 
      className="id-card-scaled bg-card-orange rounded-lg overflow-hidden shadow-xl border-2 border-card-border relative"
      style={{ aspectRatio: '87/54' }}
    >
      {/* Vertical ON CONTRACT text - Left side */}
      <div className="absolute left-0 top-0 bottom-0 w-6 bg-card-orange-dark flex items-center justify-center">
        <span 
          className="text-white font-bold text-[10px] tracking-wider"
          style={{ 
            writingMode: 'vertical-rl', 
            textOrientation: 'mixed',
            transform: 'rotate(180deg)',
            letterSpacing: '2px'
          }}
        >
          ON CONTRACT
        </span>
      </div>

      {/* Main content area */}
      <div className="ml-6 h-full flex flex-col p-3">
        {/* Top row - QR and Blood Group */}
        <div className="flex items-start justify-between mb-2">
          <div className="bg-white p-1 rounded">
            <QRCodeSVG value={qrData} size={45} level="L" />
          </div>
          <div className="bg-white px-3 py-1 rounded border border-card-border">
            <span className="text-xl font-bold text-card-text font-card">
              {data.bloodGroup || 'B+'}
            </span>
          </div>
        </div>

        {/* Division Name */}
        <div className="bg-white px-2 py-0.5 rounded border border-card-border text-center mb-1">
          <span className="text-sm font-bold text-card-text font-card">
            {data.divisionName || 'NWR BKN'}
          </span>
        </div>

        {/* Phone Number */}
        <div className="text-center mb-1">
          <span className="text-lg font-bold text-card-text font-card">
            {data.mobileNumber || '9999999999'}
          </span>
        </div>

        {/* Hirer and Validity */}
        <div className="text-[8px] text-card-text font-card space-y-0.5">
          <p>
            <span className="font-semibold">{data.hirer || 'Company Name'}</span>
          </p>
          <p>
            <span className="font-semibold">Validity of Contract:</span>
          </p>
          <p>
            From {formatDate(data.dateOfIssue)} To {formatDate(data.validTill)}
          </p>
        </div>

        {/* Date of Issue and Validity */}
        <div className="text-[8px] text-card-text font-card border-t border-card-border pt-1 mt-1">
          <p><span className="font-semibold">Date of Issue</span></p>
          <p>Validity: 01 year from the date of issue</p>
        </div>

        {/* Instruction */}
        <div className="text-[6px] text-card-text font-card border-t border-card-border pt-1 mt-auto">
          <p className="font-semibold">Instruction</p>
          <p>Please surrender to issuing authority on completion of contractual services</p>
        </div>
      </div>
    </div>
  );
};

export default IDCardBack;
