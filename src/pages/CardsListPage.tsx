import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import CardListItem from '@/components/CardList/CardListItem';
import { CardDataComplete } from '@/types/card';
import { cardApi } from '@/lib/api';
import { toast } from 'sonner';
import { Search, Plus, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const CardsListPage = () => {
  const [cards, setCards] = useState<CardDataComplete[]>([]);
  const [filteredCards, setFilteredCards] = useState<CardDataComplete[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchCards = async () => {
    setIsLoading(true);
    try {
      const data = await cardApi.getAll();
      setCards(data);
      setFilteredCards(data);
    } catch (error: any) {
      toast.error('Failed to fetch cards');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setFilteredCards(cards);
      return;
    }

    try {
      const results = await cardApi.search(searchQuery);
      setFilteredCards(results);
    } catch (error) {
      // Fallback to local search
      const query = searchQuery.toLowerCase();
      setFilteredCards(
        cards.filter(
          (card) =>
            card.employeeName.toLowerCase().includes(query) ||
            card.mobileNumber.includes(query) ||
            card.cardNo.toLowerCase().includes(query) ||
            card.designation.toLowerCase().includes(query)
        )
      );
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await cardApi.delete(deleteId);
      setCards(cards.filter((c) => c._id !== deleteId));
      setFilteredCards(filteredCards.filter((c) => c._id !== deleteId));
      toast.success('Card deleted successfully');
    } catch (error) {
      toast.error('Failed to delete card');
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="container py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">All Cards</h1>
          <p className="text-muted-foreground mt-1">
            {filteredCards.length} {filteredCards.length === 1 ? 'card' : 'cards'} found
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={fetchCards} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
          <Link to="/create">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              New Card
            </Button>
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, mobile, card number..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (!e.target.value.trim()) {
                setFilteredCards(cards);
              }
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="pl-10"
          />
        </div>
        <Button variant="secondary" onClick={handleSearch}>
          Search
        </Button>
      </div>

      {/* Cards List */}
      <div className="space-y-3">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-4 p-4 border rounded-lg">
              <Skeleton className="w-16 h-20 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-64" />
              </div>
            </div>
          ))
        ) : filteredCards.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">No cards found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? 'Try a different search term' : 'Create your first card to get started'}
            </p>
            {!searchQuery && (
              <Link to="/create">
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Create Card
                </Button>
              </Link>
            )}
          </div>
        ) : (
          filteredCards.map((card) => (
            <CardListItem
              key={card._id}
              card={card}
              onDelete={(id) => setDeleteId(id)}
            />
          ))
        )}
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Card?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The card will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CardsListPage;
