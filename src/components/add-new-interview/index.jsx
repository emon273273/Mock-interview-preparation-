"use client"
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuidv4 } from "uuid";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { chatSession } from "@/config/geminiAiModel";
import { LoaderCircle } from "lucide-react";
import { initializeDb } from "@/config/db";
import { MockInterview } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import moment from "moment";

const schema = z.object({
  jobRole: z.string().min(1, "Job role is required"),
  jobDescription: z.string().min(1, "Job description is required"),
  yearsOfExperience: z
    .number()
    .min(0, "Years of experience must be a positive number")
    .max(50, "Please enter a realistic value"),
});

function AddNewInterview() {
  const [open, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const [db, setDb] = useState(null);

  useEffect(() => {
    async function setupDb() {
      const initializedDb = await initializeDb();
      setDb(initializedDb);
    }
    setupDb();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    if (!db) {
      console.error("Database not initialized");
      return;
    }

    setLoading(true);

    const { jobRole, jobDescription, yearsOfExperience } = data;

    const inputPrompt = `Job Position: ${jobRole}, Job Description: ${jobDescription}, Years of Experience: ${yearsOfExperience}, Based on this information please give me ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT} Interview questions with Answers in JSON format, provide questions and answers as fields in JSON`;

    try {
      const result = await chatSession.sendMessage(inputPrompt);
      const finalResult = result.response.text().replace(/```json|```/g, "");
      
      let jsonResponse;
      try {
        jsonResponse = JSON.parse(finalResult);
      } catch (error) {
        console.error("Failed to parse JSON:", error);
        return;
      }

      if (jsonResponse) {
        const savedb = await db
          .insert(MockInterview)
          .values({
            mockId: uuidv4(),
            jsonMockResponse: JSON.stringify(jsonResponse),
            jobPosition: jobRole,
            jobDescription: jobDescription,
            jobExperience: yearsOfExperience,
            createdBy: user?.primaryEmailAddress?.emailAddress || "",
            createdAt: moment().format("DD-MM-yyyy"),
          })
          .returning({ mockId: MockInterview.mockId });

        console.log("Inserted: ", savedb);
        reset(); // Reset form after successful submission
      } else {
        console.log("Error, failed to insert");
      }
    } catch (error) {
      console.error("Error during submission:", error);
    } finally {
      setLoading(false);
      setOpenDialog(false);
    }
  };

  return (
    <div>
      <div
        className="border rounded-lg p-10 bg-secondary hover:scale-105 hover:shadow-md hover:cursor-pointer transition-all"
        onClick={() => setOpenDialog(true)}
      >
        <h2 className="text-lg text-center">+ Add New</h2>
      </div>

      <Dialog open={open} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Tell Us More About Your Job Interview
            </DialogTitle>
            <DialogDescription>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                  <h2>
                    Add Details About Your Job Position or Role, Job Description
                    and Years of Experience
                  </h2>
                </div>
                <div className="mt-7 my-3">
                  <label>Job Role / Job Position</label>
                  <Input
                    placeholder="Ex. Full Stack Developer"
                    {...register("jobRole")}
                  />
                  {errors.jobRole && (
                    <p className="text-red-500">{errors.jobRole.message}</p>
                  )}
                </div>
                <div className="mt-7 my-3">
                  <label>Job Description (In short)</label>
                  <Textarea
                    placeholder="Ex. React, Angular, Vue, Express, MySQL etc"
                    {...register("jobDescription")}
                  />
                  {errors.jobDescription && (
                    <p className="text-red-500">
                      {errors.jobDescription.message}
                    </p>
                  )}
                </div>
                <div className="mt-7 my-3">
                  <label>Years Of Experience</label>
                  <Input
                    placeholder="Ex. 2"
                    type="number"
                    {...register("yearsOfExperience", { valueAsNumber: true })}
                  />
                  {errors.yearsOfExperience && (
                    <p className="text-red-500">
                      {errors.yearsOfExperience.message}
                    </p>
                  )}
                </div>
                <div className="flex gap-5 justify-end mt-5">
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <LoaderCircle className="animate-spin mr-2" />
                        Generating from AI
                      </>
                    ) : (
                      "Start Interview"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => {
                      setOpenDialog(false);
                      reset();
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewInterview;