"use client";
import React, { useEffect, useState } from "react";
import { initializeDb } from "@/config/db";
import { MockInterview, UserAnswer } from "@/utils/schema";
import { eq } from "drizzle-orm";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";


function FeedbackPage({ params }) {
  const [db, setDb] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const[totalrating,settotalrating]=useState(0);
  const [totalquestion,setTotalquestion]=useState(0);
  const router=useRouter();

  useEffect(() => {
    async function setupDb() {
      const initializedDb = await initializeDb();
      setDb(initializedDb);
    }
    setupDb();
  }, []);

  useEffect(() => {
    if (db) {
      getFeedback();
      
    }
  }, [db]);

  const getFeedback = async () => {
    try {
      const result = await db
        .select()
        .from(UserAnswer)
        .where(eq(UserAnswer.mockIdRef, params.interviewid))
        .orderBy(UserAnswer.id);

      console.log(result.length);
      setFeedback(result);
      const totalRating = result.reduce((acc, item) => acc + Number(item.rating || 0), 0);

      // Sum all ratings
      settotalrating(totalRating / result.length);
      setTotalquestion(result.length)
      
      
    } catch (error) {
      console.error("Error fetching feedback:", error);
    }
  };

  return (
    <div className="p-10">
      <h2 className="text-3xl font-bold text-green-500">Configuration!</h2>
      <h2 className="font-bold text-2xl">Here is your Interview Result</h2>
      <h2 className="text-primary text-lg my-3">
  Your Overall Rating <strong>{totalrating.toFixed(1)}/{totalquestion*5}</strong>
</h2>

      <h2 className="text-sm text-gray-500">
        Find Below Interview With Correct answer and feedback for improvement
      </h2>

      <div className="my-6">
        {feedback &&
          feedback.map((item, index) => {
            return (
              <Collapsible key={index} className="mt-7">
                <CollapsibleTrigger className="p-2 bg-secondary  my-2 text-left flex gap-7 justify-between w-full" >
                  {item.question} <ChevronsUpDown className="h-5  w-5"/>
                </CollapsibleTrigger >
                <CollapsibleContent>
                  <div className="flex flex-col gap-3">
                    <h2 className="text-red-500 p-2 border rounded-lg"><strong>Rating:</strong> {item?.rating}</h2>
                    <h2 className="bg-red-50 border rounded-lg text-sm p-2"><strong>Your Answer: </strong>{item.userAns}</h2>
                    <h2 className="bg-blue-50 border rounded-lg text-sm p-2 text-green-900"><strong>Correct Answer:  </strong>{item.correctAns}</h2>
                    <h2 className="bg-blue-50 border rounded-lg text-sm p-2 text-primary"><strong>Feedback:  </strong>{item.feedback}</h2>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
      </div>
      <Button onClick={()=>router.replace("/dashboard")}>Go Home</Button>
    </div>
  );
}

export default FeedbackPage;
