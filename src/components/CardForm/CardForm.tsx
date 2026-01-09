import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CardFormData, CardFiles, BLOOD_GROUPS, DIVISIONS, initialFormData } from '@/types/card';
import { Upload, User, Stamp, PenTool } from 'lucide-react';

interface CardFormProps {
  onSubmit: (data: CardFormData, files: CardFiles) => Promise<void>;
  initialData?: CardFormData;
  isEditing?: boolean;
  onFormChange?: (data: CardFormData, files: CardFiles, previews: { photo?: string; sign?: string; seal?: string }) => void;
}

const CardForm = ({ onSubmit, initialData, isEditing = false, onFormChange }: CardFormProps) => {
  const [formData, setFormData] = useState<CardFormData>(initialData || initialFormData);
  const [files, setFiles] = useState<CardFiles>({ photo: null, seal: null, sign: null });
  const [previews, setPreviews] = useState<{ photo?: string; sign?: string; seal?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateForm = useCallback((updates: Partial<CardFormData>) => {
    const newData = { ...formData, ...updates };
    setFormData(newData);
    onFormChange?.(newData, files, previews);
  }, [formData, files, previews, onFormChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    updateForm({ [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: keyof CardFormData, value: string) => {
    updateForm({ [name]: value });
  };

  const handleFileChange = (type: keyof CardFiles) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newFiles = { ...files, [type]: file };
      setFiles(newFiles);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const newPreviews = { ...previews, [type]: reader.result as string };
        setPreviews(newPreviews);
        onFormChange?.(formData, newFiles, newPreviews);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData, files);
    } finally {
      setIsSubmitting(false);
    }
  };

  const FileUploadButton = ({ 
    type, 
    label, 
    icon: Icon 
  }: { 
    type: keyof CardFiles; 
    label: string; 
    icon: React.ElementType 
  }) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="relative">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange(type)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        <div className="flex items-center gap-3 p-3 border-2 border-dashed border-border rounded-lg hover:border-primary transition-colors bg-muted/30">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center overflow-hidden">
            {previews[type] ? (
              <img src={previews[type]} alt={label} className="w-full h-full object-cover" />
            ) : (
              <Icon className="w-5 h-5 text-primary" />
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">{previews[type] ? 'Change' : 'Upload'} {label}</p>
            <p className="text-xs text-muted-foreground">JPG, PNG up to 5MB</p>
          </div>
          <Upload className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Information */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-display">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="employeeName">Employee Name *</Label>
            <Input
              id="employeeName"
              name="employeeName"
              value={formData.employeeName}
              onChange={handleInputChange}
              placeholder="Enter full name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fatherName">Father's Name *</Label>
            <Input
              id="fatherName"
              name="fatherName"
              value={formData.fatherName}
              onChange={handleInputChange}
              placeholder="Enter father's name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="designation">Designation *</Label>
            <Input
              id="designation"
              name="designation"
              value={formData.designation}
              onChange={handleInputChange}
              placeholder="e.g., Technician, Helper"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bloodGroup">Blood Group *</Label>
            <Select
              value={formData.bloodGroup}
              onValueChange={(value) => handleSelectChange('bloodGroup', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select blood group" />
              </SelectTrigger>
              <SelectContent>
                {BLOOD_GROUPS.map((group) => (
                  <SelectItem key={group} value={group}>
                    {group}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="mobileNumber">Mobile Number *</Label>
            <Input
              id="mobileNumber"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleInputChange}
              placeholder="10-digit mobile number"
              maxLength={10}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="adharCardNumber">Aadhaar Number *</Label>
            <Input
              id="adharCardNumber"
              name="adharCardNumber"
              value={formData.adharCardNumber}
              onChange={handleInputChange}
              placeholder="XXXX-XXXX-XXXX"
              required
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Full address"
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Employment Details */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-display">Employment Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="hirer">Hirer / Company *</Label>
            <Input
              id="hirer"
              name="hirer"
              value={formData.hirer}
              onChange={handleInputChange}
              placeholder="Company or contractor name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="divisionName">Division *</Label>
            <Select
              value={formData.divisionName}
              onValueChange={(value) => handleSelectChange('divisionName', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select division" />
              </SelectTrigger>
              <SelectContent>
                {DIVISIONS.map((division) => (
                  <SelectItem key={division} value={division}>
                    {division}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="cardNo">Card Number *</Label>
            <Input
              id="cardNo"
              name="cardNo"
              value={formData.cardNo}
              onChange={handleInputChange}
              placeholder="e.g., FhR 7145"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="profileName">Profile Name</Label>
            <Input
              id="profileName"
              name="profileName"
              value={formData.profileName}
              onChange={handleInputChange}
              placeholder="Profile category"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="policeVerification">Police Verification</Label>
            <Input
              id="policeVerification"
              name="policeVerification"
              value={formData.policeVerification}
              onChange={handleInputChange}
              placeholder="Verification status"
            />
          </div>
        </CardContent>
      </Card>

      {/* Validity Period */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-display">Validity Period</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dateOfIssue">Date of Issue *</Label>
            <Input
              id="dateOfIssue"
              name="dateOfIssue"
              type="date"
              value={formData.dateOfIssue}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="validTill">Valid Till *</Label>
            <Input
              id="validTill"
              name="validTill"
              type="date"
              value={formData.validTill}
              onChange={handleInputChange}
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* File Uploads */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-display">Documents & Photos</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FileUploadButton type="photo" label="Photo" icon={User} />
          <FileUploadButton type="sign" label="Signature" icon={PenTool} />
          <FileUploadButton type="seal" label="Seal" icon={Stamp} />
        </CardContent>
      </Card>

      {/* Description */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-display">Additional Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Any additional information..."
            rows={3}
          />
        </CardContent>
      </Card>

      <Button 
        type="submit" 
        size="lg" 
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Processing...' : isEditing ? 'Update Card' : 'Create Card'}
      </Button>
    </form>
  );
};

export default CardForm;
