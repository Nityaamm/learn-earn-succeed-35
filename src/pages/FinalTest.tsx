
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Award, PiggyBank } from "lucide-react";

// Mock data - In a real app, this would come from your backend
const mockTests = {
  "1": {
    questions: [
      {
        id: 1,
        question: "What is React?",
        options: [
          "A JavaScript library for building user interfaces",
          "A programming language",
          "A database management system",
          "An operating system"
        ],
        correctAnswer: 0
      },
      {
        id: 2,
        question: "What hook is used for side effects in React?",
        options: [
          "useState",
          "useEffect",
          "useContext",
          "useReducer"
        ],
        correctAnswer: 1
      },
      {
        id: 3,
        question: "Which of the following is NOT a JavaScript data type?",
        options: [
          "String",
          "Boolean",
          "Integer",
          "Object"
        ],
        correctAnswer: 2
      },
      {
        id: 4,
        question: "What does JSX stand for?",
        options: [
          "JavaScript XML",
          "JavaScript Extension",
          "Java Syntax Extension",
          "JavaScript eXecution"
        ],
        correctAnswer: 0
      },
      {
        id: 5,
        question: "Which lifecycle method is called after a component renders?",
        options: [
          "componentWillMount",
          "componentDidMount",
          "componentWillUpdate",
          "componentDidUpdate"
        ],
        correctAnswer: 1
      }
    ]
  },
  "2": {
    questions: [
      {
        id: 1,
        question: "What is a closure in JavaScript?",
        options: [
          "A way to close browser windows",
          "A function that has access to variables in its outer lexical environment",
          "A method to terminate JavaScript execution",
          "A special type of object"
        ],
        correctAnswer: 1
      },
      {
        id: 2,
        question: "Which of these is not a JavaScript promise state?",
        options: [
          "Pending",
          "Fulfilled",
          "Rejected",
          "Executing"
        ],
        correctAnswer: 3
      },
      {
        id: 3,
        question: "What does the 'this' keyword refer to in JavaScript?",
        options: [
          "The current function",
          "The parent function",
          "The object the function is a method of",
          "The global window object"
        ],
        correctAnswer: 2
      },
      {
        id: 4,
        question: "Which array method does NOT modify the original array?",
        options: [
          "push()",
          "splice()",
          "map()",
          "sort()"
        ],
        correctAnswer: 2
      },
      {
        id: 5,
        question: "What is hoisting in JavaScript?",
        options: [
          "Raising exceptions",
          "Lifting variables and function declarations to the top of their scope",
          "Moving elements in the DOM",
          "A deprecated feature in ES6"
        ],
        correctAnswer: 1
      }
    ]
  },
  "3": {
    questions: [
      {
        id: 1,
        question: "What is the primary purpose of R programming language?",
        options: [
          "Web development",
          "Statistical computing and graphics",
          "Game development",
          "System programming"
        ],
        correctAnswer: 1
      },
      {
        id: 2,
        question: "Which package in R is used for creating visualizations?",
        options: [
          "dplyr",
          "tidyr",
          "ggplot2",
          "readr"
        ],
        correctAnswer: 2
      },
      {
        id: 3,
        question: "What function is used to read CSV files in R?",
        options: [
          "read.csv()",
          "import.csv()",
          "load.csv()",
          "get.csv()"
        ],
        correctAnswer: 0
      },
      {
        id: 4,
        question: "Which of the following is NOT a data structure in R?",
        options: [
          "Vector",
          "Matrix",
          "Dictionary",
          "Data Frame"
        ],
        correctAnswer: 2
      },
      {
        id: 5,
        question: "What is the purpose of the '%>%' operator in R?",
        options: [
          "Division",
          "Matrix multiplication",
          "Logical OR",
          "Pipe operator for chaining functions"
        ],
        correctAnswer: 3
      }
    ]
  },
  "4": {
    questions: [
      {
        id: 1,
        question: "What does UI stand for in UI/UX design?",
        options: [
          "User Interface",
          "User Interaction",
          "Usable Interface",
          "User Implementation"
        ],
        correctAnswer: 0
      },
      {
        id: 2,
        question: "Which of the following is a key principle of good UI design?",
        options: [
          "Making interfaces as complex as possible",
          "Using as many different colors as possible",
          "Consistency",
          "Avoiding white space"
        ],
        correctAnswer: 2
      },
      {
        id: 3,
        question: "What is the purpose of a wireframe in design?",
        options: [
          "To create the final visual design",
          "To outline the structure and layout",
          "To test the website performance",
          "To write the code for the website"
        ],
        correctAnswer: 1
      },
      {
        id: 4,
        question: "What is 'affordance' in UI design?",
        options: [
          "The cost of developing a UI",
          "A quality that indicates how an element should be used",
          "The time it takes to load a UI",
          "The number of elements on a screen"
        ],
        correctAnswer: 1
      },
      {
        id: 5,
        question: "What is the primary goal of user experience (UX) design?",
        options: [
          "To make websites look visually appealing",
          "To create the most technologically advanced websites",
          "To optimize user satisfaction",
          "To reduce development costs"
        ],
        correctAnswer: 2
      }
    ]
  },
  "5": {
    questions: [
      {
        id: 1,
        question: "What is the primary goal of digital marketing?",
        options: [
          "To increase website traffic",
          "To promote products or services through digital channels",
          "To create viral content",
          "To design websites"
        ],
        correctAnswer: 1
      },
      {
        id: 2,
        question: "What does SEO stand for?",
        options: [
          "Search Engine Optimization",
          "Search Engine Operation",
          "Search Enhancement Options",
          "Social Engagement Opportunities"
        ],
        correctAnswer: 0
      },
      {
        id: 3,
        question: "Which of the following is NOT a social media platform?",
        options: [
          "Instagram",
          "Twitter",
          "Facebook",
          "AdWords"
        ],
        correctAnswer: 3
      },
      {
        id: 4,
        question: "What is a key performance indicator (KPI) in marketing?",
        options: [
          "A type of marketing software",
          "A measurable value that demonstrates how effectively a company is achieving key business objectives",
          "A coding language for marketing websites",
          "A type of digital advertisement"
        ],
        correctAnswer: 1
      },
      {
        id: 5,
        question: "What is the purpose of A/B testing in marketing?",
        options: [
          "To test website security",
          "To compare two versions of something to determine which performs better",
          "To analyze competitor websites",
          "To create backup copies of marketing materials"
        ],
        correctAnswer: 1
      }
    ]
  },
  "6": {
    questions: [
      {
        id: 1,
        question: "What is machine learning?",
        options: [
          "A type of computer hardware",
          "The ability of computers to learn without being explicitly programmed",
          "A programming language",
          "A database management system"
        ],
        correctAnswer: 1
      },
      {
        id: 2,
        question: "Which of the following is a supervised learning algorithm?",
        options: [
          "K-means clustering",
          "Principal Component Analysis",
          "Linear Regression",
          "Association Rules"
        ],
        correctAnswer: 2
      },
      {
        id: 3,
        question: "What is an epoch in machine learning?",
        options: [
          "A type of neural network",
          "A complete pass through the entire training dataset",
          "A evaluation metric",
          "A programming error"
        ],
        correctAnswer: 1
      },
      {
        id: 4,
        question: "What is overfitting in machine learning?",
        options: [
          "When a model performs well on training data but poorly on unseen data",
          "When a model is too simple to capture patterns in the data",
          "When a model is trained on too much data",
          "When a model runs too slowly"
        ],
        correctAnswer: 0
      },
      {
        id: 5,
        question: "Which of the following is NOT a common machine learning algorithm?",
        options: [
          "Random Forest",
          "Neural Networks",
          "Support Vector Machines",
          "Sequential Markup"
        ],
        correctAnswer: 3
      }
    ]
  }
};

// Update mock course data with rupee prices
const mockCourses = {
  "1": { price: 4999, title: "Introduction to React" },
  "2": { price: 7499, title: "Advanced JavaScript Concepts" },
  "3": { price: 6499, title: "Data Science with R" },
  "4": { price: 4499, title: "UI/UX Design Principles" },
  "5": { price: 5999, title: "Digital Marketing Strategy" },
  "6": { price: 7499, title: "Machine Learning Fundamentals" }
};

const FinalTest = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const { toast } = useToast();
  const [answers, setAnswers] = React.useState<Record<number, number>>({});
  const [testCompleted, setTestCompleted] = React.useState(false);
  const [score, setScore] = React.useState(0);
  const [refundAmount, setRefundAmount] = React.useState(0);

  React.useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  const courseId = id || "1";
  const courseTitle = mockCourses[courseId as keyof typeof mockCourses]?.title || "Course";
  const coursePrice = mockCourses[courseId as keyof typeof mockCourses]?.price || 0;
  const testQuestions = mockTests[courseId as keyof typeof mockTests]?.questions || [];

  const handleSubmit = () => {
    const totalQuestions = testQuestions.length;
    const correctAnswers = testQuestions.reduce((acc, question) => {
      return answers[question.id] === question.correctAnswer ? acc + 1 : acc;
    }, 0);
    
    const scorePercentage = Math.round((correctAnswers / totalQuestions) * 100);
    const calculatedRefund = (scorePercentage / 100) * coursePrice;
    
    setScore(scorePercentage);
    setRefundAmount(calculatedRefund);
    setTestCompleted(true);
    
    // Save test results to localStorage
    try {
      // Get the enrolled courses
      const storedCoursesString = localStorage.getItem('enrolledCourses');
      let storedCourses = [];
      
      if (storedCoursesString) {
        storedCourses = JSON.parse(storedCoursesString);
      }
      
      // Update the course with test results
      const updatedCourses = storedCourses.map((course: any) => {
        if (course.id === courseId) {
          return {
            ...course,
            hasTakenTest: true,
            testScore: scorePercentage
          };
        }
        return course;
      });
      
      console.log("Updated courses after test:", updatedCourses);
      
      // Save the updated courses back to localStorage
      localStorage.setItem('enrolledCourses', JSON.stringify(updatedCourses));
      
      // Dispatch a storage event to notify other tabs/components
      window.dispatchEvent(new Event('storage'));
      
      toast({
        title: "Test completed!",
        description: `You scored ${scorePercentage}% and earned a refund of ₹${calculatedRefund.toFixed(2)}`,
      });
    } catch (error) {
      console.error("Error saving test results:", error);
      toast({
        title: "Error",
        description: "Failed to save your test results",
        variant: "destructive"
      });
    }
  };

  // Test summary screen
  if (testCompleted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Card className="max-w-3xl mx-auto glass hover-glow">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Test Completed!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-32 h-32 rounded-full bg-primary/10 mb-4">
                  {score >= 90 ? (
                    <Award className="h-16 w-16 text-primary" />
                  ) : (
                    <CheckCircle className="h-16 w-16 text-primary" />
                  )}
                </div>
                
                <h2 className="text-4xl font-bold mb-2">{score}%</h2>
                <p className="text-muted-foreground mb-6">Your final score</p>
                
                <div className="w-full max-w-md mb-4">
                  <Progress value={score} className="h-4" />
                </div>
                
                <div className="bg-muted p-6 rounded-lg w-full max-w-md text-center space-y-2">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <PiggyBank className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Your Refund</h3>
                  </div>
                  <p className="text-3xl font-bold">₹{refundAmount.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">
                    {score}% of your course fee (₹{coursePrice.toFixed(2)})
                  </p>
                  {score >= 90 && (
                    <p className="mt-2 text-sm font-medium text-primary">
                      Congratulations! You've earned a significant refund!
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button onClick={() => navigate(`/my-courses`)}>
                Back to My Courses
              </Button>
            </CardFooter>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  // Test questions screen
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Card className="max-w-3xl mx-auto glass hover-glow">
          <CardHeader>
            <CardTitle>{courseTitle}: Final Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {testQuestions.map((question, index) => (
              <div key={question.id} className="space-y-4">
                <h3 className="font-medium">
                  {index + 1}. {question.question}
                </h3>
                <RadioGroup
                  value={answers[question.id]?.toString()}
                  onValueChange={(value) =>
                    setAnswers((prev) => ({
                      ...prev,
                      [question.id]: parseInt(value)
                    }))
                  }
                >
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center space-x-2">
                      <RadioGroupItem value={optionIndex.toString()} id={`q${question.id}-${optionIndex}`} />
                      <Label htmlFor={`q${question.id}-${optionIndex}`}>{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ))}

            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm">
                <strong>Remember:</strong> Your test score determines your refund. Score 90% or higher to get up to 90% of your course fee back!
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleSubmit}
              className="w-full"
              disabled={Object.keys(answers).length !== testQuestions.length}
            >
              Submit Test
            </Button>
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default FinalTest;
