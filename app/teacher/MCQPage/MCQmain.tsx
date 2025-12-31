"use client";

import { ChangeEvent, FC, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import MCQDisplay, { MCQ } from "./MCQDisplay";
import ClassSectionSelector from "./ClassSectionSelector";
import GenerationSettings from "./GenerationSettings";
import ContentInput from "./ContentInput";
import AlertMessages from "./AlertMessages";
import ActionButtons from "./ActionButtons";
import { generateMCQ, saveMCQ } from "@/lib/store/mcq/mcqapi";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";

interface FormData {
  class: string;
  section: string;
  subject: string;
  chapter: string;
  numberOfQuestions: string;
  platform: "text" | "pdf" | "";
  textContent: string;
  pdfFile: File | null;
  mcqDuration: string;
  classId: string;
}

interface MCQmainProps {
  setActiveTab: (tab: string) => void;
}

const MCQmain: FC<MCQmainProps> = ({ setActiveTab }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [formData, setFormData] = useState<FormData>({
    class: "",
    section: "",
    subject: "",
    chapter: "",
    numberOfQuestions: "",
    platform: "",
    textContent: "",
    pdfFile: null,
    mcqDuration: "30",
    classId: "",
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [generatedMCQs, setGeneratedMCQs] = useState<MCQ[]>([]);
  const [hasExported, setHasExported] = useState(false);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
    setSuccess(false);
    setSuccessMessage("");
    setHasExported(false);
  };

  const handleSelectChange = (name: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
    setSuccess(false);
    setSuccessMessage("");
    setHasExported(false);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file && file.type === "application/pdf") {
      setFormData((prev) => ({ ...prev, pdfFile: file }));
      setError("");
    } else {
      setFormData((prev) => ({ ...prev, pdfFile: null }));
      setError("Please select a valid PDF file");
    }
  };

  const validateForm = (): boolean => {
    if (!formData.class) return setError("Please select a class"), false;
    if (!formData.section) return setError("Please select a section"), false;
    if (!formData.subject) return setError("Please select a subject"), false;
    if (!formData.chapter) return setError("Please select a chapter"), false;
    if (!formData.numberOfQuestions)
      return setError("Please select number of questions"), false;
    if (!formData.platform) return setError("Please select a platform"), false;

    if (formData.platform === "text") {
      const wordCount = formData.textContent.trim().split(/\s+/).length;
      if (!formData.textContent.trim())
        return setError("Please provide text content"), false;
      if (wordCount < 50)
        return (
          setError(
            `Text content is too short. Minimum 50 words required (currently ${wordCount}).`
          ),
          false
        );
    }

    if (formData.platform === "pdf" && !formData.pdfFile)
      return setError("Please upload a PDF file"), false;

    if (
      !formData.mcqDuration ||
      isNaN(Number(formData.mcqDuration)) ||
      Number(formData.mcqDuration) <= 0
    )
      return setError("Please enter a valid MCQ duration (in minutes)."), false;

    return true;
  };

  const handleGenerateMCQ = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsGenerating(true);
    setError("");
    setSuccess(false);
    setSuccessMessage("");
    setGeneratedMCQs([]);
    setHasExported(false);

    try {
      const apiResponse =
        formData.platform === "text"
          ? await generateMCQ(
              formData.textContent,
              Number(formData.numberOfQuestions)
            )
          : await generateMCQ(
              formData.pdfFile!,
              Number(formData.numberOfQuestions)
            );

      if (!apiResponse?.success || !Array.isArray(apiResponse.data)) {
        setError(apiResponse?.message || "API returned invalid data.");
        return;
      }

      const transformed: MCQ[] = apiResponse.data.map(
        (mcq: any, index: number) => {
          const options: Record<"A" | "B" | "C" | "D", string> = {
            A: mcq.options[0]?.value || "",
            B: mcq.options[1]?.value || "",
            C: mcq.options[2]?.value || "",
            D: mcq.options[3]?.value || "",
          };

          const correctKey =
            (["A", "B", "C", "D"] as const).find(
              (key) =>
                options[key] === mcq.correct_answer ||
                options[key] === mcq.answer
            ) || "A";

          return {
            id: index + 1,
            question: mcq.question || "",
            options,
            correct_answer: correctKey,
            explanation: mcq.explanation || "",
          };
        }
      );

      setGeneratedMCQs(transformed);
      setSuccess(true);
      setSuccessMessage(
        `🎉 Successfully generated ${formData.numberOfQuestions} MCQ${
          Number(formData.numberOfQuestions) > 1 ? "s" : ""
        }!`
      );
    } catch (err: any) {
      setError(err.message || "Failed to generate MCQs.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportMCQs = async (updatedMCQs = generatedMCQs) => {
    if (!user) return setError("You must be logged in to export MCQs.");
    if (hasExported) return setError("You have already exported these MCQs.");
    if (updatedMCQs.length === 0) return setError("No MCQs to export.");
    if (!user._id) return setError("User ID is missing. Cannot export MCQs.");

    setIsExporting(true);
    setError("");
    setSuccess(false);
    setSuccessMessage("");

    try {
      const response = await saveMCQ(
        updatedMCQs,
        formData.classId,
        formData.section,
        user._id, // Now guaranteed to exist
        Number(formData.mcqDuration),
        formData.subject,
        formData.chapter
      );

      if (response.success) {
        setSuccess(true);
        setSuccessMessage(`Successfully exported ${response.savedCount} MCQs!`);
        setHasExported(true);
      } else {
        setError(response.message || "Export failed.");
      }
    } catch (err: any) {
      setError(err.message || "Export error occurred.");
    } finally {
      setIsExporting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      class: "",
      section: "",
      subject: "",
      chapter: "",
      numberOfQuestions: "",
      platform: "",
      textContent: "",
      pdfFile: null,
      mcqDuration: "30",
      classId: "",
    });
    setError("");
    setSuccess(false);
    setSuccessMessage("");
    setGeneratedMCQs([]);
    setHasExported(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-2">
            <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">MCQ Generator</h1>
          </div>
          <p className="text-gray-600">
            Generate multiple choice questions from text or PDF files
          </p>
        </div>

        <Card className="shadow-sm border border-gray-200">
          <CardHeader className="border-b border-gray-100 pb-4">
            <CardTitle className="text-xl font-semibold text-gray-900">
              Generation Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {user && (
              <ClassSectionSelector
                user={user}
                formData={formData}
                onSelectChange={handleSelectChange}
                isGenerating={isGenerating}
              />
            )}
            <GenerationSettings
              formData={formData}
              onSelectChange={handleSelectChange}
              onInputChange={handleInputChange}
              isGenerating={isGenerating}
            />
            <ContentInput
              formData={formData}
              onInputChange={handleInputChange}
              onFileChange={handleFileChange}
              isGenerating={isGenerating}
              isSetupNeeded={false}
            />
            <AlertMessages
              error={error}
              success={success}
              numberOfQuestions={formData.numberOfQuestions}
              successMessage={successMessage}
            />
            <ActionButtons
              onReset={resetForm}
              onGenerate={handleGenerateMCQ}
              isGenerating={isGenerating}
              isSetupNeeded={false}
            />
          </CardContent>
        </Card>

        <MCQDisplay
          mcqs={generatedMCQs}
          onExport={handleExportMCQs}
          isExporting={isExporting}
          hasExported={hasExported}
        />
      </div>
    </div>
  );
};

export default MCQmain;
