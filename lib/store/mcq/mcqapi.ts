import axiosClient from "../axiosClient";

export const generateMCQ = async (
  textOrFile: string | File,
  numQuestions: number
): Promise<any> => {
  const formData = new FormData();
  if (typeof textOrFile === "string") {
    formData.append("text_input", textOrFile);
  } else {
    formData.append("pdf_file", textOrFile);
  }
  formData.append("number_of_questions", numQuestions.toString());

  const res = await axiosClient.post("/api/mcq/generate", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};

export const saveMCQ = async (
  mcqs: any[],
  classId: string,
  section: string,
  teacherId: string,
  duration: number,
  subject: string,
  chapter: string
): Promise<any> => {
  try {
    const res = await axiosClient.post("/api/mcq/save", {
      mcqs,
      classId,
      section,
      teacherId,
      duration,
      subject,
      chapter,
    });

    return res.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "MCQ Saving failed");
  }
};

export const getMCQwithClasses = async (teacherId: string): Promise<any> => {
  try {
    const res = await axiosClient.get(
      `/api/mcq/classes-with-mcqs/${teacherId}`
    );
    return res.data;
  } catch (err: any) {
    throw new Error(
      err.response?.data?.message || "Fetching MCQ classes failed"
    );
  }
};
