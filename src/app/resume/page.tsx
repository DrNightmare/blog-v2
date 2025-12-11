
import React from 'react';
import type { Metadata } from 'next';

import Section from '@/components/resume/Section';
import ExperienceCard from '@/components/resume/ExperienceCard';
import EducationCard from '@/components/resume/EducationCard';
import SkillBadge from '@/components/resume/SkillBadge';

export const metadata: Metadata = {
    title: 'Resume | Arvind Prakash',
    description: 'Staff Engineer Resume of Arvind Prakash',
};

export default function ResumePage() {
    return (
        <main className="min-h-screen bg-background py-16 transition-colors">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <Section title="Work Experience">
                    <ExperienceCard
                        role="STAFF ENGINEER"
                        company="Refyne"
                        location="Bangalore, India"
                        date="Nov. 2021 – Present"
                        descriptions={[
                            "Led an end‑to‑end project to in‑place encrypt sensitive fields using MongoDB CSFLE, including migration across multiple fields and collections in production. This was done to ensure compliance with data security standards.",
                            "Delivered several critical features and optimizations to improve platform robustness; ran a Mongo query optimization program to reduce bottlenecks.",
                            "Refactored a legacy codebase to a new infrastructure, reducing client‑facing report generation time from 30+ minutes to under 10 seconds.",
                            "Contributed extensively to streamlining workflows across both B2B and B2C collections.",
                            "Drove adoption of a repository pattern in NestJS, significantly reducing circular dependencies and improving maintainability.",
                            "Conducted thorough PR reviews to maintain code quality; led design discussions on critical tasks, analyzing tradeoffs and guiding decisions.",
                            "Built and scaled a team of 7 engineers; instituted 1:1s, appraisals, and feedback loops, improving retention and delivery velocity."
                        ]}
                    />
                    <ExperienceCard
                        role="SENIOR SOFTWARE ENGINEER"
                        company="Hyperverge"
                        location="Bangalore, India"
                        date="Nov. 2018 – Nov. 2021"
                        descriptions={[
                            "Developed and deployed a face‑recognition based IAM service on client servers, containerizing the application for streamlined deployment and versioning.",
                            "Built an Android SDK to extract financial insights from SMS data for credit underwriting.",
                            "Led a team and contributed to development of a Video KYC platform integrated with internal AI‑powered KYC modules, used in production at scale by multiple high volume clients."
                        ]}
                    />
                    <ExperienceCard
                        role="FULL STACK DEVELOPER"
                        company="Datasigns (MyShubhLife)"
                        location="Bangalore, India"
                        date="Mar. 2017 – Nov. 2018"
                        descriptions={[
                            {
                                text: "Designed and built Medulla, an internal tool offering key services:",
                                subItems: [
                                    "Computed credit reports using user‑derived financial features.",
                                    "Categorized bank statement transactions to assess user financial behavior and support credit decisions.",
                                    "Served as an interface to external APIs enabling loan disbursement through banks and lenders."
                                ]
                            },
                            "Implemented critical features on the internal admin dashboard using ReactJS (JavaScript) for the frontend and Spring (Java) for the backend."
                        ]}
                    />
                    <ExperienceCard
                        role="VOLUNTEER"
                        company="Zariya"
                        location="Bangalore, India"
                        date="Feb. 2017 – Apr. 2017"
                        descriptions={[
                            "Contribute to a non‑profit supporting women in India facing violence by connecting survivors with legal and counseling experts.",
                            "Built the organization’s “About Us” webpage using Bootstrap; actively manage cases in Bangalore."
                        ]}
                    />
                    <ExperienceCard
                        role="APPLICATION DEVELOPER"
                        company="TreatUp (Digital Healthcare Startup)"
                        location="Bangalore, India"
                        date="Feb. 2016 – Jul. 2016"
                        descriptions={[
                            "Developed a native Android app enabling doctors to record data and generate PDF prescriptions for patients.",
                            "Played a core role in product development and strategic decision‑making."
                        ]}
                    />
                </Section>

                <Section title="Research Experience">
                    <ExperienceCard
                        role="RESEARCH INTERN"
                        company="Reconfigurable and Intelligent Systems Laboratory, IIT Madras"
                        location="Chennai, India"
                        date="Dec. 2014 – Jun. 2015"
                        descriptions={[
                            "Implemented algorithms for benchmarking a novel approach to solving the multi‑armed bandit problem."
                        ]}
                    />
                </Section>

                <Section title="Education">
                    <EducationCard
                        institution="Birla Institute of Technology and Science (BITS Pilani)"
                        degree="M.Sc. (Tech.) in Information Systems"
                        location="Goa, India"
                        date="Aug. 2011 – May. 2015"
                    />
                </Section>

                <Section title="Teaching">
                    <ExperienceCard
                        role="TEACHING ASSISTANT"
                        company="Computer Programming, CS F111 (Dr. Biju Raveendran)"
                        location="Goa, India"
                        date="Jan. 2014 – May. 2014"
                        descriptions={[
                            "Evaluated C++ programs during lab sessions for the Computer Programming course at BITS Pilani."
                        ]}
                    />
                </Section>

                <Section title="Technical Skills">
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-2">Languages</h3>
                            <div className="flex flex-wrap">
                                <SkillBadge>Python</SkillBadge>
                                <SkillBadge>Java</SkillBadge>
                                <SkillBadge>JavaScript / TypeScript</SkillBadge>
                                <SkillBadge>C++</SkillBadge>
                                <SkillBadge>C</SkillBadge>
                                <SkillBadge>C#</SkillBadge>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-2">Frontend & Mobile</h3>
                            <div className="flex flex-wrap">
                                <SkillBadge>ReactJS</SkillBadge>
                                <SkillBadge>NextJS</SkillBadge>
                                <SkillBadge>HTML/CSS</SkillBadge>
                                <SkillBadge>Tailwind CSS</SkillBadge>
                                <SkillBadge>Android (Native)</SkillBadge>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-2">Backend & Database</h3>
                            <div className="flex flex-wrap">
                                <SkillBadge>NodeJS</SkillBadge>
                                <SkillBadge>NestJS</SkillBadge>
                                <SkillBadge>Spring Boot</SkillBadge>
                                <SkillBadge>MongoDB</SkillBadge>
                                <SkillBadge>PostgreSQL</SkillBadge>
                                <SkillBadge>Redis</SkillBadge>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-2">Cloud & DevOps</h3>
                            <div className="flex flex-wrap">
                                <SkillBadge>AWS</SkillBadge>
                                <SkillBadge>Docker</SkillBadge>
                                <SkillBadge>Kubernetes</SkillBadge>
                                <SkillBadge>CI/CD</SkillBadge>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-2">Game Development</h3>
                            <div className="flex flex-wrap">
                                <SkillBadge>Unity</SkillBadge>
                                <SkillBadge>Godot</SkillBadge>
                            </div>
                        </div>
                    </div>
                </Section>
            </div>
        </main>
    );
}
