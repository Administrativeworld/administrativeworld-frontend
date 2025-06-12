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
  BookOpen,
  Package,
  Layers,
  TrendingUp
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBookCombos } from '@/redux/api/fetchBookComboSlice';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { initiateBookPurchase } from '@/configs/captureBookPayment';

// Modal Components (reused from BookCard)
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

const ModalContent = ({ children, className = "" }) => (
  <div className={`p-6 overflow-y-auto max-h-[calc(95vh-140px)] ${className}`}>
    {children}
  </div>
);

const ModalFooter = ({ children }) => (
  <div className="flex border-t bg-muted/20">
    {children}
  </div>
);

const InfoItem = ({ icon: Icon, label, value, badge = false, badgeColor = "default" }) => {
  const badgeColors = {
    default: "bg-secondary text-secondary-foreground",
    success: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
    warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
    info: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
    combo: "bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-900 dark:from-yellow-500 dark:to-yellow-700 dark:text-yellow-100"
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

// Single Combo Card Component
const ComboCard = ({ combo, onPreview, onPurchase, className = "" }) => {
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);
  const [showPurchasePopup, setShowPurchasePopup] = useState(false);
  const rating = 4.7; // Combo rating (higher than individual books)
  const { loggedIn, user } = useSelector((state) => state.authUser);

  // Utility Functions
  const formatPrice = (price) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };


  const calculateSavings = () => {
    const originalTotal = combo.comboPrice;
    const finalPrice = combo.finalPrice;
    const savings = originalTotal - finalPrice;
    const percentage = Math.round((savings / originalTotal) * 100);
    return { savings, percentage };
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
    if (!loggedIn) {
      navigate("/login")
      return;
    } else {
      setShowPurchasePopup(false);
      onPurchase?.(combo);

      let loadingToast;

      try {
        initiateBookPurchase({
          comboId: combo._id,
          bookTitle: combo.title || "N/A",
          bookPrice: combo.finalPrice || "N/A",
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

  const handleViewDetails = (e) => {
    e.stopPropagation();
    setShowDetailsPopup(true);
  };

  const handleConfirmPurchase = (e) => {

    e.stopPropagation();
    setShowPurchasePopup(true);
    if (!loggedIn) {
      navigate("/login")
      return;
    } else {
      setShowPurchasePopup(false);
      onPurchase?.(combo);

      let loadingToast;

      try {
        initiateBookPurchase({
          comboId: combo._id,
          bookTitle: combo.title || "N/A",
          bookPrice: combo.finalPrice || "N/A",
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

  const { savings, percentage } = calculateSavings();

  return (
    <>
      <div className="flex justify-center">
        <Card className="group w-[250px] md:w-[270px] lg:w-[290px] rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border-2 border-yellow-200/50 hover:border-yellow-300/70">
          <div className="relative">
            <img
              src={combo.thumbnailUrl}
              alt={combo.comboTitle}
              className="w-full h-40 object-cover transform group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.target.src = '/api/placeholder/300/200';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

            {/* Golden Combo Badge */}
            <span className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full shadow-lg border border-yellow-300">
              COMBO
            </span>

            {/* Savings Badge */}
            {savings > 0 && (
              <span className="absolute top-2 left-2 bg-green-500/90 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-full">
                Save {percentage}%
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

            {/* Materials Count */}
            <div className="absolute bottom-2 left-2 flex items-center gap-2">
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                <Package className="w-3 h-3 text-white" />
                <span className="text-xs text-white font-medium">
                  {combo.includedMaterials?.length || 0} items
                </span>
              </div>
            </div>

            {/* Trending Badge */}
            <div className="absolute bottom-2 right-2">
              <TrendingUp className="w-4 h-4 text-yellow-400" />
            </div>
          </div>

          <CardContent className="p-3">
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-lg font-bold leading-tight line-clamp-2 text-foreground">
                {combo.comboTitle}
              </h2>
              <div className="ml-2 flex-shrink-0 text-right">
                {savings > 0 && (
                  <p className="text-xs text-muted-foreground line-through">
                    {formatPrice(combo.comboPrice)}
                  </p>
                )}
                <p className="text-md font-bold text-primary">
                  {combo.isFree ? "Free" : formatPrice(combo.finalPrice)}
                </p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
              {combo.comboDescription}
            </p>

            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1">
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

              {savings > 0 && (
                <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 px-2 py-1 rounded-full text-xs font-medium">
                  Save ₹{savings}
                </div>
              )}
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

              <Button
                className="w-full py-2 md:w-1/2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white"
                onClick={handleBuyNow}
              >
                <ShoppingCart className="w-3 h-3 mr-1" />
                {combo.isFree ? "Get Combo" : "Buy Combo"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Combo Details Modal */}
      <Modal isOpen={showDetailsPopup} onClose={() => setShowDetailsPopup(false)} size="xl">
        <ModalHeader
          title={combo.comboTitle}
          subtitle={`${combo.includedMaterials?.length || 0} materials included`}
          onClose={() => setShowDetailsPopup(false)}
        />

        <ModalContent>
          <div className="space-y-6">
            {/* Combo Cover & Quick Info */}
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex justify-center sm:justify-start">
                <div className="relative">
                  <img
                    src={combo.thumbnailUrl}
                    alt={combo.comboTitle}
                    className="w-32 h-40 object-cover rounded-lg shadow-lg border-2 border-yellow-200"
                    onError={(e) => {
                      e.target.src = '/api/placeholder/300/200';
                    }}
                  />
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
                    COMBO
                  </span>
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <div className="space-y-3">
                  <InfoItem
                    icon={Package}
                    label="Items Included"
                    value={combo.includedMaterials?.length || 0}
                    badge
                    badgeColor="combo"
                  />
                  <InfoItem
                    icon={DollarSign}
                    label="Original Price"
                    value={formatPrice(combo.comboPrice)}
                  />
                  <InfoItem
                    icon={TrendingUp}
                    label="Final Price"
                    value={formatPrice(combo.finalPrice)}
                    badge
                    badgeColor="success"
                  />
                  <InfoItem
                    icon={Award}
                    label="Status"
                    value={combo.status}
                    badge
                    badgeColor={combo.status === 'Published' ? "success" : "warning"}
                  />
                </div>
              </div>
            </div>

            {/* Savings Information */}
            {savings > 0 && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-green-800 dark:text-green-200">
                      Great Deal!
                    </h4>
                    <p className="text-sm text-green-600 dark:text-green-300">
                      You save ₹{savings} ({percentage}% off) with this combo
                    </p>
                  </div>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {percentage}% OFF
                  </div>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Combo Description
              </h4>
              <div className="bg-muted/30 rounded-lg p-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {combo.comboDescription}
                </p>
              </div>
            </div>

            {/* Included Materials */}
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <Layers className="w-4 h-4" />
                Included Materials
              </h4>
              <div className="grid gap-3">
                {combo.includedMaterials?.map((material, index) => (
                  <div key={material._id} className="bg-muted/30 rounded-lg p-4 border-l-4 border-yellow-400">
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-medium text-foreground">{material.title}</h5>
                      <span className="text-sm font-bold text-primary">
                        ₹{material.price}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                      {material.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>By {material.author}</span>
                      <span>{material.type}</span>
                      <span className={`px-2 py-1 rounded-full ${material.status === 'Published'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
                        }`}>
                        {material.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InfoItem
                icon={Calendar}
                label="Created"
                value={formatDate(combo.createdAt)}
              />
              <InfoItem
                icon={Clock}
                label="Added"
                value={getRelativeTime(combo.createdAt)}
              />
              <InfoItem
                icon={ShoppingCart}
                label="Purchases"
                value={combo.purchases || 0}
              />
              <InfoItem
                icon={Tag}
                label="Discount Type"
                value={combo.discountType}
              />
            </div>
          </div>
        </ModalContent>

        <ModalFooter>
          <Button
            variant="outline"
            onClick={() => setShowDetailsPopup(false)}
            className="flex-1 rounded-none border-none"
          >
            Close
          </Button>
          <Button
            onClick={() => {
              setShowDetailsPopup(false);
              setShowPurchasePopup(true);
            }}
            className="flex-1 rounded-none border-none bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700"
          >
            {combo.isFree ? 'Get Combo' : 'Buy Combo'}
          </Button>
        </ModalFooter>
      </Modal>

      {/* Purchase Confirmation Modal */}
      <Modal isOpen={showPurchasePopup} onClose={() => setShowPurchasePopup(false)} size="sm">
        <ModalHeader
          title={combo.isFree ? 'Get Free Combo' : 'Confirm Combo Purchase'}
          onClose={() => setShowPurchasePopup(false)}
        />

        <ModalContent className="text-center">
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="relative">
                <img
                  src={combo.thumbnailUrl}
                  alt={combo.comboTitle}
                  className="w-24 h-30 object-cover rounded-lg shadow-lg border-2 border-yellow-200"
                  onError={(e) => {
                    e.target.src = '/api/placeholder/300/200';
                  }}
                />
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-900 text-xs font-bold px-1.5 py-0.5 rounded-full">
                  COMBO
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">{combo.comboTitle}</h3>
              <p className="text-sm text-muted-foreground">
                {combo.includedMaterials?.length || 0} materials included
              </p>
              <div className="flex justify-center items-center gap-2">
                {savings > 0 && (
                  <span className="text-sm text-muted-foreground line-through">
                    {formatPrice(combo.comboPrice)}
                  </span>
                )}
                <div className="text-2xl font-bold text-primary">
                  {combo.isFree ? "Free" : formatPrice(combo.finalPrice)}
                </div>
              </div>
              {savings > 0 && (
                <div className="text-sm text-green-600 font-medium">
                  You save ₹{savings} ({percentage}% off)
                </div>
              )}
            </div>

            <div className="bg-muted/30 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">
                {combo.isFree
                  ? "This combo is available for free. Click confirm to get instant access to all materials."
                  : "You're about to purchase this combo. Once confirmed, you'll have immediate access to all included materials."
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
            className="flex-1 border-none rounded-none bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {combo.isFree ? 'Get Combo' : 'Confirm Purchase'}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

// Main BookComboCard Component
function BookComboCard() {
  const dispatch = useDispatch();
  const { combos, loading, error } = useSelector((state) => state.bookCombos);

  useEffect(() => {
    dispatch(fetchBookCombos());
  }, [dispatch]);

  const handlePurchase = (combo) => {
    console.log('Purchasing combo:', combo);
    // Add purchase logic here
  };

  const handlePreview = (combo) => {
    console.log('Previewing combo:', combo);
    // Add preview logic here
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading combos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <p className="text-destructive mb-2">Error loading combos</p>
          <p className="text-muted-foreground text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!combos || combos.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No combos available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Book Combos</h2>
        <p className="text-muted-foreground">
          Save more with our curated book combinations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {combos.map((combo) => (
          <ComboCard
            key={combo._id}
            combo={combo}
            onPreview={handlePreview}
            onPurchase={handlePurchase}
          />
        ))}
      </div>
    </div>
  );
}

export default BookComboCard;