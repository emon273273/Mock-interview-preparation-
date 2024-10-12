"use client";
import { initializeDb } from "@/config/db";
import { MockInterview } from "@/utils/schema";
import React, { useEffect, useState } from "react";
import { eq } from "drizzle-orm";
import { Lightbulb, WebcamIcon } from "lucide-react";
import Webcam from "react-webcam";
import { Button } from "@/components/ui/button";
import Link from "next/link";


function Interview({ params }) {
    
  const [db, setDb] = useState(null);
  const [interviewdata, setInterViewData] = useState([0]);
  const [webCamEnagble, setWebCamEnable] = useState(false);

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

    // console.log(result);
    setInterViewData(result);
    console.log(result);
  };
  console.log(interviewdata);
  return (
    <div>
      <h2 className="font-bold text-2xl mb-5">Let's Get Started</h2>

      {/* Grid layout for webcam and description */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Camera/Webcam Part */}
        <div className="my-7">
          {webCamEnagble ? (
            <Webcam
              onUserMedia={() => setWebCamEnable(true)}
              onUserMediaError={() => setWebCamEnable(false)}
              style={{
                height: 400,
                width: 700,
              }}
              mirrored={true}
            />
          ) : (
            <WebcamIcon className="h-72 w-full p-10 bg-secondary rounded-lg border" />
          )}
          {/* Enable/Disable Button */}
          <div className="mt-5">
            {!webCamEnagble ? (
              <Button onClick={() => setWebCamEnable(true)}>
                Enable Camera And Microphone
              </Button>
            ) : (
              <Button onClick={() => setWebCamEnable(false)}>
                Disable Camera And Microphone
              </Button>
            )}
            <Link href={`/dashboard/interview/${params.interviewid}/start`}><Button disabled={!webCamEnagble}>Start interview</Button></Link>
          </div>
        </div>

        {/* Description Part */}
        <div className="flex flex-col justify-center my-5 gap-5 ">
          <div className=" flex flex-col  gap-5 p-5 border rounded-lg">
            <h2 className="text-lg">
              <strong>Job Role/ Job Position: </strong>
              {interviewdata[0].jobPosition}
            </h2>
            <h2 className="text-lg">
              <strong>Job Description/ Tech Stack: </strong>
              {interviewdata[0].jobDescription}
            </h2>
            <h2 className="text-lg">
              <strong>Job Experience: </strong>
              {interviewdata[0].jobExperience}
            </h2>
          </div>
          {/* info */}
          <div className="p-5 border rounded-lg border-yellow-300 bg-yellow-100">
            <h2 className="flex items-center gap-2 text-yellow-500">
              <Lightbulb />
              <strong>Information</strong>
            </h2>
            <h2 className="mt-2">
              Enable Video Web Cam and Microphone to Start your Al Generated
              Mock Interview, It Has 5 question which you can answer and at the
              last you will get the report on the basis of your answer. NOTE: We
              never record your video, Web cam access you can disable at any
              time if you want
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Interview;
