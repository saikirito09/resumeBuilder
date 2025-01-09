import React from "react";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { jsPDF } from "jspdf";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  HeadingLevel,
  LineRuleType,
  convertInchesToTwip,
} from "docx";

const DocumentGenerator = ({ resumeData, predefinedData }) => {
  const generatePDF = () => {
    const doc = new jsPDF();
    let yPosition = 20;
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    const maxWidth = pageWidth - margin * 2;

    // Helper functions
    const addText = (
      text,
      size,
      isBold = false,
      align = "left",
      spacing = 7,
    ) => {
      doc.setFontSize(size);
      doc.setFont("helvetica", isBold ? "bold" : "normal");
      doc.text(text, align === "center" ? pageWidth / 2 : margin, yPosition, {
        align,
      });
      yPosition += spacing;
    };

    const addSection = (title, content, format = "normal") => {
      if (!content) return;

      // Section Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text(title.toUpperCase(), margin, yPosition);
      yPosition += 7;

      // Add horizontal line
      doc.setLineWidth(0.5);
      doc.line(margin, yPosition - 3, pageWidth - margin, yPosition - 3);

      // Content
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);

      if (format === "bullets") {
        const bullets = content.split("\n").filter((line) => line.trim());
        bullets.forEach((bullet) => {
          const bulletText = "• " + bullet.trim();
          const lines = doc.splitTextToSize(bulletText, maxWidth);
          doc.text(lines, margin, yPosition);
          yPosition += lines.length * 6;
        });
      } else if (format === "education") {
        const eduEntries = content.split("\n\n");
        eduEntries.forEach((entry) => {
          const [firstLine, ...otherLines] = entry.split("\n");
          const [institution, date] = firstLine.split(" | ");

          // Institution and date on same line
          doc.setFont("helvetica", "bold");
          doc.text(institution, margin, yPosition);
          doc.text(date, pageWidth - margin, yPosition, { align: "right" });
          yPosition += 6;

          // Degree info
          doc.setFont("helvetica", "normal");
          otherLines.forEach((line) => {
            doc.text(line, margin, yPosition);
            yPosition += 6;
          });
          yPosition += 2;
        });
      } else {
        const lines = doc.splitTextToSize(content, maxWidth);
        doc.text(lines, margin, yPosition);
        yPosition += lines.length * 6;
      }
      yPosition += 5;
    };

    // Header
    addText(resumeData.personalInfo.name || "Your Name", 16, true, "center", 8);

    // Contact Info
    const contactInfo = [
      resumeData.personalInfo.location,
      resumeData.personalInfo.phone,
      resumeData.personalInfo.email,
      resumeData.personalInfo.linkedin,
    ]
      .filter(Boolean)
      .join(" | ");
    addText(contactInfo, 10, false, "center", 10);

    // Add each section
    if (resumeData.summaryPoints) {
      addSection("Summary", resumeData.summaryPoints, "bullets");
    }
    addSection("Technical Skills", resumeData.technicalSkills);
    addSection("Work Experience", resumeData.workExperience, "bullets");
    addSection("Projects", resumeData.projects, "bullets");
    addSection("Education", predefinedData.education, "education");
    addSection("Certifications", predefinedData.certifications);

    doc.save("resume.pdf");
  };

  const generateDOCX = () => {
    // Styles for DOCX
    const styles = {
      header: {
        alignment: AlignmentType.CENTER,
        spacing: {
          after: 200,
        },
      },
      sectionTitle: {
        heading: HeadingLevel.HEADING_2,
        border: {
          bottom: {
            color: "000000",
            space: 1,
            value: 1,
            size: 6,
            style: LineRuleType.SINGLE,
          },
        },
        spacing: {
          after: 200,
        },
      },
      normalText: {
        spacing: {
          line: 360,
          before: 200,
          after: 200,
        },
      },
    };

    const createParagraph = (text, options = {}) => {
      return new Paragraph({
        children: [new TextRun({ ...options, text })],
        ...options,
      });
    };

    const createBulletPoint = (text) => {
      return new Paragraph({
        bullet: {
          level: 0,
        },
        children: [new TextRun(text)],
        spacing: {
          line: 360,
        },
      });
    };

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            // Header
            createParagraph(resumeData.personalInfo.name || "Your Name", {
              ...styles.header,
              bold: true,
              size: 32,
            }),

            // Contact Info
            createParagraph(
              [
                resumeData.personalInfo.location,
                resumeData.personalInfo.phone,
                resumeData.personalInfo.email,
                resumeData.personalInfo.linkedin,
              ]
                .filter(Boolean)
                .join(" | "),
              {
                ...styles.header,
                size: 24,
              },
            ),

            // Summary
            ...(resumeData.summaryPoints
              ? [
                  createParagraph("SUMMARY", styles.sectionTitle),
                  ...resumeData.summaryPoints
                    .split("\n")
                    .filter((point) => point.trim())
                    .map((point) => createBulletPoint(point)),
                ]
              : []),

            // Technical Skills
            createParagraph("TECHNICAL SKILLS", styles.sectionTitle),
            createParagraph(resumeData.technicalSkills, styles.normalText),

            // Work Experience
            createParagraph("WORK EXPERIENCE", styles.sectionTitle),
            ...resumeData.workExperience
              .split("\n\n")
              .filter((exp) => exp.trim())
              .map((exp) => {
                const [title, ...points] = exp.split("\n");
                return [
                  createParagraph(title, { bold: true, ...styles.normalText }),
                  ...points.map((point) => createBulletPoint(point)),
                ];
              })
              .flat(),

            // Projects
            createParagraph("PERSONAL PROJECTS", styles.sectionTitle),
            ...resumeData.projects
              .split("\n\n")
              .filter((proj) => proj.trim())
              .map((proj) => {
                const [title, ...points] = proj.split("\n");
                return [
                  createParagraph(title, { bold: true, ...styles.normalText }),
                  ...points.map((point) => createBulletPoint(point)),
                ];
              })
              .flat(),

            // Education
            createParagraph("EDUCATION", styles.sectionTitle),
            ...predefinedData.education
              .split("\n\n")
              .map((edu) => {
                const [firstLine, ...otherLines] = edu.split("\n");
                const [institution, date] = firstLine.split(" | ");
                return [
                  new Paragraph({
                    children: [
                      new TextRun({ text: institution, bold: true }),
                      new TextRun({ text: "    " }),
                      new TextRun({ text: date, bold: true }),
                    ],
                    alignment: AlignmentType.JUSTIFIED,
                  }),
                  ...otherLines.map((line) =>
                    createParagraph(line, styles.normalText),
                  ),
                ];
              })
              .flat(),

            // Certifications
            createParagraph("CERTIFICATIONS", styles.sectionTitle),
            createParagraph(predefinedData.certifications, styles.normalText),
          ],
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.style = "display: none";
      a.href = url;
      a.download = "resume.docx";
      a.click();
      window.URL.revokeObjectURL(url);
    });
  };

  return (
    <div className="flex gap-4">
      <Button className="flex-1" onClick={generateDOCX}>
        <FileDown className="mr-2 h-4 w-4" />
        Download DOCX
      </Button>
      <Button className="flex-1" onClick={generatePDF}>
        <FileDown className="mr-2 h-4 w-4" />
        Download PDF
      </Button>
    </div>
  );
};

export default DocumentGenerator;
