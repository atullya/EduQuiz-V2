"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Plus, Trash2, Edit } from "lucide-react";
import AddClassModal from "./AddClassModal";
import ManageClassModal, { ClassFormData } from "./ManageClassModal";
import { RootState, AppDispatch } from "@/lib/store/store";
import { fetchClasses, deleteClass } from "@/lib/store/classes/classSlices";
import { classApi } from "@/lib/store/classes/classApi";

const ClassSegment = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { classes, loading } = useSelector((state: RootState) => state.class);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // CHANGED: We store the whole object now, not just ID
  const [selectedClass, setSelectedClass] = useState<any | null>(null);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchClasses());
  }, [dispatch]);

  // CHANGED: Accept the full class object
  const handleManageClick = (cls: any) => {
    setSelectedClass(cls); // Store the data
    setIsManageModalOpen(true);
  };

  const handleDeleteClass = (id: string) => {
    if (window.confirm("Are you sure you want to delete this class?")) {
      dispatch(deleteClass(id)).then(() => dispatch(fetchClasses()));
    }
  };

  const handleUpdateSuccess = async (updatedData: ClassFormData) => {
    if (!selectedClass?._id) return;

    try {
      await classApi.updateClass(selectedClass._id, {
        ...updatedData,
        teacher: updatedData.teacher ? { _id: updatedData.teacher } : undefined,
      });
      dispatch(fetchClasses());
      setIsManageModalOpen(false);
    } catch (error) {
      console.error("Failed to update class", error);
      alert("Failed to update class");
    }
  };

  return (
    <div className="p-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Classes</h1>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-purple-500 hover:bg-purple-600"
        >
          <Plus className="mr-2 h-4 w-4" /> Create Class
        </Button>
      </div>

      {loading && (
        <p className="text-center text-gray-600">Loading classes...</p>
      )}

      <div className="space-y-4">
        {classes.length > 0 ? (
          classes.map((cls) => (
            <Card key={cls._id} className="border border-gray-200">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 bg-purple-500 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{cls.name}</h3>
                      <div className="space-y-1 text-gray-700">
                        <p>
                          <strong>Grade:</strong> {cls.grade}
                        </p>
                        <p>
                          <strong>Section:</strong> {cls.section}
                        </p>
                        <p>
                          <strong>Room:</strong> {cls.roomNo}
                        </p>
                        <p>
                          <strong>Students:</strong> {cls.students?.length || 0}
                        </p>
                        <p>
                          <strong>Teacher:</strong>{" "}
                          {typeof cls.teacher === "object" &&
                          cls.teacher?.username
                            ? cls.teacher.username
                            : "No teacher assigned"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      // CHANGED: Pass the entire 'cls' object
                      onClick={() => handleManageClick(cls)}
                      className="border-purple-500 text-purple-500 hover:bg-purple-50"
                    >
                      <Edit className="mr-1 h-4 w-4" /> Manage
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleDeleteClass(cls._id!)}
                      className="border-red-500 text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="mr-1 h-4 w-4" /> Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-center text-gray-500 text-lg">
            No classes available
          </p>
        )}
      </div>

      <AddClassModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onClassAdded={() => dispatch(fetchClasses())}
      />

      {/* CHANGED: Pass selectedClass as initialData */}
      <ManageClassModal
        isOpen={isManageModalOpen}
        initialData={selectedClass}
        classId={selectedClass?._id || null}
        onClose={() => setIsManageModalOpen(false)}
        onSuccess={handleUpdateSuccess}
      />
    </div>
  );
};

export default ClassSegment;
