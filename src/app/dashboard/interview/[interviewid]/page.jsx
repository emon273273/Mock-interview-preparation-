"use client";
import { initializeDb } from "@/config/db";
import { MockInterview } from "@/utils/schema";
import React, { useEffect, useState } from "react";
import { eq } from "drizzle-orm";

function Interview({ params }) {
  const [db, setDb] = useState(null);
  const [interviewdata, setInterViewData] = useState([]);

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

  return (
    <div className="my-10 flex items-center justify-center flex-col">
      <h2 className="font-bold"> Let's Get Started</h2>
    </div>
  );
}

export default Interview;
