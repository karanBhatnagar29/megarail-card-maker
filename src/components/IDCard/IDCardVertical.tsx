import { forwardRef } from 'react';
import { CardDataComplete } from '@/types/card';
import { QRCodeSVG } from 'qrcode.react';
import { format } from 'date-fns';
import { User } from 'lucide-react';

interface IDCardVerticalProps {
  data: CardDataComplete;
  photoUrl?: string;
  signUrl?: string;
  sealUrl?: string;
  cardId?: string;
}

const IDCardVertical = forwardRef<HTMLDivElement, IDCardVerticalProps>(
  ({ data, photoUrl, signUrl, sealUrl, cardId }, ref) => {
    const formatDate = (dateStr: string) => {
      if (!dateStr) return '';
      try {
        return format(new Date(dateStr), 'dd/MM/yyyy');
      } catch {
        return dateStr;
      }
    };

    // QR data points to card view page
    const baseUrl = window.location.origin;
    const qrData = `${baseUrl}/card/${cardId || data._id || ''}`;

    return (
      <div 
        ref={ref}
        className="bg-white p-4 inline-block"
        style={{ width: '340px' }}
      >
        {/* Front Side */}
        <div 
          className="bg-card-orange rounded-lg overflow-hidden border-2 border-card-border relative mb-4"
          style={{ height: '215px' }}
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
            {/* Header */}
            <div className="text-center mb-2">
              <h1 className="text-base font-bold text-card-text font-card">Entry Pass</h1>
              <p className="text-[9px] text-card-text font-card">{data.hirer || 'Company Name'}</p>
            </div>

            {/* Photo and Details Row */}
            <div className="flex flex-1 gap-3">
              {/* Photo Section */}
              <div className="flex flex-col items-center">
                <div className="w-20 h-24 bg-white border-2 border-card-border rounded overflow-hidden flex items-center justify-center">
                  {photoUrl || data.photo ? (
                    <img 
                      src={photoUrl || data.photo} 
                      alt={data.employeeName} 
                      className="w-full h-full object-cover"
                      crossOrigin="anonymous"
                    />
                  ) : (
                    <User className="w-10 h-10 text-muted-foreground" />
                  )}
                </div>
                {/* Signature area */}
                <div className="w-20 h-6 mt-1 bg-white border border-card-border rounded flex items-center justify-center overflow-hidden">
                  {signUrl || data.sign ? (
                    <img 
                      src={signUrl || data.sign} 
                      alt="Signature" 
                      className="max-w-full max-h-full object-contain"
                      crossOrigin="anonymous"
                    />
                  ) : (
                    <span className="text-[6px] text-muted-foreground">Signature</span>
                  )}
                </div>
              </div>

              {/* Details Section */}
              <div className="flex-1 flex flex-col justify-between text-card-text font-card">
                <div>
                  <p className="text-[9px]">
                    <span className="font-semibold">Name: </span>
                    {data.employeeName || 'Employee Name'}
                  </p>
                  <p className="text-[9px]">
                    <span className="font-semibold">F/Name: </span>
                    {data.fatherName || "Father's Name"}
                  </p>
                  <p className="text-[9px]">
                    <span className="font-semibold">Designation: </span>
                    {data.designation || 'Designation'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[7px] italic">(Signature)</p>
                  <p className="text-[7px]">Designation of Issuing Authority</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back Side */}
        <div 
          className="bg-card-orange rounded-lg overflow-hidden border-2 border-card-border relative"
          style={{ height: '215px' }}
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
      </div>
    );
  }
);

IDCardVertical.displayName = 'IDCardVertical';

export default IDCardVertical;
