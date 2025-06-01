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

const ContactUs = () => {
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

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
          <p className="text-lg max-w-2xl mx-auto">
            Have questions about our courses or need guidance? We&apos;re here to help you achieve your UPSC dreams.
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card><CardContent className="pt-6"><Phone className="w-10 h-10 text-primary mb-4" /><h3 className="font-semibold mb-2">Phone</h3><p>+91 98968-59767</p><p>Mon-Sat: 8:00 AM - 6:00 PM</p></CardContent></Card>
          <Card><CardContent className="pt-6"><Mail className="w-10 h-10 text-primary mb-4" /><h3 className="font-semibold mb-2">Email</h3><p>info@administrativeworld.com</p><p>support@administrativeworld.com</p></CardContent></Card>
          <Card><CardContent className="pt-6"><MapPin className="w-10 h-10 text-primary mb-4" /><h3 className="font-semibold mb-2">Location</h3><p>Hisar (Haryana)</p><p>125001</p></CardContent></Card>
          <Card><CardContent className="pt-6"><Clock className="w-10 h-10 text-primary mb-4" /><h3 className="font-semibold mb-2">Office Hours</h3><p>Monday - Saturday</p><p>10:00 AM - 6:00 PM</p></CardContent></Card>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
              <CardDescription>
                Fill out the form below and we&apos;ll get back to you as soon as possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name</label>
                    <Input name="fullname" value={formData.fullname} onChange={handleChange} placeholder="Enter your full name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone Number</label>
                  <Input name="phoneNo" value={formData.phoneNo} onChange={handleChange} placeholder="Enter your phone number" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Subject</label>
                  <Select onValueChange={handleSubjectChange} value={formData.subject}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Inquiry</SelectItem>
                      <SelectItem value="courses">Course Information</SelectItem>
                      <SelectItem value="mentorship">Mentorship Program</SelectItem>
                      <SelectItem value="support">Technical Support</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Message</label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Type your message here"
                    className="min-h-[150px]"
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  <Send className="w-4 h-4 mr-2" />
                  {loading ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Social Media Section */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-6">Connect With Us</h2>
          <div className="flex justify-center space-x-6">
            <Button variant="outline" size="lg" className="rounded-full"><Facebook className="w-5 h-5" /></Button>
            <Button variant="outline" size="lg" className="rounded-full"><Twitter className="w-5 h-5" /></Button>
            <Button variant="outline" size="lg" className="rounded-full"><Instagram className="w-5 h-5" /></Button>
            <Button variant="outline" size="lg" className="rounded-full"><Youtube className="w-5 h-5" /></Button>
          </div>
        </div>
      </section>

      {/* FAQ or Support */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-6">Quick Support</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Button variant="outline" className="h-auto py-8 flex flex-col items-center">
              <MessageSquare className="w-8 h-8 mb-2" />
              <span className="text-lg font-semibold">Live Chat Support</span>
              <span className="text-sm ">Available 9 AM - 6 PM</span>
            </Button>
            <Button variant="outline" className="h-auto py-8 flex flex-col items-center">
              <Mail className="w-8 h-8 mb-2" />
              <span className="text-lg font-semibold">Email Support</span>
              <span className="text-sm ">24/7 Response</span>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
