import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Download,
  Eye,
  Star,
  Heart,
  Share2
} from 'lucide-react';

const BookCard = ({ book, onPreview, onPurchase, className = "" }) => {
  const rating = 4.5; // Fixed rating similar to CourseCard

  const formatPrice = (price) => {
    if (price >= 1000000) return `₹${(price / 1000000).toFixed(1)}M`;
    if (price >= 1000) return `₹${(price / 1000).toFixed(1)}K`;
    return `₹${price}`;
  };

  const getAuthorInitials = () => {
    if (!book.author) return "A";
    const names = book.author.split(" ");
    return names.length > 1
      ? `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase()
      : names[0].charAt(0).toUpperCase();
  };

  // Defensive check: return nothing if book is missing
  if (!book || typeof book !== "object") return null;

  return (
    <div className="flex justify-center">
      <Card className="group w-[250px] md:w-[270px] lg:w-[290px] rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
        <div className="relative">
          <img
            src={book.thumbnailUrl}
            alt={book.title}
            className="w-full h-40 object-cover transform group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = '/api/placeholder/300/200';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Type Badge - positioned like category */}
          {book.type && (
            <span className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-customOrange text-xs font-medium px-2 py-1 rounded-full">
              {book.type}
            </span>
          )}

          {/* Free Badge */}
          {book.isFree && (
            <span className="absolute top-2 left-2 bg-green-500/90 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-full">
              FREE
            </span>
          )}

          {/* Action Buttons - Hover */}
          <div className="absolute top-12 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <button
              className="w-6 h-6 bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm rounded-full flex items-center justify-center"
              onClick={(e) => {
                e.stopPropagation();
                // Handle favorite
              }}
            >
              <Heart className="h-3 w-3" />
            </button>
            <button
              className="w-6 h-6 bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm rounded-full flex items-center justify-center"
              onClick={(e) => {
                e.stopPropagation();
                // Handle share
              }}
            >
              <Share2 className="h-3 w-3" />
            </button>
          </div>

          {/* Author Info - positioned like instructor */}
          <div className="absolute bottom-2 left-2 flex items-center gap-2">
            <Avatar className="w-7 h-7 border-2 border-white">
              <AvatarImage src="" alt={book.author} />
              <AvatarFallback className="text-xs">
                {getAuthorInitials()}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-white font-medium">
              {book.author}
            </span>
          </div>
        </div>

        <CardContent className="p-2">
          <div className="flex justify-between items-start mb-1">
            <h2 className="text-lg font-bold leading-tight line-clamp-2">
              {book.title}
            </h2>
            <p className="text-md font-bold text-customOrange ml-2">
              {book.isFree ? "Free" : formatPrice(book.price)}
            </p>
          </div>

          <p className="text-xs text-brightness-75 mb-1 line-clamp-2">
            {book.description}
          </p>

          <div className="flex items-center gap-1 mb-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={`${i + 0.5 <= rating
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300 stroke-current"
                    }`}
                />
              ))}
            </div>
            <span className="text-xs">{rating}</span>
          </div>

          <div className="flex flex-wrap gap-1 mb-2">
            {book.tags?.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="text-xs font-medium border text-customOrange px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="border-t w-full mb-1"></div>

          <div className="flex gap-1">
            <Button
              className="flex-1 mt-auto font-medium py-1.5 rounded-md transition-colors duration-200"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onPreview?.(book);
              }}
            >
              <Eye className="w-3 h-3 mr-1" />
              Preview
            </Button>
            <Button
              className={`flex-1 mt-auto font-medium py-1.5 rounded-md transition-colors duration-200 ${book.isFree ? 'bg-green-600 hover:bg-green-700 text-white' : ''
                }`}
              variant={book.isFree ? "default" : "outline"}
              onClick={(e) => {
                e.stopPropagation();
                onPurchase?.(book);
              }}
            >
              <Download className="w-3 h-3 mr-1" />
              {book.isFree ? 'Download' : 'Buy Now'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookCard;