import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import IDCardPreview from '@/components/IDCard/IDCardPreview';
import { CardDataComplete } from '@/types/card';
import { cardApi } from '@/lib/api';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { 
  ArrowLeft, 
  Edit, 
  Download, 
  User, 
  Phone, 
  MapPin, 
  Calendar,
  Building,
  CreditCard,
  Droplet
} from 'lucide-react';

const CardViewPage = () => {
  const { id } = useParams<{ id: string }>();
  const [card, setCard] = useState<CardDataComplete | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
      return format(new Date(dateStr), 'dd MMMM yyyy');
    } catch {
      return dateStr;
    }
  };

  const isExpired = card?.validTill ? new Date(card.validTill) < new Date() : false;

  if (isLoading) {
    return (
      <div className="container py-8">
        <Skeleton className="h-8 w-48 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <Skeleton className="h-64 w-full rounded-lg" />
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-32 w-full rounded-lg" />
            <Skeleton className="h-48 w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-display font-bold mb-4">Card Not Found</h1>
        <p className="text-muted-foreground mb-6">The card you're looking for doesn't exist.</p>
        <Link to="/cards">
          <Button>Back to Cards</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Link to="/cards">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
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
          <Link to={`/edit/${card._id}`}>
            <Button variant="outline" className="gap-2">
              <Edit className="w-4 h-4" />
              Edit Card
            </Button>
          </Link>
          <Button className="gap-2">
            <Download className="w-4 h-4" />
            Download
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Card Preview */}
        <div>
          <h2 className="text-lg font-display font-semibold mb-4">ID Card Preview</h2>
          <div className="bg-muted/30 rounded-xl p-6 border border-border">
            <IDCardPreview data={card} />
          </div>
        </div>

        {/* Details */}
        <div className="space-y-6">
          {/* Personal Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-display flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Full Name</p>
                <p className="font-medium">{card.employeeName}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Father's Name</p>
                <p className="font-medium">{card.fatherName}</p>
              </div>
              <div className="flex items-start gap-2">
                <Droplet className="w-4 h-4 text-destructive mt-0.5" />
                <div>
                  <p className="text-muted-foreground">Blood Group</p>
                  <p className="font-medium">{card.bloodGroup}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-primary mt-0.5" />
                <div>
                  <p className="text-muted-foreground">Mobile</p>
                  <p className="font-medium">{card.mobileNumber}</p>
                </div>
              </div>
              <div className="col-span-2 flex items-start gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-muted-foreground">Address</p>
                  <p className="font-medium">{card.address || '-'}</p>
                </div>
              </div>
              <div className="col-span-2">
                <p className="text-muted-foreground">Aadhaar Number</p>
                <p className="font-medium font-mono">{card.adharCardNumber}</p>
              </div>
            </CardContent>
          </Card>

          {/* Employment Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-display flex items-center gap-2">
                <Building className="w-5 h-5 text-primary" />
                Employment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Designation</p>
                <p className="font-medium">{card.designation}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Division</p>
                <p className="font-medium">{card.divisionName}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Hirer</p>
                <p className="font-medium">{card.hirer}</p>
              </div>
              <div className="flex items-start gap-2">
                <CreditCard className="w-4 h-4 text-primary mt-0.5" />
                <div>
                  <p className="text-muted-foreground">Card Number</p>
                  <p className="font-medium">{card.cardNo}</p>
                </div>
              </div>
              <div>
                <p className="text-muted-foreground">Police Verification</p>
                <p className="font-medium">{card.policeVerification || '-'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Profile</p>
                <p className="font-medium">{card.profileName || '-'}</p>
              </div>
            </CardContent>
          </Card>

          {/* Validity */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-display flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Validity Period
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Date of Issue</p>
                <p className="font-medium">{formatDate(card.dateOfIssue)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Valid Till</p>
                <p className={`font-medium ${isExpired ? 'text-destructive' : ''}`}>
                  {formatDate(card.validTill)}
                </p>
              </div>
            </CardContent>
          </Card>

          {card.description && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-display">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{card.description}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardViewPage;
