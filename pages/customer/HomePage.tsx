import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/Card';
import Button from '../../components/Button';
import ProductCard from '../../components/ProductCard';
import HeroSlider from '../../components/HeroSlider';
import Spinner from '../../components/Spinner';
import { Product, HeroSlide } from '../../types';
import * as api from '../../api/mockApi';

const AnnouncementBar: React.FC<{text: string}> = ({ text }) => (
  <div className="bg-text-primary text-white text-sm text-center py-2.5 overflow-hidden">
    <div className="animate-marquee whitespace-nowrap">
      <span className="mx-4">{text}</span>
      <span className="mx-4">{text}</span>
    </div>
    <style>{`
      @keyframes marquee {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
      .animate-marquee {
        display: inline-block;
        animation: marquee 30s linear infinite;
      }
    `}</style>
  </div>
);

const HomePage: React.FC = () => {
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [homeContent, setHomeContent] = useState<{ announcementBarText: string; heroSlides: HeroSlide[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [sellersRes, contentRes] = await Promise.all([
          api.getBestSellers(),
          api.getHomeContent()
        ]);
        setBestSellers(sellersRes.data);
        setHomeContent(contentRes.data);
      } catch (error) {
        console.error("Failed to fetch homepage data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const categories = ['New', 'Holidays', 'Men', 'Women', 'Children'];

  if (loading || !homeContent) {
    return <div className="flex justify-center items-center h-screen"><Spinner /></div>;
  }

  return (
    <div className="bg-background">
      <AnnouncementBar text={homeContent.announcementBarText} />
      
      <section>
          <HeroSlider slides={homeContent.heroSlides} />
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16 space-y-16 md:space-y-24">
        
        <section className="text-center flex flex-col items-center -mt-8">
           <div className="mt-8 flex flex-wrap justify-center gap-3">
            {categories.map(cat => (
              <Button key={cat} variant="outline" className="rounded-full !px-5 !py-2 !h-auto">
                {cat}
              </Button>
            ))}
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-8 items-center">
          <Card className="flex flex-col items-start justify-center text-left" padding="lg">
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary">Create Your Own T-Shirt</h2>
            <p className="mt-3 text-text-secondary">
              Bring your ideas to life. Upload your design, choose your style, and we'll handle the rest.
            </p>
            <Link to="/custom-tshirt">
              <Button variant="primary" className="mt-6">Start Designing</Button>
            </Link>
          </Card>
          <Card padding="none" className="overflow-hidden">
            <div className="relative h-full w-full min-h-[300px] md:min-h-[400px]">
              <img src="https://picsum.photos/id/1062/600/400" alt="Custom t-shirt example" className="absolute inset-0 w-full h-full object-cover" />
               <img src="https://picsum.photos/id/1074/600/400" alt="Another custom t-shirt" className="absolute inset-0 w-full h-full object-cover animate-fade-in-out" />
               <style>{`
                  @keyframes fadeInOut { 0%, 100% { opacity: 0; } 25%, 75% { opacity: 1; } }
                  .animate-fade-in-out { animation: fadeInOut 8s infinite; }
               `}</style>
            </div>
          </Card>
        </section>

        <section>
          <h2 className="text-2xl md:text-3xl font-bold text-center text-text-primary">Best Sellers</h2>
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {bestSellers.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
        
        <section className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary">Explore Our Collections</h2>
            <p className="mt-3 text-text-secondary">Find your next favorite piece from our curated collections.</p>
            <Link to="/shop">
                <Button variant="secondary" size="lg" className="mt-6">View All Products</Button>
            </Link>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
