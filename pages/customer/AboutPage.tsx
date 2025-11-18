
import React from 'react';
import Card from '../../components/Card';

const AboutPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="max-w-3xl mx-auto">
        <Card padding="lg">
          <h1 className="text-3xl md:text-4xl font-bold font-poppins text-center text-text-primary mb-6">About MerchCo</h1>
          <div className="space-y-4 text-text-secondary leading-relaxed">
            <p>
              Founded in 2023, MerchCo was born from a passion for high-quality apparel and unique design. We believe that what you wear is a form of self-expression, and we're dedicated to providing the tools and products to help you show the world who you are.
            </p>
            <p>
              Our mission is simple: to deliver exceptional products and an unparalleled customization experience. From our curated collections of ready-to-wear merchandise to our easy-to-use custom t-shirt designer, quality and customer satisfaction are at the heart of everything we do.
            </p>
            <p>
              We're more than just a t-shirt company; we're a community of creators, dreamers, and style enthusiasts. Thank you for being a part of our journey.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AboutPage;
