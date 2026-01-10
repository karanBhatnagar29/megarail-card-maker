import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import CardForm from "@/components/CardForm/CardForm";
import IDCardPreview from "@/components/IDCard/IDCardPreview";
import IDCardVertical from "@/components/IDCard/IDCardVertical";

import { CardFormData, CardFiles, initialFormData } from "@/types/card";
import { cardApi } from "@/lib/api";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Download, FileImage, FileText, Loader2 } from "lucide-react";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const CreateCardPage = () => {
  const navigate = useNavigate();

  const [previewData, setPreviewData] = useState<CardFormData>(initialFormData);

  const [previews, setPreviews] = useState<{
    photo?: string;
    sign?: string;
    seal?: string;
  }>({});

  const [isDownloading, setIsDownloading] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);

  // 🔹 Live form change → preview sync
  const handleFormChange = (
    data: CardFormData,
    files: CardFiles,
    filePreviews: { photo?: string; sign?: string; seal?: string }
  ) => {
    setPreviewData(data);
    setPreviews(filePreviews);
  };

  // 🔹 Submit card
  const handleSubmit = async (data: CardFormData, files: CardFiles) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    if (files.photo) formData.append("photo", files.photo);
    if (files.sign) formData.append("sign", files.sign);
    if (files.seal) formData.append("seal", files.seal);

    try {
      const result = await cardApi.create(formData);
      toast.success("Card created successfully!");
      navigate(`/card/${result._id || result.id}`);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Failed to create card. Please try again."
      );
      throw error;
    }
  };

  // 🔹 Canvas generator
  const generateCanvas = async () => {
    if (!cardRef.current) return null;

    return html2canvas(cardRef.current, {
      scale: 3,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      logging: false,
    });
  };

  // 🔹 Download PNG
  const downloadAsPNG = async () => {
    setIsDownloading(true);
    try {
      const canvas = await generateCanvas();
      if (!canvas) throw new Error("Failed to generate canvas");

      const link = document.createElement("a");
      link.download = `${previewData.employeeName || "ID-Card"}_card.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();

      toast.success("Card downloaded as PNG");
    } catch (error) {
      toast.error("Failed to download card");
      console.error(error);
    } finally {
      setIsDownloading(false);
    }
  };

  // 🔹 Download PDF
  const downloadAsPDF = async () => {
    setIsDownloading(true);
    try {
      const canvas = await generateCanvas();
      if (!canvas) throw new Error("Failed to generate canvas");

      const imgData = canvas.toDataURL("image/png");

      const cardWidth = 87;
      const imgWidth = cardWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [cardWidth + 20, imgHeight + 20],
      });

      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
      pdf.save(`${previewData.employeeName || "ID-Card"}_card.pdf`);

      toast.success("Card downloaded as PDF");
    } catch (error) {
      toast.error("Failed to download card");
      console.error(error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="container py-8">
      {/* Hidden printable card */}
      <div className="fixed -left-[9999px] top-0">
        <IDCardVertical
          ref={cardRef}
          data={previewData as any}
          photoUrl={previews.photo}
          signUrl={previews.sign}
          sealUrl={previews.seal}
        />
      </div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Create New Card</h1>
          <p className="text-muted-foreground mt-1">
            Fill in the details to generate a new ID card
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="gap-2"
              disabled={isDownloading}
            >
              {isDownloading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              Download Preview
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={downloadAsPNG}>
              <FileImage className="w-4 h-4 mr-2" />
              Download as PNG
            </DropdownMenuItem>
            <DropdownMenuItem onClick={downloadAsPDF}>
              <FileText className="w-4 h-4 mr-2" />
              Download as PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="order-2 lg:order-1">
          <CardForm onSubmit={handleSubmit} onFormChange={handleFormChange} />
        </div>

        <div className="order-1 lg:order-2">
          <div className="lg:sticky lg:top-24">
            <h2 className="text-lg font-semibold mb-4">Live Preview</h2>
            <div className="bg-muted/30 rounded-xl p-6 border">
              <IDCardPreview
                data={previewData as any}
                photoPreview={previews.photo}
                signPreview={previews.sign}
                sealPreview={previews.seal}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCardPage;
