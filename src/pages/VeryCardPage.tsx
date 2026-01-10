import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CardDataComplete } from "@/types/card";
import { cardApi } from "@/lib/api";
import { toast } from "sonner";
import { format } from "date-fns";

const VerifyCardPage = () => {
  const { id } = useParams<{ id: string }>();
  const [card, setCard] = useState<CardDataComplete | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCard = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await cardApi.viewCard(id);
        setCard(data);
      } catch (err) {
        toast.error("Failed to load card");
      } finally {
        setLoading(false);
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

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center px-4">
        <div className="w-full max-w-xl space-y-4">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-52 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="min-h-screen flex justify-center items-center px-4 text-center">
        <div>
          <h1 className="text-2xl font-bold mb-2">Card Not Found</h1>
          <p className="text-muted-foreground">This card does not exist.</p>
        </div>
      </div>
    );
  }

  const isExpired = card?.validTill
    ? new Date(card.validTill) < new Date()
    : false;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold">Card Verification</h1>
            <p className="text-muted-foreground text-sm">{card.profileName}</p>
          </div>
          <Badge variant={isExpired ? "destructive" : "default"}>
            {isExpired ? "Expired" : "Active"}
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-xl border border-border bg-muted/30">
          <div>
            <p className="text-muted-foreground text-xs">Name</p>
            <p className="font-semibold">{card.employeeName}</p>
          </div>

          <div>
            <p className="text-muted-foreground text-xs">Employee ID</p>
            <p className="font-semibold">{card.cardNo}</p>
          </div>

          <div>
            <p className="text-muted-foreground text-xs">Designation</p>
            <p className="font-semibold">{card.designation}</p>
          </div>

          <div>
            <p className="text-muted-foreground text-xs">Blood Group</p>
            <p className="font-semibold">{card.bloodGroup}</p>
          </div>

          <div>
            <p className="text-muted-foreground text-xs">Mobile Number</p>
            <p className="font-semibold">{card.mobileNumber}</p>
          </div>

          <div>
            <p className="text-muted-foreground text-xs">Aadhaar No.</p>
            <p className="font-semibold">{card.adharCardNumber}</p>
          </div>

          <div>
            <p className="text-muted-foreground text-xs">Division</p>
            <p className="font-semibold">{card.divisionName}</p>
          </div>

          <div>
            <p className="text-muted-foreground text-xs">Hirer</p>
            <p className="font-semibold">{card.hirer}</p>
          </div>

          <div>
            <p className="text-muted-foreground text-xs">Date of Issue</p>
            <p className="font-semibold">{formatDate(card.dateOfIssue)}</p>
          </div>

          <div>
            <p className="text-muted-foreground text-xs">Valid Till</p>
            <p
              className={`font-semibold ${isExpired ? "text-destructive" : ""}`}
            >
              {formatDate(card.validTill)}
            </p>
          </div>

          <div className="sm:col-span-2">
            <p className="text-muted-foreground text-xs">Address</p>
            <p className="font-semibold">{card.address}</p>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          This page is for verification only.
        </p>
      </div>
    </div>
  );
};

export default VerifyCardPage;
