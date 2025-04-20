
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Award, Book, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EnrolledCourse {
  id: string;
  title: string;
  description: string;
  price: number;
  progress?: string;
  hasTakenTest?: boolean;
  testScore?: number;
  image: string;
  category: string;
}

const MyCourses = () => {
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const loadEnrolledCourses = () => {
    const storedCourses = localStorage.getItem('enrolledCourses');
    if (storedCourses) {
      try {
        const parsedCourses = JSON.parse(storedCourses);
        console.log("Loaded enrolled courses:", parsedCourses);
        setEnrolledCourses(parsedCourses);
      } catch (error) {
        console.error("Error parsing enrolled courses:", error);
        toast({
          title: "Error",
          description: "Failed to load your enrolled courses",
          variant: "destructive"
        });
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    loadEnrolledCourses();
    
    // Add event listener for storage events (when test is completed in another tab)
    window.addEventListener('storage', loadEnrolledCourses);
    
    return () => {
      window.removeEventListener('storage', loadEnrolledCourses);
    };
  }, []);

  const handleTestClick = (courseId: string) => {
    navigate(`/courses/${courseId}/test`);
  };

  const handleCourseDetailsClick = (courseId: string) => {
    navigate(`/courses/${courseId}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container px-4 md:px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Courses</h1>
          <p className="text-muted-foreground">Track your progress and take final tests</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p>Loading your courses...</p>
          </div>
        ) : enrolledCourses.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-4">No courses enrolled yet</h2>
            <Button onClick={() => navigate("/courses")}>Browse Courses</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map((course) => (
              <Card key={course.id} className="flex flex-col">
                <div className="aspect-video w-full overflow-hidden">
                  {course.image ? (
                    <img
                      src={course.image}
                      alt={course.title}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://placehold.co/600x400?text=Course+Image";
                      }}
                    />
                  ) : (
                    <img
                      src="https://placehold.co/600x400?text=Course+Image"
                      alt={course.title}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <CardHeader>
                  <CardTitle>{course.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-muted-foreground mb-4">{course.description}</p>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress</span>
                      <span>{course.progress || "0%"}</span>
                    </div>
                    <Progress value={parseInt(course.progress || "0")} />
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4 flex flex-col gap-3">
                  {course.hasTakenTest ? (
                    <div className="w-full text-center space-y-2">
                      <div className="flex items-center justify-center gap-2 text-primary">
                        <Award className="h-5 w-5" />
                        <span className="font-semibold">Test Score: {course.testScore}%</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Refund Earned: ₹{((course.testScore || 0) / 100 * course.price).toFixed(2)}
                      </p>
                    </div>
                  ) : (
                    <Button 
                      onClick={() => handleTestClick(course.id)} 
                      className="w-full"
                      variant="outline"
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Take Final Test
                    </Button>
                  )}
                  <Button 
                    onClick={() => handleCourseDetailsClick(course.id)} 
                    className="w-full"
                    variant="secondary"
                  >
                    <Book className="mr-2 h-4 w-4" />
                    Course Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default MyCourses;
