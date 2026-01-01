"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Clock, MapPin, BookOpen, User } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { classApi } from "@/lib/store/classes/classApi";

interface Teacher {
  name: string;
  email: string;
}

interface EnrolledClass {
  classId: string;
  className: string;
  section: string;
  grade: string;
  roomNo: string;
  time: string;
  schedule?: string[];
  studentCount: number;
  teacher?: Teacher;
}
interface MyClassesProps {
  setActiveTab: (tab: string) => void;
}
export default function MyClasses({ setActiveTab }: MyClassesProps) {
  const user = useSelector((state: RootState) => state.auth.user);
  const [classes, setClasses] = useState<EnrolledClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?._id) return;

    const fetchClasses = async () => {
      try {
        if (!user?._id) return;
        const data = await classApi.getStudentStats(user._id);
        setClasses(data.classes || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load classes.");
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [user?._id]);

  if (loading)
    return <p className="text-center text-gray-500">Loading classes...</p>;

  if (error) return <p className="text-center text-red-500">{error}</p>;

  if (!classes.length)
    return <p className="text-center text-gray-500">No classes found.</p>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">My Enrolled Classes</h2>

      <div className="grid gap-6">
        {classes.map((cls) => (
          <Card
            key={cls.classId}
            className="border shadow-sm hover:shadow-md transition"
          >
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold">{cls.className}</h3>

                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge>Grade {cls.grade}</Badge>
                    <Badge variant="outline">Section {cls.section}</Badge>
                  </div>

                  <div className="mt-3 space-y-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Users size={16} /> {cls.studentCount} students
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} /> {cls.time}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={16} /> Room {cls.roomNo}
                    </div>
                    {cls.schedule && (
                      <div className="flex items-center gap-2">
                        📅 {cls.schedule.join(", ")}
                      </div>
                    )}
                    {cls.teacher && (
                      <div className="flex items-center gap-2">
                        <User size={16} />
                        {cls.teacher.name} ({cls.teacher.email})
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
