"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Plus,
  Mail,
  Phone,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  UserPlus,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store/store";
import { fetchClasses } from "@/lib/store/classes/classSlices";
import { classApi } from "@/lib/store/classes/classApi";
import { registerUser } from "@/lib/store/slices/auth/authapi";

interface TeacherProfile {
  firstName: string;
  lastName: string;
  phone: string;
  address?: string;
  class?: string;
  section?: string;
}

interface Teacher {
  _id: string;
  username: string;
  email: string;
  role: string;
  profile: TeacherProfile;
}

interface ClassType {
  _id: string;
  grade: string;
  section: string;
  teachers: string[];
}

interface AddTeacherModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTeacherAdded?: (teacher: Teacher) => void;
}

const AddTeacherModal = ({
  open,
  onOpenChange,
  onTeacherAdded,
}: AddTeacherModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { classes } = useSelector(
    (state: RootState) => state.class
  ) as unknown as {
    classes: ClassType[];
  };

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "teacher",
    profile: {
      firstName: "",
      lastName: "",
      phone: "",
      address: "",
      class: "",
      section: "",
    },
  });

  const [sections, setSections] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Fetch classes from Redux
  useEffect(() => {
    dispatch(fetchClasses());
  }, [dispatch]);

  const getSectionsForGrade = (selectedGrade: string) => {
    if (!selectedGrade || !classes.length) return [];
    const sectionsForGrade = classes
      .filter((cls) => cls.grade === selectedGrade)
      .map((cls) => cls.section);
    return [...new Set(sectionsForGrade)].sort();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.startsWith("profile.")) {
      const field = name.replace("profile.", "");
      setFormData((prev) => ({
        ...prev,
        profile: { ...prev.profile, [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    setError("");
  };

  const handleSelectChange = (name: string, value: string) => {
    if (name === "profile.class") {
      const availableSections = getSectionsForGrade(value);
      setSections(availableSections);

      setFormData((prev) => ({
        ...prev,
        profile: { ...prev.profile, class: value, section: "" },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        profile: { ...prev.profile, [name.replace("profile.", "")]: value },
      }));
    }
    setError("");
  };

  const generateUsername = () => {
    const firstName = formData.profile.firstName.toLowerCase();
    const lastName = formData.profile.lastName.toLowerCase();
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    setFormData((prev) => ({
      ...prev,
      username: `${firstName}.${lastName}${random}`,
    }));
  };

  const validateForm = () => {
    if (!formData.username.trim())
      return setError("Username is required"), false;
    if (!formData.email.trim()) return setError("Email is required"), false;
    if (!formData.password.trim())
      return setError("Password is required"), false;
    if (!formData.profile.firstName.trim())
      return setError("First name is required"), false;
    if (!formData.profile.lastName.trim())
      return setError("Last name is required"), false;
    if (!formData.profile.phone.trim())
      return setError("Phone is required"), false;
    if (!formData.profile.class) return setError("Select a class"), false;
    if (!formData.profile.section) return setError("Select a section"), false;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email))
      return setError("Invalid email format"), false;

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.profile.phone.replace(/\D/g, "")))
      return setError("Phone must be 10 digits"), false;

    if (formData.password.length < 6)
      return setError("Password must be at least 6 characters"), false;

    return true;
  };

  const resetForm = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      role: "teacher",
      profile: {
        firstName: "",
        lastName: "",
        phone: "",
        address: "",
        class: "",
        section: "",
      },
    });
    setSections([]);
    setError("");
    setSuccess(false);
    setShowPassword(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setError("");

    try {
      const teacher = await registerUser(formData);
      if (!teacher || !teacher._id) throw new Error("Teacher creation failed");

      // Assign teacher to class
      const selectedClass = classes.find(
        (cls) =>
          cls.grade === formData.profile.class &&
          cls.section === formData.profile.section
      );
      if (selectedClass) {
        await classApi.updateClass(selectedClass._id!, {
          teacher: { _id: teacher._id },
        });
      }

      setSuccess(true);
      setTimeout(() => {
        resetForm();
        onOpenChange(false);
        onTeacherAdded?.(teacher);
      }, 1500);
    } catch (err: unknown) {
      const errorMessage =
        (
          err as {
            response?: { data?: { message?: string } };
            message?: string;
          }
        ).response?.data?.message ||
        (err as { message?: string }).message ||
        "Failed to create teacher";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-5xl max-h-[95vh] overflow-y-auto bg-gradient-to-br from-blue-50 to-purple-50">
        <DialogHeader className="text-center pb-4">
          <DialogTitle className="text-xl font-semibold text-gray-900 flex items-center justify-center gap-2">
            <UserPlus className="h-5 w-5 text-blue-600" /> Add New Teacher
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Fill in the teacher's information to create their account
          </DialogDescription>
        </DialogHeader>

        {success && (
          <Alert className="border-green-200 bg-green-50 mb-4">
            <AlertCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Teacher account created successfully!
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
              Basic Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>First Name *</Label>
                <Input
                  name="profile.firstName"
                  value={formData.profile.firstName}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Last Name *</Label>
                <Input
                  name="profile.lastName"
                  value={formData.profile.lastName}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Email Address *</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label>Phone Number *</Label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    name="profile.phone"
                    value={formData.profile.phone}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Account Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
              Account Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Username *</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={generateUsername}
                    disabled={
                      !formData.profile.firstName ||
                      !formData.profile.lastName ||
                      isSubmitting
                    }
                  >
                    Generate
                  </Button>
                </div>
              </div>
              <div>
                <Label>Password *</Label>
                <div className="relative mt-1">
                  <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Academic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
              Academic Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Class *</Label>
                <Select
                  value={formData.profile.class}
                  onValueChange={(v: string) =>
                    handleSelectChange("profile.class", v)
                  }
                  disabled={isSubmitting}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {[...new Set(classes.map((cls) => cls.grade))].map(
                      (grade) => (
                        <SelectItem key={grade} value={grade}>
                          {grade}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Section *</Label>
                <Select
                  value={formData.profile.section}
                  onValueChange={(v: string) =>
                    handleSelectChange("profile.section", v)
                  }
                  disabled={isSubmitting || !formData.profile.class}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select section" />
                  </SelectTrigger>
                  <SelectContent>
                    {sections.map((section) => (
                      <SelectItem key={section} value={section}>
                        {section}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Optional Address */}
          <div className="space-y-4">
            <Label>Address</Label>
            <Input
              name="profile.address"
              value={formData.profile.address}
              onChange={handleInputChange}
              disabled={isSubmitting}
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                onOpenChange(false);
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" /> Create Teacher
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTeacherModal;
