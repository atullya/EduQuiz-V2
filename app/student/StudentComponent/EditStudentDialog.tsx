import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { editUser } from "@/lib/store/slices/auth/authapi";

interface ProfileData {
  profile: {
    firstName: string;
    lastName: string;
    phone: string;
  };
  email: string;
  password: string;
}

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teacherId: string;
  existingData: {
    profile?: {
      firstName?: string;
      lastName?: string;
      phone?: string;
    };
    email?: string;
  };
}

const EditProfileDialog: React.FC<EditProfileDialogProps> = ({
  open,
  onOpenChange,
  teacherId,
  existingData,
}) => {
  const [profileData, setProfileData] = useState<ProfileData>({
    profile: { firstName: "", lastName: "", phone: "" },
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const isProduction = process.env.NODE_ENV === "production";

  useEffect(() => {
    if (open) {
      setProfileData({
        profile: {
          firstName: existingData.profile?.firstName || "",
          lastName: existingData.profile?.lastName || "",
          phone: existingData.profile?.phone || "",
        },
        email: existingData.email || "",
        password: "",
      });
    }
  }, [open, existingData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name.startsWith("profile.")) {
      const key = name.split(".")[1] as keyof ProfileData["profile"];
      setProfileData((prev) => ({
        ...prev,
        profile: { ...prev.profile, [key]: value },
      }));
    } else {
      setProfileData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await editUser(teacherId, profileData);
      onOpenChange(false);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Update failed");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your personal information
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>First Name</Label>
              <Input
                name="profile.firstName"
                value={profileData.profile.firstName}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <Label>Last Name</Label>
              <Input
                name="profile.lastName"
                value={profileData.profile.lastName}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div>
            <Label>Email</Label>
            <Input
              name="email"
              value={profileData.email}
              onChange={handleInputChange}
            />
          </div>

          {/* PASSWORD FIELD */}
          <div className="relative">
            <Label>New Password</Label>

            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              value={profileData.password}
              onChange={handleInputChange}
              className="pr-10"
            />

            <button
              type="button"
              disabled={isProduction}
              onClick={() => {
                if (!isProduction) setShowPassword(!showPassword);
              }}
              className={`absolute right-3 top-6
                ${
                  isProduction
                    ? "cursor-not-allowed text-gray-300"
                    : "text-gray-500 hover:text-gray-700"
                }
              `}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex gap-3">
            <Button type="submit" className="flex-1">
              Save Changes
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
