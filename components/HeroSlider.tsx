
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HeroSlide } from '../types';
import Button from './Button';

interface HeroSliderProps {
  slides: HeroSlide[];
}

const HeroSlider: React.FC<HeroSliderProps> = ({ slides }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds
    return () => clearTimeout(timer);
  }, [currentIndex, slides.length]);

  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
  };

  if (!slides || slides.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full aspect-[16/7] overflow-hidden">
      {slides.map((slide, slideIndex) => (
        <div
          key={slide.id}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${
            slideIndex === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img src={slide.imageUrl} alt={slide.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center text-white p-4">
            <h1 className="text-4xl md:text-6xl font-bold font-poppins leading-tight drop-shadow-lg">
              {slide.title}
            </h1>
            <p className="mt-4 max-w-2xl text-lg drop-shadow-md">
              {slide.subtitle}
            </p>
            <Link to={slide.link}>
              <Button variant="primary" size="lg" className="mt-8">
                Shop Now
              </Button>
            </Link>
          </div>
        </div>
      ))}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex space-x-2">
        {slides.map((_, slideIndex) => (
          <button
            key={slideIndex}
            onClick={() => goToSlide(slideIndex)}
            className={`w-3 h-3 rounded-full transition-colors ${
              currentIndex === slideIndex ? 'bg-white' : 'bg-white/50'
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
