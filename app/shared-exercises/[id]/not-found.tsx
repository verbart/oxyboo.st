import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeftIcon, XCircleIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';

export default function NotFound() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <Link 
        href="/"
        className="inline-flex items-center mb-6 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
      >
        <ArrowLeftIcon className="w-4 h-4 mr-2" />
        Back to Home
      </Link>
      
      <Card className="border shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Exercise Not Found</CardTitle>
          <CardDescription>
            The exercise you're looking for doesn't exist or is no longer shared
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8">
            <XCircleIcon className="w-16 h-16 text-red-500 mb-4" />
            
            <h2 className="text-xl font-semibold mb-2 text-center">Exercise Not Available</h2>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-center max-w-md">
              The exercise you're looking for may have been removed, is no longer being shared, or the link is invalid.
            </p>
            
            <div className="text-center mt-2">
              <Link 
                href="/" 
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-center">
          <Link 
            href="https://apps.apple.com/us/app/oxyboost-apnea-trainer/id6739809272?platform=iphone"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              width={150}
              height={50}
              src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us"
              alt="Download on the App Store"
              className="dark:hidden"
            />
            <Image
              width={150}
              height={50}
              src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/white/en-us"
              alt="Download on the App Store"
              className="hidden dark:block"
            />
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
} 