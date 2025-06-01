import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { useEffect, useState, useCallback } from 'react';

const slideImages = [
  {
    url: "https://res.cloudinary.com/dqvkbnrlu/image/upload/v1748763681/5_xe6qcy.jpg",
    alt: "Expert Faculty"
  },
  {
    url: "https://res.cloudinary.com/dqvkbnrlu/image/upload/v1748763681/4_o8mbrz.jpg",
    alt: "Modern Facilities"
  },
  {
    url: "https://res.cloudinary.com/dqvkbnrlu/image/upload/v1748763680/3_djtgen.jpg",
    alt: "Success Stories"
  },
  {
    url: "https://res.cloudinary.com/dqvkbnrlu/image/upload/v1748763680/2_tx9ybt.jpg",
    alt: "Achievement Gallery"
  },
  {
    url: "https://res.cloudinary.com/dqvkbnrlu/image/upload/v1748763680/1_kqw6kr.jpg",
    alt: "Learning Environment"
  }
];

function Slider() {
  const [api, setApi] = useState(null);
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const scrollNext = useCallback(() => {
    if (api) {
      api.scrollNext();
    }
  }, [api]);

  useEffect(() => {
    if (!api) return;

    // Update current slide when carousel changes
    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });

    // Set initial current slide
    setCurrent(api.selectedScrollSnap());
  }, [api]);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setInterval(() => {
      scrollNext();
    }, 4000);

    return () => clearInterval(timer);
  }, [isAutoPlaying, scrollNext]);

  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  const goToSlide = (index) => {
    if (api) {
      api.scrollTo(index);
    }
  };

  return (
    <section className="w-full relative ">
      <Carousel
        setApi={setApi}
        className="w-full"
        opts={{
          align: "start",
          loop: true,
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <CarouselContent className="-ml-0">
          {slideImages.map((slide, index) => (
            <CarouselItem key={index} className="pl-0">
              <div className="relative w-full flex justify-center ">
                <img
                  src={slide.url}
                  alt={slide.alt}
                  className=" object-contain transition-transform duration-700 hover:scale-105"
                  loading={index === 0 ? "eager" : "lazy"}
                />
                {/* Optional gradient overlay for better text readability if needed later */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10 pointer-events-none" />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation Arrows */}
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 border-primary/20 bg-background/80 hover:bg-background text-foreground backdrop-blur-sm transition-all duration-300 hover:scale-110 shadow-lg" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 border-primary/20 bg-background/80 hover:bg-background text-foreground backdrop-blur-sm transition-all duration-300 hover:scale-110 shadow-lg" />
      </Carousel>

      {/* Dot Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
        {slideImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${current === index
              ? 'bg-primary scale-125 shadow-lg'
              : 'bg-muted-foreground hover:bg-primary/75'
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-muted">
        <div
          className="h-full bg-primary transition-all duration-1000 ease-linear"
          style={{
            width: `${((current + 1) / slideImages.length) * 100}%`,
          }}
        />
      </div>
    </section>
  );
}

export default Slider;