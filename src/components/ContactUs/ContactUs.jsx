import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Mail, Phone, MapPin, Clock, MessageSquare, Send, Facebook, Twitter, Instagram, Youtube,
} from 'lucide-react';
import { Helmet } from 'react-helmet';
import dynamicMetaDataSeo from '@/configs/dynamicMetaDataSeo';
import { useLocation } from 'react-router-dom';

const ContactUs = () => {
  const location = useLocation();
  const currentUrl = `${import.meta.env.VITE_DOMAIN}${location.pathname}`;
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phoneNo: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubjectChange = (value) => {
    setFormData((prev) => ({ ...prev, subject: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullname || !formData.email || !formData.message || !formData.subject) {
      toast.error('Please fill out all required fields.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/contact/contactus`,
        formData
      );

      if (res.data.success) {
        toast.success('Message sent successfully!');
        setFormData({
          fullname: '',
          email: '',
          phoneNo: '',
          subject: '',
          message: '',
        });
      } else {
        toast.error(res.data.message || 'Failed to send message.');
      }
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Structured data for better SEO
  const contactPageStructuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact Administrative World - UPSC Coaching",
    "description": "Get in touch with Administrative World for UPSC coaching, mentorship programs, and course information. Expert guidance for civil services preparation.",
    "url": currentUrl,
    "mainEntity": {
      "@type": "Organization",
      "name": "Administrative World",
      "url": import.meta.env.VITE_DOMAIN,
      "logo": `${import.meta.env.VITE_DOMAIN}/logo.png`,
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "telephone": "+91-98968-59767",
          "contactType": "customer service",
          "availableLanguage": ["English", "Hindi"],
          "hoursAvailable": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            "opens": "08:00",
            "closes": "18:00"
          }
        }
      ],
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Hisar",
        "addressRegion": "Haryana",
        "postalCode": "125001",
        "addressCountry": "IN"
      },
      "email": "info@administrativeworld.com",
      "sameAs": [
        "https://www.youtube.com/@Admn_World",
        "https://facebook.com/yourpage"
      ]
    }
  };

  return (
    <>
      <Helmet>
        <title>{dynamicMetaDataSeo.contact.title}</title>
        <meta name="description" content={dynamicMetaDataSeo.contact.description} />
        <meta name="keywords" content={dynamicMetaDataSeo.contact.keywords} />
        <link rel="canonical" href={currentUrl} />

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content={dynamicMetaDataSeo.contact.title} />
        <meta property="og:description" content={dynamicMetaDataSeo.contact.description} />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Administrative World" />
        <meta property="og:image" content={`${import.meta.env.VITE_DOMAIN}/contact-og-image.jpg`} />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={dynamicMetaDataSeo.contact.title} />
        <meta name="twitter:description" content={dynamicMetaDataSeo.contact.description} />
        <meta name="twitter:image" content={`${import.meta.env.VITE_DOMAIN}/contact-og-image.jpg`} />

        {/* Additional SEO Meta Tags */}
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="author" content="Administrative World" />
        <meta name="geo.region" content="IN-HR" />
        <meta name="geo.placename" content="Hisar, Haryana" />
        <meta name="geo.position" content="29.1492;75.7217" />
        <meta name="ICBM" content="29.1492, 75.7217" />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(contactPageStructuredData)}
        </script>
      </Helmet>

      <div className="min-h-screen">
        {/* Hero Section with SEO-optimized content */}
        <section className="py-16 px-4" role="banner">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">
              Contact Administrative World - UPSC Coaching & Mentorship
            </h1>
            <p className="text-lg max-w-2xl mx-auto">
              Get expert guidance for UPSC civil services preparation. Contact our experienced mentors for course information,
              personalized coaching, and comprehensive study materials. We're here to help you achieve your IAS dreams.
            </p>
          </div>
        </section>

        {/* Contact Information with structured data markup */}
        <section className="py-12 px-4" role="main">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">
              Get in Touch - Multiple Ways to Reach Us
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card itemScope itemType="https://schema.org/ContactPoint">
                <CardContent className="pt-6">
                  <Phone className="w-10 h-10 text-primary mb-4" aria-hidden="true" />
                  <h3 className="font-semibold mb-2">Phone Support</h3>
                  <p itemProp="telephone">
                    <a href="tel:+919896859767" className="text-primary hover:underline">
                      +91 98968-59767
                    </a>
                  </p>
                  <p className="text-sm text-muted-foreground" itemProp="hoursAvailable">
                    Mon-Sat: 8:00 AM - 6:00 PM IST
                  </p>
                </CardContent>
              </Card>

              <Card itemScope itemType="https://schema.org/ContactPoint">
                <CardContent className="pt-6">
                  <Mail className="w-10 h-10 text-primary mb-4" aria-hidden="true" />
                  <h3 className="font-semibold mb-2">Email Support</h3>
                  <p>
                    <a href="mailto:info@administrativeworld.com" className="text-primary hover:underline" itemProp="email">
                      info@administrativeworld.com
                    </a>
                  </p>
                  <p>
                    <a href="mailto:support@administrativeworld.com" className="text-primary hover:underline">
                      support@administrativeworld.com
                    </a>
                  </p>
                </CardContent>
              </Card>

              <Card itemScope itemType="https://schema.org/PostalAddress">
                <CardContent className="pt-6">
                  <MapPin className="w-10 h-10 text-primary mb-4" aria-hidden="true" />
                  <h3 className="font-semibold mb-2">Our Location</h3>
                  <address className="not-italic">
                    <span itemProp="addressLocality">Hisar</span>,
                    <span itemProp="addressRegion"> Haryana</span><br />
                    <span itemProp="postalCode">125001</span><br />
                    <span itemProp="addressCountry">India</span>
                  </address>
                </CardContent>
              </Card>

              <Card itemScope itemType="https://schema.org/OpeningHoursSpecification">
                <CardContent className="pt-6">
                  <Clock className="w-10 h-10 text-primary mb-4" aria-hidden="true" />
                  <h3 className="font-semibold mb-2">Office Hours</h3>
                  <p itemProp="dayOfWeek" content="Monday,Tuesday,Wednesday,Thursday,Friday,Saturday">
                    Monday - Saturday
                  </p>
                  <p>
                    <time itemProp="opens" content="10:00">10:00 AM</time> -
                    <time itemProp="closes" content="18:00"> 6:00 PM</time>
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Contact Form Section with accessibility improvements */}
        <section className="py-12 px-4" aria-labelledby="contact-form-heading">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle id="contact-form-heading">
                  Send us a Message - UPSC Coaching Inquiry Form
                </CardTitle>
                <CardDescription>
                  Fill out the form below for course inquiries, mentorship programs, or general questions about UPSC preparation.
                  We'll get back to you within 24 hours.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="fullname" className="text-sm font-medium">
                        Full Name <span className="text-red-500" aria-label="required">*</span>
                      </label>
                      <Input
                        id="fullname"
                        name="fullname"
                        value={formData.fullname}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        required
                        aria-describedby="fullname-error"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email Address <span className="text-red-500" aria-label="required">*</span>
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email address"
                        required
                        aria-describedby="email-error"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="phoneNo" className="text-sm font-medium">
                      Phone Number (Optional)
                    </label>
                    <Input
                      id="phoneNo"
                      name="phoneNo"
                      type="tel"
                      value={formData.phoneNo}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">
                      Subject <span className="text-red-500" aria-label="required">*</span>
                    </label>
                    <Select onValueChange={handleSubjectChange} value={formData.subject} required>
                      <SelectTrigger id="subject">
                        <SelectValue placeholder="Select inquiry type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="courses">UPSC Course Information</SelectItem>
                        <SelectItem value="mentorship">Personal Mentorship Program</SelectItem>
                        <SelectItem value="support">Technical Support</SelectItem>
                        <SelectItem value="admission">Admission Process</SelectItem>
                        <SelectItem value="fee">Fee Structure</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Message <span className="text-red-500" aria-label="required">*</span>
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Please describe your inquiry in detail. Include your current preparation status, preferred course type, or any specific questions about UPSC coaching."
                      className="min-h-[150px]"
                      required
                      aria-describedby="message-help"
                    />
                    <p id="message-help" className="text-xs text-muted-foreground">
                      The more details you provide, the better we can assist you with your UPSC preparation needs.
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loading}
                    aria-describedby="submit-help"
                  >
                    <Send className="w-4 h-4 mr-2" aria-hidden="true" />
                    {loading ? 'Sending Message...' : 'Send Message'}
                  </Button>
                  <p id="submit-help" className="text-xs text-muted-foreground text-center">
                    We typically respond within 24 hours during business days.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Social Media Section with proper linking */}
        <section className="py-12 px-4" aria-labelledby="social-heading">
          <div className="max-w-4xl mx-auto text-center">
            <h2 id="social-heading" className="text-2xl font-bold mb-6">
              Follow Administrative World on Social Media
            </h2>
            <p className="mb-6 text-muted-foreground">
              Stay updated with latest UPSC notifications, study tips, and success stories
            </p>
            <div className="flex justify-center space-x-6" role="list">
              <Button variant="outline" size="lg" className="rounded-full" role="listitem">
                <a
                  href="https://facebook.com/yourpage"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow us on Facebook"
                  className="flex items-center"
                >
                  <Facebook className="w-5 h-5" aria-hidden="true" />
                  <span className="sr-only">Facebook</span>
                </a>
              </Button>
              <Button variant="outline" size="lg" className="rounded-full" role="listitem">
                <a
                  href="#"
                  aria-label="Follow us on Twitter"
                  className="flex items-center"
                >
                  <Twitter className="w-5 h-5" aria-hidden="true" />
                  <span className="sr-only">Twitter</span>
                </a>
              </Button>
              <Button variant="outline" size="lg" className="rounded-full" role="listitem">
                <a
                  href="#"
                  aria-label="Follow us on Instagram"
                  className="flex items-center"
                >
                  <Instagram className="w-5 h-5" aria-hidden="true" />
                  <span className="sr-only">Instagram</span>
                </a>
              </Button>
              <Button variant="outline" size="lg" className="rounded-full" role="listitem">
                <a
                  href="https://www.youtube.com/@Admn_World"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Subscribe to our YouTube channel"
                  className="flex items-center"
                >
                  <Youtube className="w-5 h-5" aria-hidden="true" />
                  <span className="sr-only">YouTube</span>
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Quick Support Section */}
        <section className="py-12 px-4" aria-labelledby="support-heading">
          <div className="max-w-4xl mx-auto text-center">
            <h2 id="support-heading" className="text-2xl font-bold mb-6">
              Immediate Support Options
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="h-auto py-8 flex flex-col items-center hover:shadow-lg transition-shadow">
                <CardContent className="text-center">
                  <MessageSquare className="w-8 h-8 mb-2 mx-auto text-primary" aria-hidden="true" />
                  <h3 className="text-lg font-semibold mb-2">Live Phone Support</h3>
                  <p className="mb-2">
                    <a href="tel:+919896859767" className="text-primary hover:underline font-medium">
                      +91 98968-59767
                    </a>
                  </p>
                  <p className="text-sm text-muted-foreground">Available 8 AM - 6 PM IST</p>
                  <p className="text-sm text-muted-foreground">Monday to Saturday</p>
                </CardContent>
              </Card>

              <Card className="h-auto py-8 flex flex-col items-center hover:shadow-lg transition-shadow">
                <CardContent className="text-center">
                  <Mail className="w-8 h-8 mb-2 mx-auto text-primary" aria-hidden="true" />
                  <h3 className="text-lg font-semibold mb-2">Email Support</h3>
                  <p className="mb-2">
                    <a href="mailto:contactadworld01@gmail.com" className="text-primary hover:underline font-medium">
                      contactadworld01@gmail.com
                    </a>
                  </p>
                  <p className="text-sm text-muted-foreground">24/7 Response Promise</p>
                  <p className="text-sm text-muted-foreground">Typically within 2-4 hours</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ContactUs;