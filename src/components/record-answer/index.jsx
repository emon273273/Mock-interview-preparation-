import { Mic, WebcamIcon } from "lucide-react";
import React from "react";
import Webcam from "react-webcam";
import { Button } from "../ui/button";
import useSpeechToText from "react-hook-speech-to-text";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { chatSession } from "@/config/geminiAiModel";
import { initializeDb } from "@/config/db";
import { UserAnswer } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import moment from "moment";

function RecordAnswer({
  mockinterviewquestions,
  activeInterviewquestions,
  interviewdata,
}) {
  const [useranswer, setUserAnswer] = useState("");
  const [db, setDb] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    async function setupDb() {
      const initializedDb = await initializeDb();
      setDb(initializedDb);
    }
    setupDb();
  }, []);
  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
    timeout: false,
  });

  useEffect(() => {
    results.map((result) => {
      return setUserAnswer((prevans) => prevans + result?.transcript);
    });
  }, [results]);

  useEffect(() => {
    if (!isRecording && useranswer.length > 10) {
      updateuserAnswer();
    }
  }, [useranswer]);
  const saveUserAnswer = async () => {
    if (isRecording) {
      stopSpeechToText();
    } else {
      startSpeechToText();
    }
  };

  const updateuserAnswer = async () => {
    console.log(useranswer);
    setLoading(true);

    const feedbackPrompt =
      "Question:" +
      mockinterviewquestions[activeInterviewquestions]?.question +
      ",User Answer :" +
      useranswer +
      ", Depends on question and use answer for give interview question" +
      " Please Give us rating for answer and feedback as area of improvement if any." +
      " In just 3 to 5 lines to improve it in JSON format with rating field and feedback field";

    const result = await chatSession.sendMessage(feedbackPrompt);
    const mockJsonResponse = result.response.text().replace(/```json|```/g, "");
    console.log(mockJsonResponse);
    const jsonFeedBackResponse = JSON.parse(mockJsonResponse);

    const resp = await db.insert(UserAnswer).values({
      mockIdRef: interviewdata?.mockId,
      question: mockinterviewquestions[activeInterviewquestions]?.question,
      correctAns: mockinterviewquestions[activeInterviewquestions]?.answer,
      userAns: useranswer,
      feedback: jsonFeedBackResponse?.feedback,
      rating: jsonFeedBackResponse?.rating,
      userEmail: user?.primaryEmailAddress?.emailAddress,
      createdAt: moment().format("DD-MM-yyyy"),
    });
    if (resp) {
      toast("User Answer Recorded successfully");
      setResults([]);
    }
    setResults([])
    setUserAnswer("");
    setLoading(false);
  };

  return (
    <>
      <div className=" flex items-center justify-center flex-col">
        <div className="flex flex-col justify-center items-center bg-secondary rounded-lg p-5 mt-20 gap-10 bg-black">
          {/* <div>
            <WebcamIcon
              className="w-52 h-52 "
              mirrored={true}
              style={{
                height: 300,
                width: 300,
                zIndex: 10,
              }}
            />
          </div> */}
          <Webcam />
        </div>
        <Button
          className="my-10 mx-10"
          onClick={saveUserAnswer}
          disabled={loading}
        >
          {isRecording ? (
            <h2 className="text-red-500 flex gap-2">
              <Mic /> Stop Recording...
            </h2>
          ) : (
            <h2>Record Answer</h2>
          )}
        </Button>
        <Button onClick={() => console.log(useranswer)}>Show My Answer</Button>
      </div>
    </>
  );
}

export default RecordAnswer;
