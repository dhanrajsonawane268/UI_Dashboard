import { db } from "./db";
import { contacts, conversations, messages, templates } from "@shared/schema";

async function seed() {
  console.log("🌱 Seeding database...");

  const sampleContacts = await db.insert(contacts).values([
    {
      name: "Priya Sharma",
      phone: "+91 98765 43210",
      email: "priya.sharma@example.com",
      type: "employer",
      language: "en",
      location: "Bangalore, Koramangala",
      notes: "Looking for full-time domestic help",
    },
    {
      name: "Lakshmi Devi",
      phone: "+91 98765 43211",
      type: "maid",
      language: "kn",
      location: "Bangalore, BTM Layout",
      notes: "Experienced in cooking and cleaning",
    },
    {
      name: "Rajesh Kumar",
      phone: "+91 98765 43212",
      email: "rajesh.kumar@example.com",
      type: "employer",
      language: "hi",
      location: "Bangalore, Indiranagar",
    },
    {
      name: "Anita Rao",
      phone: "+91 98765 43213",
      type: "maid",
      language: "kn",
      location: "Bangalore, Whitefield",
      notes: "Part-time availability",
    },
  ]).returning();

  console.log(`✅ Created ${sampleContacts.length} contacts`);

  const sampleConversations = await db.insert(conversations).values([
    {
      contactId: sampleContacts[0].id,
      channel: "whatsapp",
      subject: "Initial Inquiry",
      status: "active",
    },
    {
      contactId: sampleContacts[1].id,
      channel: "whatsapp",
      subject: "Job Application",
      status: "active",
    },
    {
      contactId: sampleContacts[2].id,
      channel: "email",
      subject: "Service Inquiry",
      status: "active",
    },
  ]).returning();

  console.log(`✅ Created ${sampleConversations.length} conversations`);

  await db.insert(messages).values([
    {
      conversationId: sampleConversations[0].id,
      contactId: sampleContacts[0].id,
      direction: "inbound",
      channel: "whatsapp",
      content: "Hi, I'm looking for a reliable maid for my home in Koramangala.",
      language: "en",
      sentiment: "neutral",
      intent: "inquiry",
      status: "delivered",
    },
    {
      conversationId: sampleConversations[0].id,
      contactId: sampleContacts[0].id,
      direction: "outbound",
      channel: "whatsapp",
      content: "Hello Priya! Thank you for reaching out. We can help you find the perfect domestic help. What are your specific requirements?",
      language: "en",
      status: "delivered",
    },
    {
      conversationId: sampleConversations[1].id,
      contactId: sampleContacts[1].id,
      direction: "inbound",
      channel: "whatsapp",
      content: "ನಮಸ್ಕಾರ, ನನಗೆ ಮನೆಕೆಲಸ ಬೇಕು. ನಾನು ಅಡುಗೆ ಮತ್ತು ಸ್ವಚ್ಛತೆ ಮಾಡುತ್ತೇನೆ.",
      language: "kn",
      translatedContent: "Hello, I need house work. I do cooking and cleaning.",
      sentiment: "positive",
      intent: "job_application",
      status: "delivered",
    },
    {
      conversationId: sampleConversations[2].id,
      contactId: sampleContacts[2].id,
      direction: "inbound",
      channel: "email",
      content: "मुझे एक विश्वसनीय घरेलू सहायक चाहिए जो सप्ताह में तीन दिन आ सके।",
      language: "hi",
      translatedContent: "I need a reliable domestic help who can come three days a week.",
      sentiment: "neutral",
      intent: "inquiry",
      status: "delivered",
    },
  ]);

  console.log("✅ Created sample messages");

  await db.insert(templates).values([
    {
      name: "Welcome Message",
      category: "onboarding",
      channel: "whatsapp",
      content: { text: "Welcome to GharPey! We're here to help you find the perfect domestic help. How can we assist you today?" },
      language: "en",
      isActive: true,
    },
    {
      name: "Salary Reminder",
      category: "reminder",
      channel: "whatsapp",
      content: { text: "Reminder: It's time to process salary payments for your domestic help. Please ensure timely payment." },
      language: "en",
      variables: ["{name}", "{amount}", "{date}"],
      isActive: true,
    },
    {
      name: "Interview Schedule",
      category: "notification",
      channel: "email",
      content: { text: "Your interview has been scheduled with {name} on {date} at {time}. Location: {location}" },
      language: "en",
      variables: ["{name}", "{date}", "{time}", "{location}"],
      isActive: true,
    },
    {
      name: "कन्नड स्वागत संदेश",
      category: "onboarding",
      channel: "whatsapp",
      content: { text: "ಘರ್‌ಪೇಗೆ ಸ್ವಾಗತ! ನಿಮಗೆ ಸೂಕ್ತವಾದ ಮನೆಕೆಲಸದವರನ್ನು ಹುಡುಕಲು ನಾವು ಇಲ್ಲಿದ್ದೇವೆ." },
      language: "kn",
      isActive: true,
    },
  ]);

  console.log("✅ Created sample templates");

  console.log("🎉 Seeding completed successfully!");
}

seed()
  .catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
