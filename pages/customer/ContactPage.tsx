
import React from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input, { Textarea } from '../../components/Input';

const ContactPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl md:text-4xl font-bold font-poppins text-text-primary">Get in Touch</h1>
        <p className="mt-4 text-lg text-text-secondary">
          Have a question or a special request? We'd love to hear from you.
        </p>
      </div>
      <div className="mt-12 max-w-2xl mx-auto">
        <Card padding="lg">
          <form className="space-y-6">
            <Input label="Full Name" id="name" type="text" placeholder="Your Name" />
            <Input label="Email Address" id="email" type="email" placeholder="you@example.com" />
            <Textarea label="Message" id="message" placeholder="How can we help?" />
            <Button type="submit" size="lg" className="w-full">Send Message</Button>
          </form>
        </Card>
        <Card className="mt-8 text-center" padding="lg">
          <h2 className="text-xl font-semibold">Prefer a quicker chat?</h2>
          <p className="text-text-secondary mt-2">Contact us directly on WhatsApp for a faster response.</p>
          <Button variant="secondary" size="lg" className="mt-4 !bg-green-500 hover:!bg-green-600">
            Chat on WhatsApp
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default ContactPage;
