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
import { renderNodeToPng, downloadDataUrl } from '@/lib/renderToImage';
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

  const renderImage = async () => {
    if (!cardRef.current) return null;
    return renderNodeToPng(cardRef.current, { pixelRatio: 3, backgroundColor: '#ffffff' });
  };

  const downloadAsPNG = async () => {
    setIsDownloading(true);
    try {
      const rendered = await renderImage();
      if (!rendered) throw new Error('Failed to render image');

      downloadDataUrl(rendered.dataUrl, `${data.employeeName || 'ID-Card'}_card.png`);
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
      const rendered = await renderImage();
      if (!rendered) throw new Error('Failed to render image');

      const imgData = rendered.dataUrl;
      
      // Card dimensions in mm (87mm x 54mm per side, vertical layout)
      const cardWidth = 87;
      const cardHeight = 54 * 2 + 10; // Two cards + spacing
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [cardWidth + 20, cardHeight + 20],
      });

      const imgWidth = cardWidth;
      const imgHeight = (rendered.height * imgWidth) / rendered.width;
      
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
