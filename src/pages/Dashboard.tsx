
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { Button } from "@/components/ui/button";
import { FileText, Book, Award, PiggyBank, Layout } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { isLoggedIn, userInfo } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State for dashboard data
  const [enrolledCoursesCount, setEnrolledCoursesCount] = React.useState(0);
  const [completedCoursesCount, setCompletedCoursesCount] = React.useState(0);
  const [totalRefund, setTotalRefund] = React.useState(0);
  const [avgTestScore, setAvgTestScore] = React.useState(0);
  const [recentActivity, setRecentActivity] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  
  // Chart data state
  const [chartData, setChartData] = React.useState([
    { name: "Completed", value: 0 },
    { name: "In Progress", value: 0 },
  ]);
  
  const COLORS = ["#10b981", "#6366f1"];

  React.useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    
    // Load dashboard data
    loadDashboardData();
    
    // Set up event listener for storage changes (course enrollments or test completions)
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [isLoggedIn, navigate]);
  
  const handleStorageChange = () => {
    console.log("Storage changed, reloading dashboard data");
    loadDashboardData();
  };
  
  const loadDashboardData = () => {
    try {
      setLoading(true);
      // Get enrolled courses from localStorage
      const storedCoursesString = localStorage.getItem('enrolledCourses');
      
      if (storedCoursesString) {
        const storedCourses = JSON.parse(storedCoursesString);
        console.log("Dashboard loaded courses:", storedCourses);
        
        // Calculate metrics
        const enrolled = storedCourses.length;
        const completed = storedCourses.filter((course) => course.hasTakenTest).length;
        
        // Calculate total refund and average test score
        let totalRefundAmount = 0;
        let totalScoreSum = 0;
        let testsTaken = 0;
        
        storedCourses.forEach((course) => {
          if (course.hasTakenTest && course.testScore !== null) {
            // Get course price
            const coursePrice = course.price || 0;
            
            // Calculate refund based on score percentage (score% of course price)
            const refundAmount = (course.testScore / 100) * coursePrice;
            totalRefundAmount += refundAmount;
            
            // Add to score sum for average calculation
            totalScoreSum += course.testScore;
            testsTaken++;
          }
        });
        
        // Calculate average test score
        const avgScore = testsTaken > 0 ? Math.round(totalScoreSum / testsTaken) : 0;
        
        // Update state
        setEnrolledCoursesCount(enrolled);
        setCompletedCoursesCount(completed);
        setTotalRefund(totalRefundAmount);
        setAvgTestScore(avgScore);
        
        // Update chart data
        setChartData([
          { name: "Completed", value: completed },
          { name: "In Progress", value: enrolled - completed },
        ]);
        
        // Generate recent activity
        const activities = [];
        
        // Add test completions
        const testCompletions = storedCourses
          .filter((course) => course.hasTakenTest)
          .map((course) => ({
            icon: FileText,
            title: "Completed Final Test",
            subtitle: course.title,
            detail: `Score: ${course.testScore}%`,
            time: "Recently"
          }));
        
        // Add course enrollments
        const enrollments = storedCourses.map((course) => ({
          icon: Book,
          title: "Enrolled in Course",
          subtitle: course.title,
          time: "Recently"
        }));
        
        // Add refund information
        const refunds = storedCourses
          .filter((course) => course.hasTakenTest)
          .map((course) => ({
            icon: PiggyBank,
            title: "Refund Processed",
            subtitle: course.title,
            detail: `Amount: ₹${((course.testScore / 100) * (course.price || 0)).toFixed(2)}`,
            time: "Recently"
          }));
        
        // Combine and sort activities
        setRecentActivity([...testCompletions, ...enrollments, ...refunds].slice(0, 5));
      } else {
        // No enrolled courses
        setEnrolledCoursesCount(0);
        setCompletedCoursesCount(0);
        setTotalRefund(0);
        setAvgTestScore(0);
        setChartData([
          { name: "Completed", value: 0 },
          { name: "In Progress", value: 0 },
        ]);
        setRecentActivity([]);
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Also update when the component is mounted
  useEffect(() => {
    loadDashboardData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {userInfo?.name || "Student"}!</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button onClick={() => navigate("/my-courses")}>
              <Layout className="mr-2 h-4 w-4" />
              My Courses
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p>Loading your dashboard...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[
                { icon: Book, title: "Enrolled Courses", value: enrolledCoursesCount },
                { icon: Award, title: "Completed Courses", value: completedCoursesCount },
                { icon: FileText, title: "Average Test Score", value: `${avgTestScore}%` },
                { icon: PiggyBank, title: "Total Refund", value: `₹${totalRefund.toFixed(2)}` }
              ].map((item, index) => (
                <Card key={index} className="glass hover-scale hover-glow animate-scale-in">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <item.icon className="h-5 w-5 text-primary mr-2" />
                      <div className="text-2xl font-bold">{item.value}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-1 glass hover-glow">
                <CardHeader>
                  <CardTitle>Progress Overview</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                        label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2 glass hover-glow">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.length > 0 ? (
                      recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0 transition-all duration-200 hover:bg-white/5 p-4 rounded-lg">
                          <div className="rounded-full bg-primary/10 p-2">
                            <activity.icon className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{activity.title}</p>
                            <p className="text-sm text-muted-foreground">{activity.subtitle}</p>
                            {activity.detail && (
                              <p className="text-sm text-muted-foreground">{activity.detail}</p>
                            )}
                          </div>
                          <div className="ml-auto text-sm text-muted-foreground">
                            {activity.time}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No recent activity</p>
                        <Button 
                          variant="outline" 
                          onClick={() => navigate("/courses")} 
                          className="mt-4"
                        >
                          Browse Courses
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
