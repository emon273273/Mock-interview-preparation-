"use client";
import React from "react";
import { useEffect, useState } from "react";
import { initializeDb } from "@/config/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import Questions from "@/components/questions-section";
import RecordAnswer from "@/components/record-answer";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function StartInterview({ params }) {
  const [db, setDb] = useState(null);
  const [interviewdata, setInterviewData] = useState();
  const [mockinterviewquestions, setMockInterViewQuestions] = useState();
  const [activeInterviewquestions, setActiveInterViewQuestions] = useState(0);

  useEffect(() => {
    async function setupDb() {
      const initializedDb = await initializeDb();
      setDb(initializedDb);
    }
    setupDb();
  }, []);

  useEffect(() => {
    if (db) {
      getInterviewDetails();
    }
  }, [db, params]);

  const getInterviewDetails = async () => {
    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, params.interviewid));

    const jsonMockResponse = JSON.parse(result[0].jsonMockResponse);
    setMockInterViewQuestions(jsonMockResponse);
    console.log(jsonMockResponse);
    setInterviewData(result[0]);
  };
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Questions */}
        <Questions
          mockinterviewquestions={mockinterviewquestions}
          activeInterviewquestions={activeInterviewquestions}
        />
        {/* video/audio recording */}
        <RecordAnswer
          mockinterviewquestions={mockinterviewquestions}
          activeInterviewquestions={activeInterviewquestions}
          interviewdata={interviewdata}
        />
      </div>
      <div className="flex gap-6  my-2">
        {activeInterviewquestions > 0 && (
          <Button
            onClick={() => {
              setActiveInterViewQuestions(activeInterviewquestions - 1);
            }}
          >
            Previous Question
          </Button>
        )}
        {activeInterviewquestions != mockinterviewquestions?.length - 1 && (
          <Button
            onClick={() =>
              setActiveInterViewQuestions(activeInterviewquestions + 1)
            }
          >
            Next Question
          </Button>
        )}
        {activeInterviewquestions == mockinterviewquestions?.length-1 && (
          <Link href={`/dashboard/interview/${interviewdata?.mockId}/feedback`}>
            <Button>End Interview </Button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default StartInterview;
