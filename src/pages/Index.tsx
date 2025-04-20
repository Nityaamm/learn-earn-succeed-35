
import React from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import HowItWorks from '@/components/HowItWorks';
import FeaturedCourses from '@/components/FeaturedCourses';
import Testimonials from '@/components/Testimonials';
import Footer from '@/components/Footer';
import ChatbotButton from '@/components/ChatBot/ChatbotButton';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <HowItWorks />
        <FeaturedCourses />
        <Testimonials />
      </main>
      <ChatbotButton />
      <Footer />
    </div>
  );
};

export default Index;
