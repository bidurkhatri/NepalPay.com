import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useBlockchain } from '@/contexts/blockchain-context';
import { 
  ArrowLeft, 
  Loader2, 
  Phone, 
  ShoppingBag, 
  MessageSquare,
  AlertCircle,
  Tag,
  Check,
  MapPin,
  Info
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Ad data interface
export interface AdData {
  heading: string;
  description: string;
  business: string;
  location: string;
  contact: string;
}

// Sample Ads (in a real app, these would be fetched from the blockchain)
const sampleAds = [
  {
    tier: 'crest',
    heading: 'Fresh Organic Momos',
    description: 'Authentic Nepali momos made with locally-sourced ingredients',
    business: "Raju's Momo Corner",
    location: 'Thamel, Kathmandu',
    contact: '+977-9800123456',
  },
  {
    tier: 'wings',
    heading: 'Homemade Sel Roti',
    description: 'Traditional Nepali sweet bread, perfect for festivals',
    business: "Ama's Kitchen",
    location: 'Patan, Lalitpur',
    contact: '+977-9801234567',
  },
  {
    tier: 'base',
    heading: 'Handcrafted Pashmina Shawls',
    description: 'Authentic Nepali pashmina shawls, scarves, and wraps',
    business: 'Himalayan Threads',
    location: 'Bouddha, Kathmandu',
    contact: '+977-9802345678',
  },
];

const AdBazaarPage: React.FC = () => {
  const { 
    isConnected, 
    nptBalance,
    bidForFlame,
    getActiveAds
  } = useBlockchain();
  
  const { toast } = useToast();
  const [, navigate] = useLocation();
  
  // Tab state
  const [activeTab, setActiveTab] = useState<'post' | 'browse'>('browse');
  
  // Form state for posting ad
  const [adHeading, setAdHeading] = useState('');
  const [adDescription, setAdDescription] = useState('');
  const [adBusiness, setAdBusiness] = useState('');
  const [adLocation, setAdLocation] = useState('');
  const [adContact, setAdContact] = useState('');
  const [selectedTier, setSelectedTier] = useState<'base' | 'wings' | 'crest'>('base');
  const [submittingAd, setSubmittingAd] = useState(false);
  
  // State for ad listing
  const [ads, setAds] = useState<any[]>([]);
  const [loadingAds, setLoadingAds] = useState(false);
  
  // Tier pricing
  const tierPricing = {
    base: 500,
    wings: 750,
    crest: 1000
  };
  
  // Validation for form
  const isFormValid = 
    adHeading.length > 0 && 
    adDescription.length > 0 && 
    adBusiness.length > 0 && 
    adLocation.length > 0 && 
    adContact.length > 0;
  
  const canAffordTier = parseFloat(nptBalance) >= tierPricing[selectedTier];
  const canSubmitAd = isFormValid && canAffordTier && !submittingAd;
  
  // Load ads
  useEffect(() => {
    const fetchAds = async () => {
      if (!isConnected) return;
      
      try {
        setLoadingAds(true);
        
        // In a real app, this would get ads from the blockchain for each tier
        // const crestAds = await getActiveAds('crest');
        // const wingsAds = await getActiveAds('wings');
        // const baseAds = await getActiveAds('base');
        // setAds([...crestAds, ...wingsAds, ...baseAds]);
        
        // For now, use sample ads
        setAds(sampleAds);
        
      } catch (error) {
        console.error('Error fetching ads:', error);
      } finally {
        setLoadingAds(false);
      }
    };
    
    fetchAds();
  }, [isConnected, getActiveAds]);
  
  // Handle ad submission
  const handleSubmitAd = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canSubmitAd) return;
    
    try {
      setSubmittingAd(true);
      
      const adData: AdData = {
        heading: adHeading,
        description: adDescription,
        business: adBusiness,
        location: adLocation,
        contact: adContact
      };
      
      await bidForFlame(adData, selectedTier, tierPricing[selectedTier].toString());
      
      toast({
        title: "Ad Submitted",
        description: "Your ad has been submitted for approval!",
        variant: "default",
      });
      
      // Reset form
      setAdHeading('');
      setAdDescription('');
      setAdBusiness('');
      setAdLocation('');
      setAdContact('');
      
      // Switch to browse tab
      setActiveTab('browse');
      
    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit ad",
        variant: "destructive",
      });
    } finally {
      setSubmittingAd(false);
    }
  };
  
  // Handle call business
  const handleCallBusiness = (contact: string) => {
    window.location.href = `tel:${contact}`;
  };
  
  // Redirect if not connected
  useEffect(() => {
    if (!isConnected) {
      navigate('/login');
    }
  }, [isConnected, navigate]);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 flex flex-col">
      {/* Header with back button and balance */}
      <header className="border-b border-gray-800/60 bg-gray-900/70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-5">
            <Link href="/sections" className="flex items-center text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span>Back to Dashboard</span>
            </Link>
            
            <div className="flex items-center">
              <div className="text-2xl font-bold gradient-text">Ad Bazaar</div>
            </div>
            
            <div className="flex items-center">
              <div className="text-sm text-gray-400 mr-2">Balance:</div>
              <div className="text-white font-medium">{parseFloat(nptBalance).toLocaleString()} NPT</div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Tabs */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('browse')}
              className={`py-4 px-6 focus:outline-none transition-colors ${
                activeTab === 'browse'
                  ? 'text-primary border-b-2 border-primary font-medium'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Browse Ads
            </button>
            <button
              onClick={() => setActiveTab('post')}
              className={`py-4 px-6 focus:outline-none transition-colors ${
                activeTab === 'post'
                  ? 'text-primary border-b-2 border-primary font-medium'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Post an Ad
            </button>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <main className="flex-grow px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Browse Ads Tab */}
          {activeTab === 'browse' && (
            <div>
              <div className="mb-8">
                <h2 className="text-xl font-bold text-white mb-4">Featured Ads</h2>
                
                {loadingAds ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 text-primary animate-spin" />
                  </div>
                ) : ads.length === 0 ? (
                  <div className="cyber-card">
                    <div className="card-highlight"></div>
                    <div className="card-content p-8 text-center">
                      <AlertCircle className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                      <h3 className="text-xl font-medium text-white mb-2">No Ads Available</h3>
                      <p className="text-gray-400 mb-6">Be the first to post an ad in the Ad Bazaar!</p>
                      <button
                        onClick={() => setActiveTab('post')}
                        className="modern-button bg-gradient-to-r from-indigo-600 to-indigo-500"
                      >
                        Post an Ad
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ads.map((ad, index) => (
                      <div key={index} className="cyber-card hover:shadow-xl transition-all">
                        <div className="card-highlight"></div>
                        <div className="card-content p-5">
                          {/* Tier badge */}
                          <div className={`absolute -top-2 -right-2 py-1 px-3 rounded-full text-xs font-bold uppercase ${
                            ad.tier === 'crest' 
                              ? 'bg-gradient-to-r from-amber-600 to-yellow-500 text-white' 
                              : ad.tier === 'wings'
                                ? 'bg-gradient-to-r from-indigo-600 to-blue-500 text-white'
                                : 'bg-gradient-to-r from-gray-600 to-gray-500 text-white'
                          }`}>
                            {ad.tier}
                          </div>
                          
                          <h3 className="text-lg font-bold text-white mb-2">{ad.heading}</h3>
                          <p className="text-gray-400 text-sm mb-4 line-clamp-2">{ad.description}</p>
                          
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center text-gray-300">
                              <ShoppingBag className="h-4 w-4 mr-2 text-gray-500" />
                              <span>{ad.business}</span>
                            </div>
                            
                            <div className="flex items-center text-gray-300">
                              <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                              <span>{ad.location}</span>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => handleCallBusiness(ad.contact)}
                            className="w-full modern-button bg-gradient-to-r from-green-600 to-green-500 py-2"
                          >
                            <Phone className="mr-2 h-4 w-4" />
                            Call Business
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Ad pricing info */}
              <div className="glass-card mt-8">
                <div className="card-highlight"></div>
                <div className="card-content p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Ad Tier Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="glass-panel p-4 border-gray-700 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-lg font-medium text-white">Base</div>
                        <div className="bg-gray-700 py-1 px-3 rounded-full text-xs font-bold">500 NPT</div>
                      </div>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start">
                          <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                          <span className="text-gray-300">Standard listing</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                          <span className="text-gray-300">7 days visibility</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                          <span className="text-gray-300">Base tier placement</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="glass-panel p-4 border-indigo-700/30 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-lg font-medium text-white">Wings</div>
                        <div className="bg-indigo-600/70 py-1 px-3 rounded-full text-xs font-bold">750 NPT</div>
                      </div>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start">
                          <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                          <span className="text-gray-300">Priority listing</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                          <span className="text-gray-300">14 days visibility</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                          <span className="text-gray-300">Middle tier placement</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="glass-panel p-4 border-amber-700/30 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-lg font-medium text-white">Crest</div>
                        <div className="bg-amber-600/70 py-1 px-3 rounded-full text-xs font-bold">1000 NPT</div>
                      </div>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start">
                          <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                          <span className="text-gray-300">Premium listing</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                          <span className="text-gray-300">30 days visibility</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                          <span className="text-gray-300">Top tier placement</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-xs text-gray-500 flex items-start">
                    <Info className="h-4 w-4 mr-2 text-gray-500" />
                    <span>5% of all ad fees go to the Ember Pool community fund to help schools and clinics in Nepal.</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Post an Ad Tab */}
          {activeTab === 'post' && (
            <div className="cyber-card">
              <div className="card-highlight"></div>
              <div className="card-content p-6">
                <form onSubmit={handleSubmitAd} className="space-y-6">
                  <h2 className="text-xl font-bold text-white mb-6">Post Your Ad</h2>
                  
                  {/* Ad Heading */}
                  <div>
                    <label htmlFor="adHeading" className="block text-sm font-medium text-gray-300 mb-2">
                      Ad Heading <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="adHeading"
                      type="text"
                      value={adHeading}
                      onChange={(e) => setAdHeading(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="e.g., Fresh Momos in Thamel"
                      required
                      maxLength={50}
                    />
                    <div className="text-xs text-gray-500 mt-1 flex justify-end">
                      {adHeading.length}/50
                    </div>
                  </div>
                  
                  {/* Ad Description */}
                  <div>
                    <label htmlFor="adDescription" className="block text-sm font-medium text-gray-300 mb-2">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="adDescription"
                      value={adDescription}
                      onChange={(e) => setAdDescription(e.target.value)}
                      rows={3}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="Describe your product or service..."
                      required
                      maxLength={200}
                    ></textarea>
                    <div className="text-xs text-gray-500 mt-1 flex justify-end">
                      {adDescription.length}/200
                    </div>
                  </div>
                  
                  {/* Business Name */}
                  <div>
                    <label htmlFor="adBusiness" className="block text-sm font-medium text-gray-300 mb-2">
                      Business Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="adBusiness"
                      type="text"
                      value={adBusiness}
                      onChange={(e) => setAdBusiness(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="e.g., Raju's Momo Corner"
                      required
                      maxLength={50}
                    />
                  </div>
                  
                  {/* Location */}
                  <div>
                    <label htmlFor="adLocation" className="block text-sm font-medium text-gray-300 mb-2">
                      Location <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="adLocation"
                      type="text"
                      value={adLocation}
                      onChange={(e) => setAdLocation(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="e.g., Thamel, Kathmandu"
                      required
                      maxLength={100}
                    />
                  </div>
                  
                  {/* Contact Information */}
                  <div>
                    <label htmlFor="adContact" className="block text-sm font-medium text-gray-300 mb-2">
                      Contact Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="adContact"
                      type="tel"
                      value={adContact}
                      onChange={(e) => setAdContact(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="e.g., +977-98xxxxxxxx"
                      required
                      pattern="^\+?[0-9\s\-\(\)]+$"
                      title="Please enter a valid phone number"
                    />
                    <div className="text-xs text-gray-500 mt-1">Include country code for international visibility</div>
                  </div>
                  
                  {/* Tier Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-4">
                      Select Ad Tier <span className="text-red-500">*</span>
                    </label>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div 
                        className={`cursor-pointer border rounded-lg p-4 transition-all ${
                          selectedTier === 'base' 
                            ? 'bg-gray-800/70 border-gray-600' 
                            : 'bg-gray-900/30 border-gray-800 hover:bg-gray-800/50'
                        }`}
                        onClick={() => setSelectedTier('base')}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium text-white">Base</div>
                          <div className="bg-gray-700 py-1 px-2 rounded-full text-xs">500 NPT</div>
                        </div>
                        <ul className="space-y-1 text-xs">
                          <li className="text-gray-400">• 7 days visibility</li>
                          <li className="text-gray-400">• Standard placement</li>
                        </ul>
                        {selectedTier === 'base' && (
                          <div className="mt-2 text-center">
                            <div className="inline-block bg-primary/20 text-primary text-xs py-1 px-2 rounded-full">Selected</div>
                          </div>
                        )}
                      </div>
                      
                      <div 
                        className={`cursor-pointer border rounded-lg p-4 transition-all ${
                          selectedTier === 'wings' 
                            ? 'bg-indigo-900/20 border-indigo-600/30' 
                            : 'bg-gray-900/30 border-gray-800 hover:bg-gray-800/50'
                        }`}
                        onClick={() => setSelectedTier('wings')}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium text-white">Wings</div>
                          <div className="bg-indigo-800/70 py-1 px-2 rounded-full text-xs">750 NPT</div>
                        </div>
                        <ul className="space-y-1 text-xs">
                          <li className="text-gray-400">• 14 days visibility</li>
                          <li className="text-gray-400">• Enhanced placement</li>
                        </ul>
                        {selectedTier === 'wings' && (
                          <div className="mt-2 text-center">
                            <div className="inline-block bg-indigo-500/20 text-indigo-400 text-xs py-1 px-2 rounded-full">Selected</div>
                          </div>
                        )}
                      </div>
                      
                      <div 
                        className={`cursor-pointer border rounded-lg p-4 transition-all ${
                          selectedTier === 'crest' 
                            ? 'bg-amber-900/20 border-amber-600/30' 
                            : 'bg-gray-900/30 border-gray-800 hover:bg-gray-800/50'
                        }`}
                        onClick={() => setSelectedTier('crest')}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium text-white">Crest</div>
                          <div className="bg-amber-800/70 py-1 px-2 rounded-full text-xs">1000 NPT</div>
                        </div>
                        <ul className="space-y-1 text-xs">
                          <li className="text-gray-400">• 30 days visibility</li>
                          <li className="text-gray-400">• Premium placement</li>
                        </ul>
                        {selectedTier === 'crest' && (
                          <div className="mt-2 text-center">
                            <div className="inline-block bg-amber-500/20 text-amber-400 text-xs py-1 px-2 rounded-full">Selected</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Total Cost */}
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div className="text-gray-400">Selected tier:</div>
                      <div className="text-white capitalize">{selectedTier}</div>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <div className="flex items-center text-gray-400">
                        <span>Cost:</span>
                        <Info className="h-3.5 w-3.5 ml-1 text-gray-500" />
                      </div>
                      <div className="text-white">{tierPricing[selectedTier]} NPT</div>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <div className="text-gray-400">Ember Pool contribution:</div>
                      <div className="text-gray-300">{tierPricing[selectedTier] * 0.05} NPT</div>
                    </div>
                    <div className="border-t border-gray-700 my-2"></div>
                    <div className="flex justify-between items-center font-medium">
                      <div className="text-gray-200">Total:</div>
                      <div className="text-white">{tierPricing[selectedTier]} NPT</div>
                    </div>
                  </div>
                  
                  {!canAffordTier && (
                    <div className="bg-red-900/20 border border-red-800/30 text-red-400 rounded-lg p-4 text-sm">
                      <div className="flex items-start">
                        <AlertCircle className="h-5 w-5 mr-2" />
                        <div>
                          <p>Insufficient funds for this tier.</p>
                          <p className="mt-1">Current balance: {parseFloat(nptBalance).toLocaleString()} NPT</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={!canSubmitAd}
                    className={`modern-button w-full py-3 flex items-center justify-center 
                      ${canSubmitAd ? 'bg-gradient-to-r from-blue-600 to-indigo-500' : 'bg-gray-700 cursor-not-allowed'}`}
                  >
                    {submittingAd ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Tag className="mr-2 h-5 w-5" />
                        Submit Ad
                      </>
                    )}
                  </button>
                  
                  <div className="text-xs text-gray-500">
                    All ads require admin approval before being listed. This usually takes less than 24 hours.
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
      
      {/* Footer with Help Chat */}
      <footer className="py-8 px-4 border-t border-gray-800">
        <div className="max-w-7xl mx-auto flex justify-center">
          <div className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} NepaliPay. All rights reserved.
          </div>
        </div>
        
        {/* Need Help Chat Bubble - Fixed position */}
        <div className="fixed bottom-6 right-6 z-40">
          <Link href="/support" className="flex items-center glass-card bg-primary/10 py-3 px-5 rounded-full shadow-lg hover:scale-105 transition-transform">
            <div className="relative mr-2 h-5 w-5 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xs">?</span>
            </div>
            <span className="font-medium text-primary">Need Help?</span>
          </Link>
        </div>
      </footer>
      
      {/* Processing animation */}
      {submittingAd && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg p-8 max-w-md w-full text-center">
            <Loader2 className="h-12 w-12 mx-auto mb-4 text-primary animate-spin" />
            <h3 className="text-xl font-bold text-white mb-2">Submitting your ad...</h3>
            <p className="text-gray-400">Please wait while your transaction is being confirmed on the blockchain.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdBazaarPage;