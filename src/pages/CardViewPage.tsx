import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import IDCardPreview from "@/components/IDCard/IDCardPreview";
import IDCardVertical from "@/components/IDCard/IDCardVertical";
import { CardDataComplete } from "@/types/card";
import { cardApi } from "@/lib/api";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  ArrowLeft,
  Edit,
  Download,
  FileImage,
  FileText,
  Loader2,
} from "lucide-react";
import { renderNodeToPng, downloadDataUrl } from "@/lib/renderToImage";
import jsPDF from "jspdf";
import IDCardFront from "@/components/IDCard/IDCardFront";
import IDCardBack from "@/components/IDCard/IDCardBack";

const CardViewPage = () => {
  const { id } = useParams<{ id: string }>();
  const [card, setCard] = useState<CardDataComplete | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const isAuthenticated = !!localStorage.getItem("mega-rail-token");

  useEffect(() => {
    const fetchCard = async () => {
      if (!id) return;

      setIsLoading(true);
      try {
        const data = await cardApi.viewCard(id);
        setCard(data);
      } catch (error) {
        toast.error("Failed to load card");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCard();
  }, [id]);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    try {
      return format(new Date(dateStr), "dd/MM/yyyy");
    } catch {
      return dateStr;
    }
  };

  const isExpired = card?.validTill
    ? new Date(card.validTill) < new Date()
    : false;

  const renderImage = async () => {
    if (!cardRef.current) return null;

    return renderNodeToPng(cardRef.current, { pixelRatio: 3, backgroundColor: "#ffffff" });
  };

  const downloadAsPNG = async () => {
    setIsDownloading(true);
    try {
      const rendered = await renderImage();
      if (!rendered) throw new Error("Failed to render image");

      downloadDataUrl(rendered.dataUrl, `${card?.employeeName || "ID-Card"}_card.png`);
      toast.success("Card downloaded as PNG");
    } catch (error) {
      toast.error("Failed to download card");
      console.error(error);
    } finally {
      setIsDownloading(false);
    }
  };

  const downloadAsPDF = async () => {
    setIsDownloading(true);
    try {
      const rendered = await renderImage();
      if (!rendered) throw new Error("Failed to render image");

      const imgData = rendered.dataUrl;

      // ✅ Dynamic PDF size based on canvas aspect ratio
      const pdfWidth = 54; // mm (standard card width)
      const pdfHeight = (rendered.height * pdfWidth) / rendered.width;

      const pdf = new jsPDF({
        orientation: pdfHeight > pdfWidth ? "portrait" : "landscape",
        unit: "mm",
        format: [pdfWidth, pdfHeight],
      });

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${card?.employeeName || "ID-Card"}_card.pdf`);

      toast.success("Downloaded exactly as preview ✅");
    } catch (error) {
      toast.error("Failed to download card");
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
        <p className="text-muted-foreground mb-6">
          The card you are looking for does not exist.
        </p>
        <Link to="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Hidden card for download */}
      {/* <div className="fixed -left-[9999px] top-0">
        <IDCardVertical
          ref={cardRef}
          data={card}
          cardId={id}
          forDownload={true}
        />
      </div> */}

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
              <Badge variant={isExpired ? "destructive" : "default"}>
                {isExpired ? "Expired" : "Active"}
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
              <DropdownMenuItem
                onClick={downloadAsPNG}
                className="gap-2 cursor-pointer"
              >
                <FileImage className="w-4 h-4" />
                Download as PNG
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={downloadAsPDF}
                className="gap-2 cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                Download as PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Card Preview - Only showing card details as per PDF requirement */}
      <div className="max-w-md mx-auto">
        <div
          ref={cardRef}
          className="flex flex-col items-center gap-6 bg-white py-8 px-4"
        >
          <IDCardFront
            data={card}
            photoUrl={card.photo}
            signUrl={card.sign}
            sealUrl={card.seal}
          />
          <IDCardBack data={card} cardId={id} />
        </div>

        {/* Essential Details - Only what appears on the card */}
        {/* Essential Details - Only what appears on the card */}
        <div className="mt-8 space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg border border-border">
            {/* 1️⃣ Name */}
            <div>
              <p className="text-muted-foreground">Name</p>
              <p className="text-[18px]">{card.employeeName}</p>
            </div>

            {/* 2️⃣ Aadhaar */}
            <div>
              <p className="text-muted-foreground">Aadhaar No.</p>
              <p className="font-medium">{card.adharCardNumber}</p>
            </div>

            {/* 3️⃣ Address */}
            <div>
              <p className="text-muted-foreground">Address</p>
              <p className="font-medium">{card.address}</p>
            </div>

            {/* 4️⃣ Date of Issue */}
            <div>
              <p className="text-muted-foreground">Date of Issue</p>
              <p className="font-medium">{formatDate(card.dateOfIssue)}</p>
            </div>

            {/* 5️⃣ Valid Till */}
            <div>
              <p className="text-muted-foreground">Valid Till</p>
              <p
                className={`font-medium ${isExpired ? "text-destructive" : ""}`}
              >
                {formatDate(card.validTill)}
              </p>
            </div>

            {/* 6️⃣ Police Verification */}
            <div>
              <p className="text-muted-foreground">Police Verification</p>
              <p className="font-medium">{card.policeVerification}</p>
            </div>

            {/* 7️⃣ Agency Name */}
            <div>
              <p className="text-muted-foreground">Agency Name</p>
              <p className="font-medium">{card.profileName}</p>
            </div>

            {/* 8️⃣ Issuing Authority (Division + Hirer) */}
            <div>
              <p className="text-muted-foreground">Issuing Authority</p>
              <p className="font-medium whitespace-pre-line">
                {card.divisionName || "-"}
                {"\n"}
                {card.hirer || "-"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardViewPage;
