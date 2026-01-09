import { CardDataComplete } from '@/types/card';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, Trash2, User, Calendar, Building } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

interface CardListItemProps {
  card: CardDataComplete;
  onDelete?: (id: string) => void;
}

const CardListItem = ({ card, onDelete }: CardListItemProps) => {
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    try {
      return format(new Date(dateStr), 'dd MMM yyyy');
    } catch {
      return dateStr;
    }
  };

  const isExpired = card.validTill ? new Date(card.validTill) < new Date() : false;

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 hover:border-primary/20">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Photo */}
          <div className="w-16 h-20 rounded-lg bg-muted border border-border overflow-hidden flex-shrink-0 flex items-center justify-center">
            {card.photo ? (
              <img 
                src={card.photo} 
                alt={card.employeeName} 
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-8 h-8 text-muted-foreground" />
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-foreground truncate">{card.employeeName}</h3>
                <p className="text-sm text-muted-foreground">{card.designation}</p>
              </div>
              <Badge variant={isExpired ? 'destructive' : 'default'} className="flex-shrink-0">
                {isExpired ? 'Expired' : 'Active'}
              </Badge>
            </div>

            <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Building className="w-3 h-3" />
                <span className="truncate">{card.divisionName}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3 h-3" />
                <span>Till {formatDate(card.validTill)}</span>
              </div>
            </div>

            <p className="mt-1 text-xs text-muted-foreground">
              Card: {card.cardNo} | Mobile: {card.mobileNumber}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Link to={`/card/${card._id}`}>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Eye className="w-4 h-4" />
              </Button>
            </Link>
            <Link to={`/edit/${card._id}`}>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Edit className="w-4 h-4" />
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={() => card._id && onDelete?.(card._id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardListItem;
