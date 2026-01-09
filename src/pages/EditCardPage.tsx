import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import CardForm from '@/components/CardForm/CardForm';
import IDCardPreview from '@/components/IDCard/IDCardPreview';
import { CardFormData, CardFiles, CardDataComplete, initialFormData } from '@/types/card';
import { cardApi } from '@/lib/api';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

const EditCardPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [card, setCard] = useState<CardDataComplete | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [previewData, setPreviewData] = useState<CardFormData>(initialFormData);
  const [previews, setPreviews] = useState<{ photo?: string; sign?: string; seal?: string }>({});

  useEffect(() => {
    const fetchCard = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const data = await cardApi.getById(id);
        setCard(data);
        setPreviewData({
          employeeName: data.employeeName || '',
          fatherName: data.fatherName || '',
          designation: data.designation || '',
          adharCardNumber: data.adharCardNumber || '',
          hirer: data.hirer || '',
          bloodGroup: data.bloodGroup || '',
          policeVerification: data.policeVerification || '',
          dateOfIssue: data.dateOfIssue ? data.dateOfIssue.split('T')[0] : '',
          validTill: data.validTill ? data.validTill.split('T')[0] : '',
          mobileNumber: data.mobileNumber || '',
          address: data.address || '',
          cardNo: data.cardNo || '',
          divisionName: data.divisionName || '',
          profileName: data.profileName || '',
          description: data.description || '',
        });
      } catch (error) {
        toast.error('Failed to load card');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCard();
  }, [id]);

  const handleFormChange = (
    data: CardFormData, 
    files: CardFiles, 
    filePreviews: { photo?: string; sign?: string; seal?: string }
  ) => {
    setPreviewData(data);
    setPreviews(filePreviews);
  };

  const handleSubmit = async (data: CardFormData, files: CardFiles) => {
    if (!id) return;

    const formData = new FormData();
    
    Object.entries(data).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    if (files.photo) formData.append('photo', files.photo);
    if (files.seal) formData.append('seal', files.seal);
    if (files.sign) formData.append('sign', files.sign);

    try {
      await cardApi.update(id, formData);
      toast.success('Card updated successfully!');
      navigate(`/card/${id}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update card');
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <Skeleton className="h-8 w-48 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-32 w-full rounded-lg" />
          </div>
          <div>
            <Skeleton className="h-96 w-full rounded-lg" />
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
      <div className="flex items-center gap-4 mb-8">
        <Link to={`/card/${id}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Edit Card</h1>
          <p className="text-muted-foreground mt-1">Update details for {card.employeeName}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="order-2 lg:order-1">
          <CardForm 
            onSubmit={handleSubmit} 
            onFormChange={handleFormChange}
            initialData={previewData}
            isEditing 
          />
        </div>

        {/* Live Preview */}
        <div className="order-1 lg:order-2">
          <div className="lg:sticky lg:top-24">
            <h2 className="text-lg font-display font-semibold text-foreground mb-4">Live Preview</h2>
            <div className="bg-muted/30 rounded-xl p-6 border border-border">
              <IDCardPreview 
                data={{ ...previewData, photo: card.photo, sign: card.sign, seal: card.seal }}
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

export default EditCardPage;
