import React, { useState } from "react";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import EditProfileDialog from "./EditStudentDialog";
import EditStudentDialog from "./EditStudentDialog";

interface UserProfile {
  phone: string | undefined;
  lastName: string | undefined;
  firstName: string | undefined;
  _id: string;
  username: string;
  role: string;
  profile?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
  };
  email?: string;
}

interface ProfileSectionProps {
  user: UserProfile;
}

const StudentProfile: React.FC<ProfileSectionProps> = ({ user }) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  if (!user) {
    return <div className="p-6 text-sm text-gray-500">Loading profile...</div>;
  }

  return (
    <div className="p-6 border-b border-gray-200/50">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
          {user.username?.charAt(0).toUpperCase()}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">
            {user.username}
          </p>
          <p className="text-xs text-gray-500 truncate">{user.role}</p>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="rounded-full"
          onClick={() => setIsEditDialogOpen(true)}
        >
          <Edit className="h-4 w-4" />
        </Button>
      </div>

      <EditStudentDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        teacherId={user._id}
        existingData={{
          email: user.email,
          profile: {
            firstName: user.profile?.firstName ?? "",
            lastName: user.profile?.lastName ?? "",
            phone: user.profile?.phone ?? "",
          },
        }}
      />
    </div>
  );
};

export default StudentProfile;
