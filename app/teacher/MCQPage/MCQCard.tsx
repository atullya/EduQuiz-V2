import { FC } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface MCQCardProps {
  mcq: {
    id: number;
    question: string;
    options: Record<"A" | "B" | "C" | "D", string>;
    correct_answer: "A" | "B" | "C" | "D" | string;
    explanation?: string;
    question_type?: string;
  };
}

const MCQCard: FC<MCQCardProps> = ({ mcq }) => {
  return (
    <Card className="border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-white">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Badge className="bg-blue-100 text-blue-800 mt-1">Q{mcq.id}</Badge>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {mcq.question}
              </h3>
              {mcq.question_type && (
                <Badge variant="outline" className="mb-3">
                  {mcq.question_type}
                </Badge>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-12">
            {Object.entries(mcq.options).map(([key, value]) => (
              <div
                key={key}
                className={`p-3 rounded-lg border-2 ${
                  key === mcq.correct_answer
                    ? "border-green-300 bg-green-50"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                <p className="text-gray-800">
                  <strong>{key}.</strong> {value}
                </p>
                {key === mcq.correct_answer && (
                  <Badge className="bg-green-100 text-green-800 text-xs mt-1">
                    Correct Answer
                  </Badge>
                )}
              </div>
            ))}
          </div>
          {mcq.explanation && (
            <div className="ml-12 mt-3 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Explanation:</strong> {mcq.explanation}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MCQCard;
