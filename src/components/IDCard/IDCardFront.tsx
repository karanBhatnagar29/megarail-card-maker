import { CardDataComplete } from '@/types/card';
import { User } from 'lucide-react';

interface IDCardFrontProps {
  data: CardDataComplete;
  photoUrl?: string;
  signUrl?: string;
}

const IDCardFront = ({ data, photoUrl, signUrl }: IDCardFrontProps) => {
  return (
    <div 
      className="bg-card-orange rounded-lg overflow-hidden shadow-xl border-2 border-card-border relative"
      style={{ width: '320px', height: '200px' }}
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
  );
};

export default IDCardFront;
