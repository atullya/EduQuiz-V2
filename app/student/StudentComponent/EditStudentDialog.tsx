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
import { useDispatch } from "react-redux";
import { editUser } from "@/lib/store/slices/auth/authapi";
import { loginSuccess } from "@/lib/store/slices/auth/authSlice";
import { useSelector } from "react-redux";
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

const EditStudentDialog: React.FC<EditProfileDialogProps> = ({
  open,
  onOpenChange,
  teacherId,
  existingData,
}) => {
  const [profileData, setProfileData] = useState<ProfileData>({
    profile: {
      firstName: "",
      lastName: "",
      phone: "",
    },
    email: "",
    password: "",
  });
  const dispatch = useDispatch();
  const [error, setError] = useState<string>("");
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
      setProfileData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  const currentUser = useSelector((state: any) => state.auth.user);
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await editUser(teacherId, profileData);

      const updatedUser = response.data;

      const mergedUser = {
        ...currentUser,
        ...updatedUser,
        profile: {
          ...currentUser.profile,
          ...updatedUser.profile,
        },
      };

      dispatch(
        loginSuccess({
          accessToken: localStorage.getItem("auth_token")!,
          refreshToken: localStorage.getItem("auth_refresh_token")!,
          user: mergedUser,
        })
      );

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

        <form onSubmit={handleProfileUpdate} className="space-y-5">
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

          <div>
            <Label>New Password</Label>
            <Input
              type="password"
              name="password"
              value={profileData.password}
              onChange={handleInputChange}
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex gap-3">
            <Button type="submit" className="flex-1">
              Save Changes
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditStudentDialog;
