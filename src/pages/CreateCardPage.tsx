import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CardForm from '@/components/CardForm/CardForm';
import IDCardPreview from '@/components/IDCard/IDCardPreview';
import { CardFormData, CardFiles, initialFormData } from '@/types/card';
import { cardApi } from '@/lib/api';
import { toast } from 'sonner';

const CreateCardPage = () => {
  const navigate = useNavigate();
  const [previewData, setPreviewData] = useState<CardFormData>(initialFormData);
  const [previews, setPreviews] = useState<{ photo?: string; sign?: string; seal?: string }>({});

  const handleFormChange = (
    data: CardFormData, 
    files: CardFiles, 
    filePreviews: { photo?: string; sign?: string; seal?: string }
  ) => {
    setPreviewData(data);
    setPreviews(filePreviews);
  };

  const handleSubmit = async (data: CardFormData, files: CardFiles) => {
    const formData = new FormData();
    
    // Append all text fields
    Object.entries(data).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    // Append files
    if (files.photo) formData.append('photo', files.photo);
    if (files.seal) formData.append('seal', files.seal);
    if (files.sign) formData.append('sign', files.sign);

    try {
      const result = await cardApi.create(formData);
      toast.success('Card created successfully!');
      navigate(`/card/${result._id || result.id}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create card. Please try again.');
      throw error;
    }
  };

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-foreground">Create New Card</h1>
        <p className="text-muted-foreground mt-1">Fill in the details to generate a new ID card</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="order-2 lg:order-1">
          <CardForm onSubmit={handleSubmit} onFormChange={handleFormChange} />
        </div>

        {/* Live Preview */}
        <div className="order-1 lg:order-2">
          <div className="lg:sticky lg:top-24">
            <h2 className="text-lg font-display font-semibold text-foreground mb-4">Live Preview</h2>
            <div className="bg-muted/30 rounded-xl p-6 border border-border">
              <IDCardPreview 
                data={previewData} 
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
