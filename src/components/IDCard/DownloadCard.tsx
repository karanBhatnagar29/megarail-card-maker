import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Download, FileImage, FileText, Loader2 } from 'lucide-react';
import { CardDataComplete } from '@/types/card';
import IDCardVertical from './IDCardVertical';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from 'sonner';

interface DownloadCardProps {
  data: CardDataComplete;
  photoUrl?: string;
  signUrl?: string;
  sealUrl?: string;
  cardId?: string;
}

const DownloadCard = ({ data, photoUrl, signUrl, sealUrl, cardId }: DownloadCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const generateCanvas = async () => {
    if (!cardRef.current) return null;
    
    return html2canvas(cardRef.current, {
      scale: 3,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
    });
  };

  const downloadAsPNG = async () => {
    setIsDownloading(true);
    try {
      const canvas = await generateCanvas();
      if (!canvas) throw new Error('Failed to generate canvas');

      const link = document.createElement('a');
      link.download = `${data.employeeName || 'ID-Card'}_card.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast.success('Card downloaded as PNG');
    } catch (error) {
      toast.error('Failed to download card');
      console.error(error);
    } finally {
      setIsDownloading(false);
    }
  };

  const downloadAsPDF = async () => {
    setIsDownloading(true);
    try {
      const canvas = await generateCanvas();
      if (!canvas) throw new Error('Failed to generate canvas');

      const imgData = canvas.toDataURL('image/png');
      
      // Card dimensions in mm (87mm x 54mm per side, vertical layout)
      const cardWidth = 87;
      const cardHeight = 54 * 2 + 10; // Two cards + spacing
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [cardWidth + 20, cardHeight + 20],
      });

      const imgWidth = cardWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      pdf.save(`${data.employeeName || 'ID-Card'}_card.pdf`);
      toast.success('Card downloaded as PDF');
    } catch (error) {
      toast.error('Failed to download card');
      console.error(error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      {/* Hidden card for rendering */}
      <div className="fixed -left-[9999px] top-0">
        <IDCardVertical
          ref={cardRef}
          data={data}
          photoUrl={photoUrl}
          signUrl={signUrl}
          sealUrl={sealUrl}
          cardId={cardId}
        />
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="gap-2" disabled={isDownloading}>
            {isDownloading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            Download
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={downloadAsPNG} className="gap-2 cursor-pointer">
            <FileImage className="w-4 h-4" />
            Download as PNG
          </DropdownMenuItem>
          <DropdownMenuItem onClick={downloadAsPDF} className="gap-2 cursor-pointer">
            <FileText className="w-4 h-4" />
            Download as PDF
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default DownloadCard;
