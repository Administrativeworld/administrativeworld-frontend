import { useEffect, useState, useRef, useCallback } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Users, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react'

export default function Team() {
  const [team, setTeam] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [isPaused, setIsPaused] = useState(false)
  const [cardsToShow, setCardsToShow] = useState(1)
  const carouselRef = useRef(null)
  const autoPlayRef = useRef(null)
  const startXRef = useRef(0)
  const isDraggingRef = useRef(false)

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        setTeam([
          {
            "id": 1,
            "name": "Manisha Rani",
            "designation": "Founder",
            "tagline": "PhD in Public Administration University of Rajasthan, Jaipur ",
            "description": "Expertise Public Administration, Political Science, Indian History, World History, International Relations, Essay Writing, Ethics",
            "image": "https://res.cloudinary.com/dqvkbnrlu/image/upload/v1748925122/manisha_awhnre.png"
          },
          {
            "id": 2,
            "name": "Robin Poonia",
            "designation": "Software Engineer",
            "tagline": "MERN Stack Developer | DSA Enthusiast | Building Scalable Systems with LLD Expertise",
            "description": "I'm a passionate Software Engineer with hands-on experience in the MERN stack, strong foundations in Data Structures & Algorithms, and a deep understanding of Low-Level Design principles.",
            "image": "https://res.cloudinary.com/dqvkbnrlu/image/upload/v1748925120/robin_qfooik.png"
          },
          {
            "id": 3,
            "name": "Prashant Kumar",
            "designation": "Software Engineer",
            "tagline": "Full Stack Developer | Bridging Frontend & Backend | Scalable, End-to-End Web Solutions",
            "description": "I'm a versatile Full Stack Developer with experience across the entire web development lifecycle — from crafting responsive UIs to building robust backend systems.",
            "image": "https://res.cloudinary.com/dqvkbnrlu/image/upload/v1748925122/prashant_u552z9.png"
          },
          {
            "id": 4,
            "name": "Amit Kumar",
            "designation": "UI/UX Designer",
            "tagline": "Graphic Designer & Video Editor | Visual Storyteller | Crafting Impactful Designs & Dynamic Visual Content",
            "description": "I'm a creative Graphic Designer and Video Editor with a passion for bringing ideas to life through compelling visuals. From branding and social media creatives to motion graphics.",
            "image": "https://res.cloudinary.com/dqvkbnrlu/image/upload/v1748925120/amit_qm8no9.png"
          },
          {
            "id": 5,
            "name": "Dushyant Kumar",
            "designation": "Social Media Manager",
            "tagline": "Social Media Manager & Scriptwriter | Driving Engagement with Strategy and Storytelling",
            "description": "I'm a dynamic Social Media Manager and Scriptwriter who blends creative storytelling with data-driven strategy. From crafting compelling scripts for reels, ads, and content videos.",
            "image": "https://res.cloudinary.com/dqvkbnrlu/image/upload/v1748925122/dushyant_h3mnxp.png"
          },
          {
            "id": 6,
            "name": "Sunil Kumar",
            "designation": "Physics Teacher",
            "tagline": "Physics Educator | Inspiring Curiosity & Clarity in Science at Ad World",
            "description": "I'm a dedicated Physics Teacher at Ad World with a passion for making complex scientific concepts simple and engaging. Through interactive teaching methods and real-world examples.",
            "image": "https://res.cloudinary.com/dqvkbnrlu/image/upload/v1748926205/sunil_d68mij.png"
          },
          {
            "id": 7,
            "name": "Pranshu Singhai",
            "designation": "Manager",
            "tagline": "Team Manager | Driving Operational Excellence at Ad World",
            "description": "I'm a results-oriented Manager at Ad World, focused on streamlining operations, coordinating teams, and ensuring projects run smoothly from start to finish.",
            "image": "https://res.cloudinary.com/dqvkbnrlu/image/upload/v1748925121/pranshu_yietmf.png"
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchTeam()
  }, [])

  // Update cards to show based on screen size
  useEffect(() => {
    const updateCardsToShow = () => {
      if (window.innerWidth >= 1024) {
        setCardsToShow(3) // Desktop: 3 cards
      } else if (window.innerWidth >= 768) {
        setCardsToShow(2) // Tablet: 2 cards
      } else {
        setCardsToShow(1) // Mobile: 1 card
      }
    }

    updateCardsToShow()
    window.addEventListener('resize', updateCardsToShow)
    return () => window.removeEventListener('resize', updateCardsToShow)
  }, [])

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
  }

  const getPassionColor = (designation) => {
    const colors = {
      'Founder': 'border-purple-500 bg-gradient-to-br from-purple-50 to-purple-100',
      'Software Engineer': 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100',
      'UI/UX Designer': 'border-pink-500 bg-gradient-to-br from-pink-50 to-pink-100',
      'Social Media Manager': 'border-green-500 bg-gradient-to-br from-green-50 to-green-100',
      'Physics Teacher': 'border-orange-500 bg-gradient-to-br from-orange-50 to-orange-100',
      'Manager': 'border-indigo-500 bg-gradient-to-br from-indigo-50 to-indigo-100'
    }
    return colors[designation] || 'border-gray-500 bg-gradient-to-br from-gray-50 to-gray-100'
  }

  const nextSlide = useCallback(() => {
    if (team.length === 0) return
    setCurrentIndex((prev) => (prev + 1) % team.length)
  }, [team.length])

  const prevSlide = useCallback(() => {
    if (team.length === 0) return
    setCurrentIndex((prev) => (prev - 1 + team.length) % team.length)
  }, [team.length])

  const goToSlide = (index) => {
    setCurrentIndex(index)
  }

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying && !isPaused && team.length > 0) {
      autoPlayRef.current = setInterval(nextSlide, 4000)
    } else {
      clearInterval(autoPlayRef.current)
    }

    return () => clearInterval(autoPlayRef.current)
  }, [isAutoPlaying, isPaused, nextSlide, team.length])

  // Touch/Mouse events for swipe
  const handleStart = (clientX) => {
    startXRef.current = clientX
    isDraggingRef.current = false
    setIsPaused(true)
  }

  const handleMove = (clientX) => {
    if (Math.abs(clientX - startXRef.current) > 10) {
      isDraggingRef.current = true
    }
  }

  const handleEnd = (clientX) => {
    const diff = startXRef.current - clientX
    const threshold = 50

    if (isDraggingRef.current && Math.abs(diff) > threshold) {
      if (diff > 0) {
        nextSlide()
      } else {
        prevSlide()
      }
    }

    setTimeout(() => setIsPaused(false), 100)
    isDraggingRef.current = false
  }

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying)
  }

  const getVisibleCards = () => {
    if (team.length === 0) return []

    const cards = []
    for (let i = 0; i < cardsToShow; i++) {
      const index = (currentIndex + i) % team.length
      cards.push({ ...team[index], position: i })
    }
    return cards
  }

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Users className="h-6 w-6 sm:h-8 sm:w-8 mr-2 sm:mr-3 text-primary animate-pulse" />
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">Meet Our Team</h1>
          </div>
          <p className="text-lg sm:text-xl text-muted-foreground">Loading our amazing team...</p>
        </div>

        <div className="flex justify-center items-center gap-4">
          {/* Mobile: 1 card */}
          <div className="w-full max-w-sm bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl h-80 animate-pulse md:hidden" />

          {/* Tablet: 2 cards */}
          <div className="hidden md:flex lg:hidden gap-4 w-full max-w-4xl">
            {[0, 1].map((i) => (
              <div key={i} className="flex-1 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl h-80 animate-pulse" />
            ))}
          </div>

          {/* Desktop: 3 cards */}
          <div className="hidden lg:flex gap-4 w-full max-w-6xl">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex-1 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl h-80 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (team.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-8 text-center">
        <Users className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-xl sm:text-2xl font-bold mb-2">No Team Members Found</h2>
        <p className="text-muted-foreground">Please check back later.</p>
      </div>
    )
  }

  const visibleCards = getVisibleCards()

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 overflow-hidden">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Users className="h-6 w-6 sm:h-8 sm:w-8 mr-2 sm:mr-3 text-primary" />
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">Meet Our Team</h1>
        </div>
        <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto mb-6 px-2">
          Talented individuals working together to deliver exceptional results and drive innovation forward.
        </p>

        {/* Controls */}
        <div className="flex items-center justify-center space-x-4 flex-wrap gap-2 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleAutoPlay}
            className="flex items-center space-x-2 text-sm"
          >
            {isAutoPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            <span>{isAutoPlaying ? 'Pause' : 'Play'}</span>
          </Button>
          <span className="text-sm text-muted-foreground">
            {currentIndex + 1} of {team.length}
          </span>
        </div>
      </div>

      {/* Cards Display */}
      <div className="relative">
        {/* Navigation Buttons */}
        <Button
          variant="outline"
          size="icon"
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10  backdrop-blur-sm  shadow-lg rounded-full"
          onClick={prevSlide}
        >
          <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10  backdrop-blur-sm shadow-lg rounded-full"
          onClick={nextSlide}
        >
          <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>

        {/* Cards Container */}
        <div
          className={`
            flex justify-center items-center gap-4 px-8 sm:px-12 lg:px-16
            ${cardsToShow === 1 ? 'max-w-md mx-auto' : cardsToShow === 2 ? 'max-w-4xl mx-auto' : 'max-w-6xl mx-auto'}
          `}
          onMouseDown={(e) => handleStart(e.clientX)}
          onMouseMove={(e) => handleMove(e.clientX)}
          onMouseUp={(e) => handleEnd(e.clientX)}
          onMouseLeave={(e) => handleEnd(e.clientX)}
          onTouchStart={(e) => handleStart(e.touches[0].clientX)}
          onTouchMove={(e) => handleMove(e.touches[0].clientX)}
          onTouchEnd={(e) => handleEnd(e.changedTouches[0].clientX)}
        >
          {visibleCards.map((member, index) => (
            <Card
              key={`${member.id}-${currentIndex}`}
              className={`
                ${cardsToShow === 1 ? 'w-full' : 'flex-1'} 
                border-2 shadow-xl transition-all duration-500 ease-out cursor-pointer select-none rounded-2xl overflow-hidden
                ${getPassionColor(member.designation)}
                ${cardsToShow > 1 && index === Math.floor(cardsToShow / 2)
                  ? 'scale-105 shadow-2xl z-10 -translate-y-2'
                  : cardsToShow > 1 ? 'scale-95 opacity-90 hover:opacity-100 hover:scale-100' : ''
                }
              `}
              onClick={() => cardsToShow > 1 && index !== Math.floor(cardsToShow / 2) && goToSlide((currentIndex + index) % team.length)}
            >
              <div className="p-4 sm:p-6">
                {/* Avatar and Basic Info */}
                <div className="text-center mb-4">
                  <Avatar className={`${cardsToShow === 1 ? 'h-20 w-20 sm:h-24 sm:w-24' : 'h-16 w-16 sm:h-20 sm:w-20'} mx-auto mb-3 ring-4 ring-white shadow-lg`}>
                    <AvatarImage
                      src={member.image || ''}
                      alt={member.name}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm sm:text-lg font-semibold">
                      {getInitials(member.name)}
                    </AvatarFallback>
                  </Avatar>

                  <h3 className={`${cardsToShow === 1 ? 'text-xl sm:text-2xl' : 'text-lg sm:text-xl'} font-bold text-gray-900 mb-2 line-clamp-1`}>
                    {member.name}
                  </h3>

                  <Badge variant="secondary" className="text-xs sm:text-sm px-2 sm:px-3 py-1 mb-3">
                    {member.designation}
                  </Badge>
                </div>

                {/* Content */}
                <div className="space-y-3 text-center">
                  <p className={`${cardsToShow === 1 ? 'text-sm sm:text-base' : 'text-xs sm:text-sm'} font-medium text-gray-700 leading-relaxed line-clamp-2`}>
                    {member.tagline}
                  </p>

                  {cardsToShow === 1 && (
                    <div className="border-t border-gray-200 pt-3">
                      <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                        {member.description}
                      </p>
                    </div>
                  )}

                  {cardsToShow > 1 && (
                    <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                      {member.description.length > 60
                        ? `${member.description.substring(0, 60)}...`
                        : member.description
                      }
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center mt-6 space-x-2">
          {team.map((_, index) => (
            <button
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex
                ? 'bg-primary w-8'
                : 'bg-gray-300 hover:bg-gray-400 w-2'
                }`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      </div>

      {/* Team Stats */}
      <div className="mt-12 pt-8 border-t">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="p-4">
            <div className="text-2xl sm:text-3xl font-bold text-primary mb-2">{team.length}</div>
            <div className="text-sm sm:text-base text-muted-foreground">Team Members</div>
          </div>
          <div className="p-4">
            <div className="text-2xl sm:text-3xl font-bold text-primary mb-2">
              {new Set(team.map(m => m.designation)).size}
            </div>
            <div className="text-sm sm:text-base text-muted-foreground">Specializations</div>
          </div>
          <div className="p-4">
            <div className="text-2xl sm:text-3xl font-bold text-primary mb-2">100%</div>
            <div className="text-sm sm:text-base text-muted-foreground">Dedicated</div>
          </div>
        </div>
      </div>
    </div>
  )
}