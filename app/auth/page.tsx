"use client";
import { useRouter } from "next/navigation";

import { useState } from "react";
import { useDispatch } from "react-redux";
// import { loginUser } from "@/store/api/authApi"; // Axios login API
// import { loginSuccess, setLoading } from "@/store/slices/authSlice";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Loader2,
  Mail,
  Lock,
  GraduationCap,
  BookOpen,
  Users,
  Brain,
} from "lucide-react";
import { loginSuccess, setLoading } from "@/lib/store/slices/auth/authSlice";
import { loginUser } from "@/lib/store/slices/auth/authapi";

const LoginPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    dispatch(setLoading(true));

    try {
      // Call login API
      const data = await loginUser({ email, password });

      // Dispatch login success to Redux store
      dispatch(
        loginSuccess({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          user: {
            _id: data._id,
            email: data.email,
            username: data.username,
            role: data.role,
            profile: {},
          },
        })
      );

      setIsModalOpen(false);

      // Redirect based on role
      if (data.role === "teacher") router.push("/admin");
      else if (data.role === "admin") router.push("/admin");
      else if (data.role === "student")
        window.location.href = "/studentDashboard";
      else setError("Unknown role, please contact admin");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setIsLoading(false);
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">EduQuiz</span>
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button>Login</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogTitle className="sr-only">Login</DialogTitle>

                <Card className="border-0 shadow-none">
                  <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-4">
                      <div className="p-3 bg-blue-100 rounded-full">
                        <GraduationCap className="h-8 w-8 text-blue-600" />
                      </div>
                    </div>
                    <CardTitle className="text-2xl font-bold">
                      Welcome Back
                    </CardTitle>
                    <CardDescription>
                      Sign in to your account to continue
                    </CardDescription>
                  </CardHeader>

                  <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                      {error && (
                        <Alert variant="destructive">
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="email"
                            type="email"
                            name="email"
                            value={email}
                            placeholder="Enter your email"
                            required
                            className="pl-10"
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="password"
                            type="password"
                            name="password"
                            value={password}
                            placeholder="Enter your password"
                            required
                            className="pl-10"
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                          />
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="flex flex-col space-y-4 mt-6">
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Signing in...
                          </>
                        ) : (
                          "Sign In"
                        )}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-8">
        <div className="max-w-4xl text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6 text-balance">
            EduQuiz - Teacher Student Portal with MCQ Generation
          </h1>
          <p className="text-xl text-gray-600 mb-12 text-pretty max-w-3xl mx-auto">
            Streamline your educational experience with quiz generation,
            comprehensive dashboards for teachers and students, and intelligent
            assessment tools.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Brain className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                MCQ Generation
              </h3>
              <p className="text-gray-600">Smart quiz creation powered</p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <BookOpen className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Teacher Dashboard
              </h3>
              <p className="text-gray-600">
                Comprehensive tools to manage classes and assignments
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Student Portal
              </h3>
              <p className="text-gray-600">
                Interactive platform to take quizzes and track progress
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
