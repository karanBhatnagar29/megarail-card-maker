import { CardDataComplete } from '@/types/card';
import IDCardFront from './IDCardFront';
import IDCardBack from './IDCardBack';

interface IDCardPreviewProps {
  data: CardDataComplete;
  photoPreview?: string;
  signPreview?: string;
  sealPreview?: string;
  cardId?: string;
}

const IDCardPreview = ({ data, photoPreview, signPreview, sealPreview, cardId }: IDCardPreviewProps) => {
  return (
    <div className="space-y-4 flex flex-col items-center">
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3 text-center">Front Side</h3>
        <IDCardFront 
          data={data} 
          photoUrl={photoPreview || data.photo} 
          signUrl={signPreview || data.sign} 
        />
      </div>
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3 text-center">Back Side</h3>
        <IDCardBack 
          data={data} 
          sealUrl={sealPreview || data.seal}
          cardId={cardId || data._id}
        />
      </div>
    </div>
  );
};

export default IDCardPreview;
