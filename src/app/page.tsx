"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileDown } from "lucide-react";
import DocumentGenerator from "@/components/DocumentGenerator";

// Predefined education and certification data
const predefinedData = {
  education: `Pace University, New York | May 2024
Master of Science, Computer Science

SRM University, India | May 2022
Bachelors in Electronics and Communication engineering`,
  certifications: "AWS Certified Solutions Architect - Associate",
};

const ResumePreview = ({ data }) => {
  return (
    <div className="p-8 bg-white">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">
          {data.personalInfo.name || "Your Name"}
        </h1>
        <p className="mt-2">
          {data.personalInfo.location}{" "}
          {data.personalInfo.location && data.personalInfo.phone && "|"}{" "}
          {data.personalInfo.phone}{" "}
          {data.personalInfo.phone && data.personalInfo.email && "|"}{" "}
          {data.personalInfo.email}
          {data.personalInfo.linkedin && (
            <>
              {" "}
              |{" "}
              <a href={data.personalInfo.linkedin} className="text-blue-600">
                {data.personalInfo.linkedin}
              </a>
            </>
          )}
        </p>
      </div>

      {/* Summary Points */}
      {data.summaryPoints && (
        <div className="mb-6">
          {data.summaryPoints
            .split("\n")
            .filter((point) => point.trim())
            .map((point, index) => (
              <div key={index} className="flex mb-2">
                <span className="mr-2">●</span>
                <p>{point}</p>
              </div>
            ))}
        </div>
      )}

      {/* Technical Skills */}
      {data.technicalSkills && (
        <div className="mb-6">
          <h2 className="text-lg font-bold uppercase border-b-2 border-gray-300 mb-3">
            TECHNICAL SKILLS:
          </h2>
          {data.technicalSkills
            .split("\n")
            .filter((skill) => skill.trim())
            .map((skill, index) => (
              <div key={index} className="mb-1">
                {skill}
              </div>
            ))}
        </div>
      )}

      {/* Work Experience */}
      {data.workExperience && (
        <div className="mb-6">
          <h2 className="text-lg font-bold uppercase border-b-2 border-gray-300 mb-3">
            WORK EXPERIENCE:
          </h2>
          {data.workExperience
            .split("\n\n")
            .filter((exp) => exp.trim())
            .map((exp, index) => (
              <div key={index} className="mb-6">
                {exp.split("\n").map((line, lineIndex) => (
                  <div
                    key={lineIndex}
                    className={lineIndex === 0 ? "font-bold" : "flex"}
                  >
                    {lineIndex > 0 && <span className="mr-2">●</span>}
                    {line}
                  </div>
                ))}
              </div>
            ))}
        </div>
      )}

      {/* Projects */}
      {data.projects && (
        <div className="mb-6">
          <h2 className="text-lg font-bold uppercase border-b-2 border-gray-300 mb-3">
            PERSONAL PROJECTS:
          </h2>
          {data.projects
            .split("\n\n")
            .filter((project) => project.trim())
            .map((project, index) => (
              <div key={index} className="mb-4">
                {project.split("\n").map((line, lineIndex) => (
                  <div
                    key={lineIndex}
                    className={lineIndex === 0 ? "font-bold" : "flex"}
                  >
                    {lineIndex > 0 && <span className="mr-2">●</span>}
                    {line}
                  </div>
                ))}
              </div>
            ))}
        </div>
      )}

      {/* Education (Predefined) */}
      <div className="mb-6">
        <h2 className="text-lg font-bold uppercase border-b-2 border-gray-300 mb-3">
          EDUCATION:
        </h2>
        {predefinedData.education
          .split("\n\n")
          .filter((edu) => edu.trim())
          .map((edu, index) => {
            const lines = edu.split("\n");
            const [institutionLine, ...otherLines] = lines;
            const [institution, date] = institutionLine.split(" | ");

            return (
              <div key={index} className="mb-4">
                <div className="flex justify-between font-bold">
                  <span>{institution}</span>
                  <span>{date}</span>
                </div>
                {otherLines.map((line, lineIndex) => (
                  <div key={lineIndex}>{line}</div>
                ))}
              </div>
            );
          })}
      </div>

      {/* Certifications (Predefined) */}
      <div className="mb-6">
        <h2 className="text-lg font-bold uppercase border-b-2 border-gray-300 mb-3">
          CERTIFICATIONS:
        </h2>
        <div>{predefinedData.certifications}</div>
      </div>
    </div>
  );
};

const ResumeBuilder = () => {
  const [resumeData, setResumeData] = useState({
    personalInfo: {
      name: "",
      location: "",
      phone: "",
      email: "",
      linkedin: "",
    },
    summaryPoints: "",
    technicalSkills: "",
    workExperience: "",
    projects: "",
  });

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setResumeData((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [name]: value,
      },
    }));
  };

  const handleChange = (field, value) => {
    setResumeData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
      {/* Form Section */}
      <div className="space-y-6 overflow-y-auto max-h-screen pb-20">
        <Card>
          <CardHeader>
            <CardTitle>Resume Builder</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Personal Information
              </h3>
              <div className="space-y-4">
                <Input
                  placeholder="Full Name"
                  name="name"
                  value={resumeData.personalInfo.name}
                  onChange={handlePersonalInfoChange}
                />
                <Input
                  placeholder="Location (e.g., New York, NY)"
                  name="location"
                  value={resumeData.personalInfo.location}
                  onChange={handlePersonalInfoChange}
                />
                <Input
                  placeholder="Phone"
                  name="phone"
                  value={resumeData.personalInfo.phone}
                  onChange={handlePersonalInfoChange}
                />
                <Input
                  placeholder="Email"
                  name="email"
                  type="email"
                  value={resumeData.personalInfo.email}
                  onChange={handlePersonalInfoChange}
                />
                <Input
                  placeholder="LinkedIn URL"
                  name="linkedin"
                  value={resumeData.personalInfo.linkedin}
                  onChange={handlePersonalInfoChange}
                />
              </div>
            </div>

            {/* Summary Points */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Summary Points</h3>
              <Textarea
                placeholder="Enter summary points (one per line)"
                className="min-h-[100px]"
                value={resumeData.summaryPoints}
                onChange={(e) => handleChange("summaryPoints", e.target.value)}
              />
            </div>

            {/* Technical Skills */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Technical Skills</h3>
              <Textarea
                placeholder="Enter technical skills"
                className="min-h-[100px]"
                value={resumeData.technicalSkills}
                onChange={(e) =>
                  handleChange("technicalSkills", e.target.value)
                }
              />
            </div>

            {/* Work Experience */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Work Experience</h3>
              <Textarea
                placeholder="Enter work experience (separate companies with blank line)"
                className="min-h-[200px]"
                value={resumeData.workExperience}
                onChange={(e) => handleChange("workExperience", e.target.value)}
              />
            </div>

            {/* Projects */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Projects</h3>
              <Textarea
                placeholder="Enter projects (separate projects with blank line)"
                className="min-h-[200px]"
                value={resumeData.projects}
                onChange={(e) => handleChange("projects", e.target.value)}
              />
            </div>

            {/* Document Generator Component */}
            <DocumentGenerator
              resumeData={resumeData}
              predefinedData={predefinedData}
            />
          </CardContent>
        </Card>
      </div>

      {/* Preview Section */}
      <div className="hidden lg:block sticky top-6 h-screen overflow-y-auto pb-20">
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResumePreview data={resumeData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResumeBuilder;
