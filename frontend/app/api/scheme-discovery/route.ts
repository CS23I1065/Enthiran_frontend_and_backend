import { NextResponse } from "next/server"

const schemes = [
  {
    name: "Post-Matric Scholarship for OBC Students",
    description: "Financial support for OBC-NCL students pursuing higher education, including B.Tech.",
    details: "Covers tuition fees, maintenance allowance, and other educational expenses.",
    keywords: ["obc", "higher education", "b.tech", "engineering"],
  },
  {
    name: "Central Sector Scholarship Scheme for College and University Students (CSSS)",
    description: "Merit-based scholarship for students who excelled in Class 12 and are pursuing B.Tech.",
    details: "Provides ₹10,000 to ₹20,000 annually as financial assistance.",
    keywords: ["merit", "class 12", "b.tech", "engineering"],
  },
  {
    name: "AICTE Pragati/Saksham Scholarship",
    description: "Applicable for OBC-NCL students with specific provisions under state or central guidelines.",
    details: "Covers ₹50,000 annually for technical education.",
    keywords: ["obc", "technical education", "engineering"],
  },
  {
    name: "National Scholarship Portal (NSP)",
    description: "A one-stop platform for various scholarships offered by central and state governments.",
    details: "Includes pre-matric, post-matric, and merit-cum-means based scholarships.",
    keywords: ["general", "all levels", "government"],
  },
  {
    name: "Prime Minister's Scholarship Scheme for Central Armed Police Forces and Assam Rifles",
    description: "For wards of police personnel who died in terror or naxal attacks.",
    details: "Covers professional courses including engineering.",
    keywords: ["armed forces", "police", "professional courses"],
  },
]

export async function POST(request: Request) {
  const { situation } = await request.json()

  // Convert situation to lowercase for case-insensitive matching
  const lowercaseSituation = situation.toLowerCase()

  // Filter schemes based on keywords matching the situation
  const relevantSchemes = schemes.filter((scheme) =>
    scheme.keywords.some((keyword) => lowercaseSituation.includes(keyword)),
  )

  // If no relevant schemes found, return all schemes
  const schemesToReturn = relevantSchemes.length > 0 ? relevantSchemes : schemes

  // Generate a dynamic response
  let response = "Based on your situation, here are some scholarships you might be eligible for:\n\n"

  schemesToReturn.forEach((scheme, index) => {
    response += `${index + 1}. ${scheme.name}:\n`
    response += `   - ${scheme.description}\n`
    response += `   - ${scheme.details}\n\n`
  })

  response +=
    "For more detailed information and application procedures, please visit your nearest government office or check the official websites of these scholarship programs."

  return NextResponse.json({ response })
}

