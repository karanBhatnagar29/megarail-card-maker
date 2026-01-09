import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import IDCardPreview from '@/components/IDCard/IDCardPreview';
import IDCardVertical from '@/components/IDCard/IDCardVertical';
import { CardDataComplete } from '@/types/card';
import { cardApi } from '@/lib/api';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { 
  ArrowLeft, 
  Edit, 
  Download,
  FileImage,
  FileText,
  Loader2
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const CardViewPage = () => {
  const { id } = useParams<{ id: string }>();
  const [card, setCard] = useState<CardDataComplete | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const isAuthenticated = !!localStorage.getItem('mega-rail-token');

  useEffect(() => {
    const fetchCard = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const data = await cardApi.viewCard(id);
        setCard(data);
      } catch (error) {
        toast.error('Failed to load card');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCard();
  }, [id]);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    try {
      return format(new Date(dateStr), 'dd/MM/yyyy');
    } catch {
      return dateStr;
    }
  };

  const isExpired = card?.validTill ? new Date(card.validTill) < new Date() : false;

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
      link.download = `${card?.employeeName || 'ID-Card'}_card.png`;
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
      
      const cardWidth = 87;
      const cardHeight = 54 * 2 + 10;
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [cardWidth + 20, cardHeight + 20],
      });

      const imgWidth = cardWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      pdf.save(`${card?.employeeName || 'ID-Card'}_card.pdf`);
      toast.success('Card downloaded as PDF');
    } catch (error) {
      toast.error('Failed to download card');
      console.error(error);
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <Skeleton className="h-8 w-48 mb-8" />
        <div className="max-w-md mx-auto space-y-4">
          <Skeleton className="h-64 w-full rounded-lg" />
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-display font-bold mb-4">Card Not Found</h1>
        <p className="text-muted-foreground mb-6">The card you are looking for does not exist.</p>
        <Link to="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Hidden card for download */}
      <div className="fixed -left-[9999px] top-0">
        <IDCardVertical
          ref={cardRef}
          data={card}
          cardId={id}
        />
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          {isAuthenticated && (
            <Link to="/cards">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
          )}
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-display font-bold text-foreground">
                {card.employeeName}
              </h1>
              <Badge variant={isExpired ? 'destructive' : 'default'}>
                {isExpired ? 'Expired' : 'Active'}
              </Badge>
            </div>
            <p className="text-muted-foreground">{card.designation}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isAuthenticated && (
            <Link to={`/edit/${card._id}`}>
              <Button variant="outline" className="gap-2">
                <Edit className="w-4 h-4" />
                Edit Card
              </Button>
            </Link>
          )}
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
        </div>
      </div>

      {/* Card Preview - Only showing card details as per PDF requirement */}
      <div className="max-w-md mx-auto">
        <div className="bg-muted/30 rounded-xl p-6 border border-border">
          <IDCardPreview data={card} cardId={id} />
        </div>

        {/* Essential Details - Only what appears on the card */}
        <div className="mt-8 space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg border border-border">
            <div>
              <p className="text-muted-foreground">Name</p>
              <p className="font-medium">{card.employeeName}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Father Name</p>
              <p className="font-medium">{card.fatherName}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Designation</p>
              <p className="font-medium">{card.designation}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Blood Group</p>
              <p className="font-medium">{card.bloodGroup}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Mobile Number</p>
              <p className="font-medium">{card.mobileNumber}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Division</p>
              <p className="font-medium">{card.divisionName}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Hirer</p>
              <p className="font-medium">{card.hirer}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Card No</p>
              <p className="font-medium">{card.cardNo}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Valid From</p>
              <p className="font-medium">{formatDate(card.dateOfIssue)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Valid Till</p>
              <p className={`font-medium ${isExpired ? 'text-destructive' : ''}`}>
                {formatDate(card.validTill)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardViewPage;
