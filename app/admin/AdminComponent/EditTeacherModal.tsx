"use client";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { editUser } from "@/lib/store/slices/auth/authapi";

interface TeacherProfile {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  dateOfBirth?: string;
}

interface Teacher {
  _id: string;
  username: string;
  email: string;
  profile?: TeacherProfile;
}

interface EditTeacherModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teacher: Teacher | null;
  onTeacherUpdated: (updatedTeacher: Teacher) => void;
}

interface FormDataState {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
}

const EditTeacherModal = ({
  open,
  onOpenChange,
  teacher,
  onTeacherUpdated,
}: EditTeacherModalProps) => {
  const [formData, setFormData] = useState<FormDataState>({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (teacher) {
      setFormData({
        username: teacher.username || "",
        email: teacher.email || "",
        password: "",
        firstName: teacher.profile?.firstName || "",
        lastName: teacher.profile?.lastName || "",
        phone: teacher.profile?.phone || "",
        address: teacher.profile?.address || "",
      });
      setError("");
    }
  }, [teacher]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!teacher?._id) return;

    setIsLoading(true);
    setError("");

    try {
      const payload = {
        username: formData.username,
        email: formData.email,
        ...(formData.password && { password: formData.password }),
        profile: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          address: formData.address,
        },
      };

      const updatedTeacher = await editUser(teacher._id, payload); // API call
      onTeacherUpdated(updatedTeacher); // pass updated teacher to parent
      onOpenChange(false);

      setFormData({
        username: "",
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        phone: "",
        address: "",
      });
    } catch (err: any) {
      setError(err.message || "Failed to update teacher");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Edit Teacher Details
          </DialogTitle>
        </DialogHeader>

        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
                className="rounded-xl border-gray-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="rounded-xl border-gray-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                Password (leave blank to keep current)
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                className="rounded-xl border-gray-300"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className="rounded-xl border-gray-300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className="rounded-xl border-gray-300"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="rounded-xl border-gray-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                className="rounded-xl border-gray-300"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white"
            >
              {isLoading ? "Updating..." : "Update Teacher"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTeacherModal;
