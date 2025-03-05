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
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageSquare,
  Send,
  Facebook,
  Twitter,
  Instagram,
  Youtube
} from 'lucide-react';

const ContactUs = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <div className="min-h-screen ">
      {/* Hero Section */}
      <section className=" py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
          <p className=" text-lg max-w-2xl mx-auto">
            Have questions about our courses or need guidance? We&apos;re here to help you achieve your UPSC dreams.
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="pt-6">
                <Phone className="w-10 h-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Phone</h3>
                <p className="">+91 123-456-7890</p>
                <p className="">Mon-Sat: 9:00 AM - 6:00 PM</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <Mail className="w-10 h-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Email</h3>
                <p className="">info@administrativeworld.com</p>
                <p className="">support@administrativeworld.com</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <MapPin className="w-10 h-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Location</h3>
                <p className="">123 Education Street</p>
                <p className="">New Delhi, India 110001</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <Clock className="w-10 h-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Office Hours</h3>
                <p className="">Monday - Saturday</p>
                <p className="">9:00 AM - 6:00 PM</p>
              </CardContent>
            </Card>
          </div>
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
                    <Input placeholder="Enter your full name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input type="email" placeholder="Enter your email" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone Number</label>
                  <Input placeholder="Enter your phone number" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Subject</label>
                  <Select>
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
                    placeholder="Type your message here"
                    className="min-h-[150px]"
                  />
                </div>

                <Button type="submit" className="w-full">
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Social Media Section */}
      <section className=" py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-6">Connect With Us</h2>
          <div className="flex justify-center space-x-6">
            <Button variant="outline" size="lg" className="rounded-full">
              <Facebook className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="lg" className="rounded-full">
              <Twitter className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="lg" className="rounded-full">
              <Instagram className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="lg" className="rounded-full">
              <Youtube className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
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