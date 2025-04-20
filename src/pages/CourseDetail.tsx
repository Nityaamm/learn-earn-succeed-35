import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Clock, 
  Calendar, 
  BarChart3, 
  Star, 
  Award, 
  Check, 
  PiggyBank, 
  Landmark
} from "lucide-react";

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  level: string;
  image: string;
  rating: number;
  duration: string;
  lessons: number;
  students: number;
  instructor: {
    name: string;
    title: string;
    image: string;
  };
  objectives: string[];
  prerequisites: string[];
  syllabus: {
    title: string;
    lessons: { title: string; duration: string }[];
  }[];
}

const coursesData: Record<string, Course> = {
  "1": {
    id: "1",
    title: "Python Programming Fundamentals",
    description: "Learn the foundations of Python programming in this comprehensive course. You'll start with the basics and progress to building complete applications. Python is one of the most versatile and in-demand programming languages in the world, used for everything from web development to data science and machine learning.",
    price: 6999,
    category: "Programming",
    level: "Beginner",
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&q=80&w=1200",
    rating: 4.8,
    duration: "6 weeks",
    lessons: 42,
    students: 1845,
    instructor: {
      name: "Dr. Alan Torres",
      title: "Senior Software Engineer & Educator",
      image: "https://i.pravatar.cc/150?img=3"
    },
    objectives: [
      "Understand Python syntax and basic programming concepts",
      "Work with Python data structures like lists, dictionaries, and tuples",
      "Create functions and use object-oriented programming principles",
      "Build real-world applications with Python",
      "Implement error handling and debugging techniques"
    ],
    prerequisites: [
      "No prior programming experience required",
      "Basic computer skills",
      "Computer with internet connection"
    ],
    syllabus: [
      {
        title: "Python Basics",
        lessons: [
          { title: "Introduction to Python", duration: "30 min" },
          { title: "Setting Up Your Environment", duration: "45 min" },
          { title: "Variables and Data Types", duration: "1 hr" },
          { title: "Basic Operations", duration: "1 hr" }
        ]
      },
      {
        title: "Control Structures",
        lessons: [
          { title: "Conditional Statements", duration: "1 hr" },
          { title: "Loops and Iterations", duration: "1.5 hrs" },
          { title: "Practice Exercises", duration: "2 hrs" }
        ]
      },
      {
        title: "Data Structures",
        lessons: [
          { title: "Lists and Arrays", duration: "1 hr" },
          { title: "Dictionaries", duration: "1 hr" },
          { title: "Sets and Tuples", duration: "1 hr" },
          { title: "Advanced Operations", duration: "1.5 hrs" }
        ]
      }
    ]
  },
  "2": {
    id: "2",
    title: "Web Development Bootcamp",
    description: "Master HTML, CSS, and JavaScript to create modern and responsive websites.",
    price: 8499,
    category: "Web Development",
    level: "Intermediate",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80&w=1200",
    rating: 4.9,
    duration: "10 weeks",
    lessons: 78,
    students: 2450,
    instructor: {
      name: "Sarah Johnson",
      title: "Full-Stack Developer",
      image: "https://i.pravatar.cc/150?img=5"
    },
    objectives: [
      "Build responsive websites with HTML5 and CSS3",
      "Create interactive web applications with JavaScript",
      "Implement modern frameworks like React",
      "Deploy websites to production servers",
      "Optimize websites for performance and SEO"
    ],
    prerequisites: [
      "Basic understanding of HTML and CSS",
      "Familiarity with basic programming concepts",
      "Computer with internet connection"
    ],
    syllabus: [
      {
        title: "HTML & CSS Foundations",
        lessons: [
          { title: "Modern HTML5 Structure", duration: "1 hr" },
          { title: "CSS Layout Systems", duration: "2 hrs" },
          { title: "Responsive Design Principles", duration: "1.5 hrs" }
        ]
      },
      {
        title: "JavaScript Essentials",
        lessons: [
          { title: "JavaScript Syntax", duration: "1 hr" },
          { title: "DOM Manipulation", duration: "2 hrs" },
          { title: "Event Handling", duration: "1.5 hrs" }
        ]
      },
      {
        title: "Frontend Frameworks",
        lessons: [
          { title: "Introduction to React", duration: "2 hrs" },
          { title: "Component-Based Architecture", duration: "1.5 hrs" },
          { title: "State Management", duration: "2 hrs" }
        ]
      }
    ]
  }
};

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const course = coursesData[id as string];
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isLoggedIn, userInfo } = useAuth();
  const [isEnrolled, setIsEnrolled] = React.useState(false);
  
  React.useEffect(() => {
    if (isLoggedIn && id) {
      const storedCourses = localStorage.getItem('enrolledCourses');
      if (storedCourses) {
        try {
          const parsedCourses = JSON.parse(storedCourses);
          const enrolled = parsedCourses.some((course: any) => course.id === parseInt(id));
          setIsEnrolled(enrolled);
        } catch (error) {
          console.error("Error parsing enrolled courses:", error);
        }
      }
    }
  }, [isLoggedIn, id]);

  const handleEnroll = () => {
    if (!isLoggedIn) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to enroll in a course",
        variant: "destructive"
      });
      navigate("/login");
      return;
    }

    if (isEnrolled) {
      navigate("/my-courses");
      return;
    }

    try {
      const storedCourses = localStorage.getItem('enrolledCourses');
      let enrolledCourses = [];
      
      if (storedCourses) {
        enrolledCourses = JSON.parse(storedCourses);
      }
      
      if (!enrolledCourses.some((c: any) => c.id === parseInt(id as string))) {
        enrolledCourses.push({
          id: parseInt(id as string),
          title: course.title,
          description: course.description,
          price: course.price,
          image: course.image,
          category: course.category
        });
        
        localStorage.setItem('enrolledCourses', JSON.stringify(enrolledCourses));
        
        toast({
          title: "Enrollment Successful!",
          description: `You are now enrolled in ${course.title}`,
        });
        
        setIsEnrolled(true);
      }
    } catch (error) {
      console.error("Error enrolling in course:", error);
      toast({
        title: "Enrollment Failed",
        description: "There was an error enrolling in this course",
        variant: "destructive"
      });
    }
  };

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container px-4 md:px-6 py-12 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
            <p className="mb-6">The course you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <a href="/courses">Browse Courses</a>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="bg-muted py-8">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="space-y-2">
                <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                  {course.category}
                </Badge>
                <h1 className="text-3xl font-bold">{course.title}</h1>
                <p className="text-muted-foreground">{course.description}</p>
              </div>

              <div className="flex items-center gap-4 mt-6">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{course.rating.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-muted-foreground" />
                  <span>{course.level}</span>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-4">
                <img 
                  src={course.instructor.image} 
                  alt={course.instructor.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium">{course.instructor.name}</p>
                  <p className="text-sm text-muted-foreground">{course.instructor.title}</p>
                </div>
              </div>
            </div>

            <div>
              <Card>
                <CardContent className="p-6">
                  <div className="relative aspect-video w-full mb-4 overflow-hidden rounded-lg">
                    <img 
                      src={course.image} 
                      alt={course.title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <Button variant="outline" className="bg-white text-black hover:bg-white/90">
                        Watch Preview
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-3xl font-bold">${course.price.toFixed(2)}</p>
                    <div className="mt-2 flex items-center gap-2 text-primary">
                      <PiggyBank className="h-5 w-5" />
                      <p className="font-medium">Performance-based refund available</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <Button 
                      className="w-full"
                      onClick={handleEnroll}
                      variant={isEnrolled ? "secondary" : "default"}
                    >
                      {isEnrolled ? "Go to My Course" : "Enroll Now"}
                    </Button>
                    
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{course.duration} course access</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-muted-foreground" />
                        <span>{course.lessons} lessons</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-muted-foreground" />
                        <span>Certificate upon completion</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Landmark className="h-4 w-4 text-muted-foreground" />
                        <span>{course.students.toLocaleString()} students enrolled</span>
                      </div>
                    </div>
                    
                    <div className="border-t pt-4">
                      <h3 className="font-medium mb-2">L-earnings Refund Policy</h3>
                      <p className="text-sm text-muted-foreground">
                        Score 90% on the final assessment? Get 90% of your money back!
                        The better you learn, the less you pay.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      <main className="flex-1 container px-4 md:px-6 py-12">
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
            <TabsTrigger value="instructor">Instructor</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="py-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div>
                  <h2 className="text-2xl font-bold mb-4">What You'll Learn</h2>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {course.objectives.map((objective, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary mt-0.5" />
                        <span>{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold mb-4">Requirements</h2>
                  <ul className="space-y-2">
                    {course.prerequisites.map((prerequisite, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span>{prerequisite}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-3">Course Includes</h3>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{course.duration} of on-demand video</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-muted-foreground" />
                        <span>{course.lessons} lessons</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <Award className="h-4 w-4 text-muted-foreground" />
                        <span>Certificate of completion</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <PiggyBank className="h-4 w-4 text-muted-foreground" />
                        <span>Performance-based refund</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-3">Share This Course</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" className="rounded-full">
                        <span className="sr-only">Share on Facebook</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4"
                        >
                          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                        </svg>
                      </Button>
                      <Button variant="outline" size="icon" className="rounded-full">
                        <span className="sr-only">Share on Twitter</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4"
                        >
                          <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                        </svg>
                      </Button>
                      <Button variant="outline" size="icon" className="rounded-full">
                        <span className="sr-only">Share on LinkedIn</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4"
                        >
                          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                          <rect width="4" height="12" x="2" y="9" />
                          <circle cx="4" cy="4" r="2" />
                        </svg>
                      </Button>
                      <Button variant="outline" size="icon" className="rounded-full">
                        <span className="sr-only">Share via Email</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4"
                        >
                          <rect width="20" height="16" x="2" y="4" rx="2" />
                          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                        </svg>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="curriculum" className="py-6">
            <h2 className="text-2xl font-bold mb-6">Course Content</h2>
            <div className="space-y-4">
              {course.syllabus.map((module, i) => (
                <div key={i} className="border rounded-lg overflow-hidden">
                  <div className="bg-muted p-4">
                    <h3 className="font-semibold">{module.title}</h3>
                  </div>
                  <ul className="divide-y">
                    {module.lessons.map((lesson, j) => (
                      <li key={j} className="p-4 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="rounded-full bg-primary/10 p-2">
                            <span className="text-xs font-medium text-primary">{j + 1}</span>
                          </div>
                          <span>{lesson.title}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{lesson.duration}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="instructor" className="py-6">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <img 
                  src={course.instructor.image} 
                  alt={course.instructor.name}
                  className="h-16 w-16 rounded-full object-cover"
                />
                <div>
                  <h2 className="text-2xl font-bold">{course.instructor.name}</h2>
                  <p className="text-muted-foreground">{course.instructor.title}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2">About the Instructor</h3>
                <p className="text-muted-foreground">
                  With over 10 years of industry experience, {course.instructor.name} has taught thousands of students 
                  worldwide. Their hands-on approach to teaching ensures students not only learn the concepts but 
                  also how to apply them in real-world scenarios.
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="reviews" className="py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold mb-6">Student Reviews</h2>
                <div className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="border-b pb-6">
                      <div className="flex items-center gap-3 mb-2">
                        <img 
                          src={`https://i.pravatar.cc/40?img=${i + 10}`} 
                          alt="Student"
                          className="h-10 w-10 rounded-full"
                        />
                        <div>
                          <p className="font-medium">Student {i}</p>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, j) => (
                              <Star 
                                key={j} 
                                className={`h-4 w-4 ${j < 5 - (i % 2) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-muted-foreground">
                        {i === 1 ? (
                          "This course was incredibly comprehensive and well-structured. The instructor explained complex concepts in an easy-to-understand way."
                        ) : i === 2 ? (
                          "I was able to apply what I learned immediately in my job. The performance-based refund model really motivated me to master the material."
                        ) : (
                          "One of the best courses I've taken. The examples were practical and the exercises reinforced the concepts well."
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <div className="bg-muted p-6 rounded-lg">
                  <h3 className="font-semibold mb-4">Rating Breakdown</h3>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <div key={rating} className="flex items-center gap-2">
                        <div className="w-12 text-sm">{rating} stars</div>
                        <div className="flex-1 h-2 bg-muted-foreground/20 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary" 
                            style={{ width: `${rating === 5 ? 70 : rating === 4 ? 20 : rating === 3 ? 8 : 2}%` }} 
                          ></div>
                        </div>
                        <div className="w-12 text-sm text-right">
                          {rating === 5 ? "70%" : rating === 4 ? "20%" : rating === 3 ? "8%" : "2%"}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6">
                    <div className="text-center">
                      <div className="text-5xl font-bold">{course.rating.toFixed(1)}</div>
                      <div className="flex items-center justify-center gap-1 my-2">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-5 w-5 ${i < Math.floor(course.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">Based on {course.students} reviews</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default CourseDetail;
