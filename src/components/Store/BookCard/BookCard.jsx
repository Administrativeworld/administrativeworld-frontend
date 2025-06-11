import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Download,
  Eye,
  Star,
  Heart,
  Share2,
  Calendar,
  ShoppingCart,
  User,
  Tag,
  DollarSign,
  X,
  Clock,
  Award,
  BookOpen
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { initiateBookPurchase } from '@/configs/captureBookPayment';
import toast from 'react-hot-toast';
import { fetchBooks } from '@/redux/api/booksSlice';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoaderSpinner from '@/components/Loaders/LoaderSpinner';




// Enhanced Modal Component with animations
const Modal = ({ isOpen, onClose, children, size = "default" }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    default: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl"
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      <div className={`relative bg-background rounded-xl shadow-2xl ${sizeClasses[size]} w-full max-h-[95vh] overflow-hidden transform transition-all duration-300 scale-100 opacity-100`}>
        {children}
      </div>
    </div>
  );
};

// Modal Header Component
const ModalHeader = ({ title, onClose, subtitle }) => (
  <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-primary/5 to-primary/10">
    <div>
      <h2 className="text-xl font-bold text-foreground">{title}</h2>
      {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
    </div>
    <Button
      variant="ghost"
      size="sm"
      onClick={onClose}
      className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
    >
      <X className="h-4 w-4" />
    </Button>
  </div>
);

// Modal Content Component
const ModalContent = ({ children, className = "" }) => (
  <div className={`p-6 overflow-y-auto max-h-[calc(95vh-140px)] ${className}`}>
    {children}
  </div>
);

// Modal Footer Component
const ModalFooter = ({ children }) => (
  <div className="flex border-t bg-muted/20">
    {children}
  </div>
);

// Info Item Component for details
const InfoItem = ({ icon: Icon, label, value, badge = false, badgeColor = "default" }) => {
  const badgeColors = {
    default: "bg-secondary text-secondary-foreground",
    success: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
    warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
    info: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
  };

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
      <Icon className="w-4 h-4 text-primary flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <span className="text-sm font-medium text-foreground">{label}:</span>
        {badge ? (
          <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${badgeColors[badgeColor]}`}>
            {value}
          </span>
        ) : (
          <span className="ml-2 text-sm text-muted-foreground">{value}</span>
        )}
      </div>
    </div>
  );
};

const BookCard = ({ book, onPreview, onPurchase, className = "" }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);
  const [showPurchasePopup, setShowPurchasePopup] = useState(false);
  const rating = 4.5;
  const { loggedIn, user } = useSelector((state) => state.authUser);
  const { books, loading, filters, meta } = useSelector((state) => state.books);
  const [downloadLoading, setDownloadLoading] = useState(false)


  const isBought = loggedIn && user && user.materials?.length
    ? user.materials.some((material) => material?._id === book._id)
    : false;
  // Utility Functions
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 day ago";
    if (diffDays < 30) return `${diffDays} days ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  // Event Handlers
  const handleBuyNow = (e) => {
    e.stopPropagation();
    setShowPurchasePopup(true);
  };

  const handleViewDetails = (e) => {
    e.stopPropagation();
    setShowDetailsPopup(true);
  };

  const handleConfirmPurchase = () => {

    if (!loggedIn) {
      navigate("/login")
      return;
    } else {
      setShowPurchasePopup(false);
      onPurchase?.(book);

      let loadingToast;

      try {
        initiateBookPurchase({
          bookId: book._id,
          bookTitle: book.title || "N/A",
          bookPrice: book.price || "N/A",
          userDetails: {
            name: `${user.firstName} ${user.lastName}` || "N/A",
            email: user.email || "N/A",
            phone: user.contactNumber || "N/A"
          },
          onSuccess: (successMessage) => {
            if (loadingToast) toast.dismiss(loadingToast);
            toast.success(successMessage);
            dispatch(fetchBooks(filters));
          },
          onError: (errorMessage) => {
            if (loadingToast) toast.dismiss(loadingToast);
            toast.error(errorMessage);
          },
          onLoading: (isLoading) => {
            if (isLoading) {
              loadingToast = toast.loading('Processing payment...');
            } else {
              if (loadingToast) toast.dismiss(loadingToast);
            }
          }
        });
      } catch (error) {
        console.log(error);
        if (loadingToast) toast.dismiss(loadingToast);
        toast.error('Failed to initiate payment');
      }
    }
  };
  const handleFavorite = (e) => {
    e.stopPropagation();
    // Handle favorite logic
  };

  const handleShare = (e) => {
    e.stopPropagation();
    // Handle share logic
  };
  const handlePurchasedDownload = async (bookId) => {
    try {
      setDownloadLoading(true)
      // Generate download token
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/store/generateStoreDownloadToken`,
        { bookId },
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
        }
      );

      // For axios, check response.status instead of response.ok
      if (response.status < 200 || response.status >= 300) {
        throw new Error(response.data?.message || 'Failed to generate download token');
      }

      console.log("downloadResponse", response.data.downloadUrl);

      // Extract downloadUrl from axios response.data
      const { downloadUrl } = response.data;

      if (!downloadUrl) {
        throw new Error('Download URL not received from server');
      }

      // Trigger download - construct full URL
      const fullDownloadUrl = `${import.meta.env.VITE_BASE_URL}/store/${downloadUrl}`;
      window.location.href = fullDownloadUrl;

      console.log('Download started successfully');

    } catch (error) {
      console.error('Download failed:', error);

      // Better error handling for axios errors
      let errorMessage = 'Download failed. Please try again.';

      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const serverMessage = error.response.data?.message;

        switch (status) {
          case 400:
            errorMessage = serverMessage || 'Invalid request. Please check the book ID.';
            break;
          case 401:
            errorMessage = 'Please log in to download materials.';
            break;
          case 403:
            errorMessage = 'You do not have permission to download this material.';
            break;
          case 404:
            errorMessage = 'The requested material could not be found.';
            break;
          case 500:
            errorMessage = 'Server error. Please try again later.';
            break;
          default:
            errorMessage = serverMessage || `Error ${status}: ${error.message}`;
        }
      } else if (error.request) {
        // Network error
        errorMessage = 'Network error. Please check your connection.';
      } else {
        // Other error
        errorMessage = error.message;
      }

      alert('Download failed: ' + errorMessage);
    } finally {
      setDownloadLoading(false);
    }
  };
  // Defensive check
  if (!book || typeof book !== "object") return null;

  return (
    <>
      <div className="flex justify-center">
        <Card className="group w-[250px] md:w-[270px] lg:w-[290px] rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border">
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

            {/* Type Badge */}
            {book.type && (
              <span className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm text-primary text-xs font-medium px-2 py-1 rounded-full border">
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
                className="w-6 h-6 bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-200"
                onClick={handleFavorite}
              >
                <Heart className="h-3 w-3" />
              </button>
              <button
                className="w-6 h-6 bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-200"
                onClick={handleShare}
              >
                <Share2 className="h-3 w-3" />
              </button>
            </div>

            {/* Author Info */}
            <div className="absolute bottom-2 left-2 flex items-center gap-2">
              <Avatar className="w-7 h-7 border-2 border-white">
                <AvatarImage src="" alt={book.author} />
                <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                  {getAuthorInitials()}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-white font-medium">
                {book.author}
              </span>
            </div>
          </div>

          <CardContent className="p-3">
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-lg font-bold leading-tight line-clamp-2 text-foreground">
                {book.title}
              </h2>
              <p className="text-md font-bold text-primary ml-2 flex-shrink-0">
                {book.isFree ? "Free" : formatPrice(book.price)}
              </p>
            </div>

            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
              {book.description}
            </p>

            <div className="flex items-center gap-1 mb-3">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={`${i + 0.5 <= rating
                      ? "text-yellow-400 fill-current"
                      : "text-muted-foreground/30"
                      }`}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">({rating})</span>
            </div>

            <div className="border-t border-border w-full mb-3"></div>

            <div className="flex flex-col md:flex-row md:space-x-2">
              <Button
                variant="outline"
                className="w-full py-2 mb-2 md:w-1/2 md:mb-0"
                onClick={handleViewDetails}
              >
                <Eye className="w-3 h-3 mr-1" />
                Details
              </Button>

              {isBought ? (
                <Button
                  className="w-full py-2 md:w-1/2 bg-green-400"
                  disabled={downloadLoading}
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePurchasedDownload(book._id);
                  }}
                >
                  <Download className="w-3 h-3 mr-1" />
                  {downloadLoading ? (
                    <>
                      Access <LoaderSpinner />
                    </>
                  ) : (
                    "Access"
                  )}
                </Button>
              ) : (
                <Button
                  className="w-full py-2 md:w-1/2"
                  variant={book.isFree ? "default" : "default"}
                  onClick={handleBuyNow}
                >
                  <ShoppingCart className="w-3 h-3 mr-1" />
                  {book.isFree ? "Get Free" : "Buy Now"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Book Details Modal */}
      <Modal isOpen={showDetailsPopup} onClose={() => setShowDetailsPopup(false)} size="lg">
        <ModalHeader
          title={book.title}
          subtitle={`by ${book.author}`}
          onClose={() => setShowDetailsPopup(false)}
        />

        <ModalContent>
          <div className="space-y-6">
            {/* Book Cover & Quick Info */}
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex justify-center sm:justify-start">
                <div className="relative">
                  <img
                    src={book.thumbnailUrl}
                    alt={book.title}
                    className="w-32 h-40 object-cover rounded-lg shadow-lg border"
                    onError={(e) => {
                      e.target.src = '/api/placeholder/300/200';
                    }}
                  />
                  {book.isFree && (
                    <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      FREE
                    </span>
                  )}
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <div className="space-y-3">
                  <InfoItem icon={User} label="Author" value={book.author} />
                  <InfoItem icon={Tag} label="Type" value={book.type} badge badgeColor="info" />
                  <InfoItem
                    icon={DollarSign}
                    label="Price"
                    value={book.isFree ? "Free" : formatPrice(book.price)}
                    badge
                    badgeColor={book.isFree ? "success" : "default"}
                  />
                  <InfoItem
                    icon={Award}
                    label="Status"
                    value={book.status}
                    badge
                    badgeColor={book.status === 'Published' ? "success" : "warning"}
                  />
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InfoItem
                icon={Calendar}
                label="Published"
                value={formatDate(book.createdAt)}
              />
              <InfoItem
                icon={Clock}
                label="Added"
                value={getRelativeTime(book.createdAt)}
              />
              <InfoItem
                icon={ShoppingCart}
                label="Purchases"
                value={book.purchases || 0}
              />
              <InfoItem
                icon={BookOpen}
                label="Format"
                value={book.pdf_format?.toUpperCase() || "PDF"}
              />
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Description
              </h4>
              <div className="bg-muted/30 rounded-lg p-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {book.description}
                </p>
              </div>
            </div>

            {/* Rating */}
            <div className="bg-muted/30 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">Rating:</span>
                  <div className="flex items-center gap-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={`${i + 0.5 <= rating
                            ? "text-yellow-400 fill-current"
                            : "text-muted-foreground/30"
                            }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">({rating})</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">{rating}</div>
                  <div className="text-xs text-muted-foreground">out of 5</div>
                </div>
              </div>
            </div>
          </div>
        </ModalContent>

        <ModalFooter>
          <Button
            variant="outline"
            onClick={() => setShowDetailsPopup(false)}
            className="flex-1 rounded-none border-none "
          >
            Close
          </Button>
          <Button
            onClick={() => {
              setShowDetailsPopup(false);
              if (!isBought) {
                setShowPurchasePopup(true);
              } else {
                onPurchase?.(book);
              }
            }}
            className="flex-1 rounded-none border-none "
          >
            {isBought ? 'Access Content' : (book.isFree ? 'Get Free' : 'Buy Now')}
          </Button>
        </ModalFooter>
      </Modal>

      {/* Purchase Confirmation Modal */}
      <Modal isOpen={showPurchasePopup} onClose={() => setShowPurchasePopup(false)} size="sm">
        <ModalHeader
          title={book.isFree ? 'Get Free Content' : 'Confirm Purchase'}
          onClose={() => setShowPurchasePopup(false)}
        />

        <ModalContent className="text-center">
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="relative">
                <img
                  src={book.thumbnailUrl}
                  alt={book.title}
                  className="w-24 h-30 object-cover rounded-lg shadow-lg border"
                  onError={(e) => {
                    e.target.src = '/api/placeholder/300/200';
                  }}
                />
                {book.isFree && (
                  <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                    FREE
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">{book.title}</h3>
              <p className="text-sm text-muted-foreground">by {book.author}</p>
              <div className="text-2xl font-bold text-primary">
                {book.isFree ? "Free" : formatPrice(book.price)}
              </div>
            </div>

            <div className="bg-muted/30 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">
                {book.isFree
                  ? "This content is available for free. Click confirm to get instant access."
                  : "You're about to purchase this content. Once confirmed, you'll have immediate access."
                }
              </p>
            </div>
          </div>
        </ModalContent>

        <ModalFooter>
          <Button
            variant="outline"
            onClick={() => setShowPurchasePopup(false)}
            className="flex-1 border-none rounded-none"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmPurchase}
            className="flex-1 border-none rounded-none"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {book.isFree ? 'Get Free' : 'Confirm Purchase'}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default BookCard;