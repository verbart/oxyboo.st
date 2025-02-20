import { Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel } from '@/components/carousel';

const ParticlesComponent = dynamic(() => import('@/components/Particles'), {
  ssr: false
});

export default function Page() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <ParticlesComponent />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex flex-wrap gap-12 items-center justify-center">
          {/* Left Column - Content */}
          <div className="flex-1 text-left md:text-left min-w-[300px] text-center md:text-left">
            <div className="flex items-center gap-2 mb-6 justify-center md:justify-start">
              <Star className="w-5 h-5 text-blue-600"/>
              <span className="text-gray-600 dark:text-gray-400">Featured on App Store</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
              Master Your Breath with OxyBoost
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Train like a professional with our advanced apnea training app. Perfect for freedivers, athletes, and
              breathing enthusiasts
            </p>

            <div className="flex justify-center md:justify-start">
              <Link
                href="https://apps.apple.com/us/app/oxyboost-apnea-trainer/id6739809272?platform=iphone"
                className="inline-block"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  width={200}
                  height={67}
                  src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us"
                  alt="Download on the App Store"
                  className="dark:hidden"
                />

                <Image
                  width={200}
                  height={67}
                  src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/white/en-us"
                  alt="Download on the App Store"
                  className="hidden dark:block"
                />
              </Link>
            </div>
          </div>

          {/* Right Column - Carousel */}
          <div className="w-full max-w-xl">
            <Carousel />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Why Choose OxyBoost?</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Experience the most advanced apnea training app designed to help you achieve your breath-holding goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                title: 'Box Breathing',
                description: 'Four-square breathing technique for mental focus and relaxation'
              },
              {
                title: 'O2 Table',
                description: 'Progressive increase in breath hold time to improve oxygen efficiency'
              },
              {
                title: 'CO2 Table',
                description: 'Progressive decrease in breathing time to build CO2 tolerance'
              },
              {
                title: 'Custom Table',
                description: 'Create your own breath hold intervals for personalized training'
              },
              {
                title: 'Relaxation Table',
                description: 'Practice mindfulness and relaxation through steady breathing'
              },
              {
                title: 'Progress Tracking',
                description: 'Monitor your improvements with detailed statistics and analytics'
              }
            ].map((feature, index) => (
              <Card key={index} className="bg-white dark:bg-gray-800 border-0 shadow-lg">
                <CardContent className="p-6">
                  

                  <h3 className="flex items-center font-semibold text-xl mb-2 text-gray-900 dark:text-white">
                    <div className="w-8 h-8 mr-2 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center animate-pulse">
                      <div className="w-3 h-3 rounded-full bg-blue-600 dark:bg-blue-400" />
                    </div>

                    {feature.title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4">
        <div className="py-8 border-t border-gray-200 dark:border-gray-600 text-center text-gray-500">
          <p>© {new Date().getFullYear()} OxyBoost. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
