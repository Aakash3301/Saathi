import {
  DailyTaskItem,
  ExplanationResult,
  SafetyCheckResult,
  SamplePreset,
  TaskGuideResult,
} from '../types';

// Preset messages for "Explain This"
export const EXPLAIN_PRESETS: SamplePreset[] = [
  {
    id: 'kyc-notice',
    label: 'Bank KYC Notice',
    tag: 'Banking SMS',
    text: 'Dear Customer, as per RBI directive your account ending 4821 requires periodic Re-KYC compliance failing which debits will be restricted under PMLA rules. Visit branch with OVD documents.',
  },
  {
    id: 'utility-notice',
    label: 'Electricity Surcharge Notice',
    tag: 'Bill Notification',
    text: 'Notice: Fuel adjustment surcharge and regulatory tariff arrears of Rs 340 applied to consumer no. 102948. ECS debit mandate initiated for 24th instant.',
  },
  {
    id: 'hospital-report',
    label: 'Clinic Test Report SMS',
    tag: 'Health Clinic',
    text: 'Diagnostic Alert: Fasting blood glucose is 118 mg/dL (mildly elevated impaired fasting glycaemia). HbA1c 6.1%. Kindly consult treating physician for routine lifestyle review.',
  },
  {
    id: 'courier-rto',
    label: 'Courier Delivery SMS',
    tag: 'Package Delivery',
    text: 'Consignment AWB-883902 held at transit hub due to incomplete address consignee landmark. Contact delivery associate to reschedule dispatch.',
  },
];

export const MOCK_EXPLANATIONS: Record<string, ExplanationResult> = {
  default: {
    summary: 'This is an official informational notice from a service provider. There is no emergency.',
    simpleExplanation: 'Organizations send formal notices to keep records updated or confirm transactions. You do not need to rush or worry. Everything can be handled calmly.',
    senderType: 'Service Provider / Official Organization',
    keyTerms: [
      {
        term: 'Official Notification',
        explanation: 'A formal letter or message sent to update you about an account or service.',
      },
      {
        term: 'Verification',
        explanation: 'Checking your name, address, or ID to make sure everything matches their records.',
      },
    ],
    actionAdvice: [
      'Do not tap any links sent in an unknown message.',
      'If you have doubts, ask your son, daughter, or visit the office in person.',
      'Take your time; there is no immediate penalty or rush.',
    ],
  },
  'kyc-notice': {
    summary: 'Your bank is simply asking for a routine photo ID and address check to keep your records updated.',
    simpleExplanation: 'Government rules require banks to verify customer records every few years. Your money is completely safe. The bank just needs to confirm your address and identity.',
    senderType: 'Bank / Financial Institution',
    keyTerms: [
      {
        term: 'Re-KYC / KYC',
        explanation: '"Know Your Customer" — showing an ID card (like Aadhaar or Voter ID) to prove your identity.',
      },
      {
        term: 'Debits restricted',
        explanation: 'Temporarily pausing outward spending until your address proof is submitted.',
      },
      {
        term: 'OVD Documents',
        explanation: 'Officially Valid Documents, such as your Aadhaar card, Voter ID, or Passport.',
      },
    ],
    actionAdvice: [
      'Do NOT click any link in an SMS or share details over phone calls.',
      'Whenever convenient, visit your nearby home branch with your ID card and passbook.',
      'A branch bank clerk will photocopy your ID and verify it for free in a few minutes.',
    ],
  },
  'utility-notice': {
    summary: 'A small regular seasonal charge (₹340) was added to your electricity bill, and it will be paid automatically.',
    simpleExplanation: 'Electricity boards periodically adjust fuel costs. This is not a penalty. If you have automatic bill pay set up, your bank will clear it on the 24th.',
    senderType: 'Electricity Supply Board',
    keyTerms: [
      {
        term: 'Fuel Adjustment Surcharge',
        explanation: 'A tiny routine adjustment in electricity prices when coal/gas prices change.',
      },
      {
        term: 'ECS Debit Mandate',
        explanation: 'An automatic payment deduction that you had previously authorized with your bank.',
      },
    ],
    actionAdvice: [
      'No manual payment is required right now if you have auto-pay enabled.',
      'Keep ₹340 in your account before the 24th so the automatic payment goes through smoothly.',
    ],
  },
  'hospital-report': {
    summary: 'Your blood sugar is slightly higher than normal, but well within a safe manageable range.',
    simpleExplanation: 'Your fasting blood sugar (118) and 3-month average (6.1%) are slightly above normal. Your doctor just wants to suggest simple diet or morning walk tips at your next regular visit.',
    senderType: 'Medical Diagnostic Lab',
    keyTerms: [
      {
        term: 'Fasting Blood Glucose',
        explanation: 'Sugar level tested in the morning before eating breakfast.',
      },
      {
        term: 'HbA1c',
        explanation: 'A test that measures your average blood sugar levels over the past 3 months.',
      },
    ],
    actionAdvice: [
      'Keep eating your normal healthy meals; there is no medical emergency.',
      'Take this report along during your next scheduled appointment with your family doctor.',
    ],
  },
  'courier-rto': {
    summary: 'The delivery person had trouble finding your house landmark and will try again.',
    simpleExplanation: 'A package arrived in your area, but the delivery person was unsure about the exact house or lane. They will either phone you or attempt delivery again tomorrow.',
    senderType: 'Courier / Parcel Delivery',
    keyTerms: [
      {
        term: 'Consignment / AWB',
        explanation: 'A tracking number for a package or parcel.',
      },
      {
        term: 'Transit Hub',
        explanation: 'The local sorting warehouse where parcels are kept before being delivered to homes.',
      },
    ],
    actionAdvice: [
      'Never pay any "redelivery fee" or click links to update your address.',
      'If a delivery agent calls your phone, simply guide them to your building or nearby landmark.',
    ],
  },
};

// Presets for "Is This Safe?"
export const SAFETY_PRESETS: SamplePreset[] = [
  {
    id: 'elec-scam',
    label: 'Electricity Cutoff Threat',
    tag: 'Dangerous Scam',
    text: 'URGENT: Dear consumer, your electricity power will be disconnected tonight at 9:30 PM from the power office because your previous month bill was not updated. Immediately call our power officer Mr. Sharma on 9812345678 to prevent disconnection.',
  },
  {
    id: 'lottery-scam',
    label: 'WhatsApp Lottery / Prize',
    tag: 'Fraud Alert',
    text: 'Dear Lucky Winner! Your mobile number won 1st prize of Rs. 25,00,000 in KBC All India Lucky Draw. To claim your cash prize directly in your bank account, send Rs. 1,500 registration fee to SBI Manager on 9765432100.',
  },
  {
    id: 'real-bank-otp',
    label: 'Legitimate Bank OTP',
    tag: 'Safe Notification',
    text: '492817 is your secret OTP for login to SBI NetBanking. Do NOT share OTP with anyone, including bank staff or callers. Valid for 10 minutes.',
  },
  {
    id: 'fake-courier-link',
    label: 'Fake Parcel Fee Link',
    tag: 'Suspicious Link',
    text: 'IndiaPost: Your parcel failed delivery due to incorrect house number. Pay Rs 5 re-delivery fee at http://post-indiaroute-app.online/pay to avoid return.',
  },
];

export const MOCK_SAFETY_RESULTS: Record<string, SafetyCheckResult> = {
  default: {
    safetyLevel: 'CAUTION',
    verdictTitle: 'Requires Caution — Unverified Sender',
    safetyScore: 55,
    plainWarning: 'This message does not appear to come from a verified official sender. Please be careful and do not click any links or share personal information.',
    redFlags: [
      'Sender phone number or address is not a verified business ID.',
      'Contains an unverified request or link.',
    ],
    safeActions: [
      'Do not tap on any web links inside this message.',
      'Do not call the phone numbers written inside the text.',
      'Show this message to a family member or trusted neighbor before taking action.',
    ],
    goldenRule: 'When in doubt, pause. Real companies will never punish you for taking time to verify.',
  },
  'elec-scam': {
    safetyLevel: 'DANGER',
    verdictTitle: 'High Danger: Fake Electricity Disconnection Scam',
    safetyScore: 8,
    plainWarning: 'This is a 100% fake fraud message! Criminals send these fake messages every day to frighten seniors into panicking and transferring money to private numbers.',
    redFlags: [
      'Threatens to cut off your power "tonight at 9:30 PM" to make you panic in a rush.',
      'Gives a personal 10-digit mobile number instead of an official electricity office helpline.',
      'Real government utility boards never send individual cell numbers or cut power with 2-hour notices.',
    ],
    safeActions: [
      'Do NOT call 9812345678 or whatever number is listed in the message.',
      'Do NOT transfer any money or download any app.',
      'Your electricity will NOT be disconnected. Simply delete this message.',
      'If you still feel uneasy, check your printed electricity bill or ask your children to check the official app.',
    ],
    goldenRule: 'Government departments NEVER threaten same-night disconnections via SMS.',
  },
  'lottery-scam': {
    safetyLevel: 'DANGER',
    verdictTitle: 'High Danger: Fraudulent Prize / Lottery Scam',
    safetyScore: 5,
    plainWarning: 'You did NOT win any lottery. This is a classic trap where scammers ask for a small "processing fee" and then disappear with your hard-earned savings.',
    redFlags: [
      'Claims you won ₹25,00,000 for a contest or lucky draw you never entered.',
      'Demands an advance payment of ₹1,500 to release the "prize".',
      'Uses fake names of television shows or banks to look genuine.',
    ],
    safeActions: [
      'Never send any fee to claim a prize. Real prizes never ask for money.',
      'Block the sender immediately on WhatsApp or your phone.',
      'Do not share your bank account, card, or Aadhaar details.',
    ],
    goldenRule: 'If you didn’t buy a ticket, you cannot win a prize. Legitimate contests never demand advance fees.',
  },
  'real-bank-otp': {
    safetyLevel: 'SAFE',
    verdictTitle: 'Genuine Bank Security Code (OTP)',
    safetyScore: 95,
    plainWarning: 'This is an authentic, legitimate security code from your bank. It was generated because a login or transaction was initiated.',
    redFlags: [],
    safeActions: [
      'If YOU initiated this login or payment, enter the 6-digit code into your official bank screen.',
      'If SOMEONE PHONED YOU and asked for this number, HANG UP IMMEDIATELY. Never read out an OTP.',
      'Real bank managers and employees will never ask for your secret code.',
    ],
    goldenRule: 'Your secret OTP is like the key to your home locker. Never read it out to anyone on the phone.',
  },
  'fake-courier-link': {
    safetyLevel: 'DANGER',
    verdictTitle: 'High Danger: Fake Parcel Link (Phishing Trap)',
    safetyScore: 12,
    plainWarning: 'The link in this message is a trap to steal your debit card details or install malware onto your phone.',
    redFlags: [
      'The website address (.online/pay) is completely fake and not the official indiapost.gov.in website.',
      'Asks for a tiny ₹5 fee — scammers use this to capture your card number and secret CVV code.',
    ],
    safeActions: [
      'Do not tap or click the link.',
      'India Post never charges online fees via unofficial links for address correction.',
      'Delete the message safely.',
    ],
    goldenRule: 'Never click on website links inside unexpected delivery SMS messages.',
  },
};

// Presets for "Help Me Do This"
export const TASK_PRESETS: SamplePreset[] = [
  {
    id: 'whatsapp-call',
    label: 'WhatsApp Video Call',
    tag: 'Family & Friends',
    text: 'How to make a WhatsApp video call to my grandson or daughter',
  },
  {
    id: 'pay-bill',
    label: 'Pay Electricity Bill Online',
    tag: 'Bill Payment',
    text: 'How to pay my electricity or water bill using Google Pay or PhonePe',
  },
  {
    id: 'share-location',
    label: 'Share Live Location',
    tag: 'Travel Safety',
    text: 'How to share my live location with family so they know I am safe',
  },
  {
    id: 'order-medicine',
    label: 'Order Medicines Online',
    tag: 'Health & Pharmacy',
    text: 'How to re-order monthly blood pressure and diabetes medicines online',
  },
];

export const MOCK_TASK_GUIDES: Record<string, TaskGuideResult> = {
  default: {
    taskTitle: 'Digital Task Step-by-Step Guide',
    overview: 'Let us take this one calm, easy step at a time. There is no rush.',
    steps: [
      {
        stepNumber: 1,
        title: 'Unlock Your Phone Screen',
        instruction: 'Turn on your phone and unlock the home screen where your app icons are displayed.',
        visualTip: 'Take a relaxed breath and look at the screen comfortably.',
        warning: null,
      },
      {
        stepNumber: 2,
        title: 'Open the Official App',
        instruction: 'Find the official application icon and give it one gentle tap.',
        visualTip: 'Look for the official brand logo you know well.',
        warning: 'Avoid clicking random pop-up advertisements.',
      },
      {
        stepNumber: 3,
        title: 'Carefully Read the Main Button',
        instruction: 'Look for clear buttons like "Continue", "Next", or "Confirm".',
        visualTip: 'Action buttons usually have a solid colored background with white text.',
        warning: 'Never enter your 4-digit or 6-digit secret UPI PIN to receive money.',
      },
      {
        stepNumber: 4,
        title: 'Celebrate Your Success',
        instruction: 'Once done, you will see a confirmation checkmark on screen.',
        visualTip: 'Look for a green tick or a message saying "Successful".',
        warning: null,
      },
    ],
    comfortingTip: 'You are doing wonderful! Each time you practice, it will feel simpler and more natural.',
  },
  'whatsapp-call': {
    taskTitle: 'How to Make a WhatsApp Video Call',
    overview: 'Let us connect face-to-face with your loved ones in just 4 simple steps.',
    steps: [
      {
        stepNumber: 1,
        title: 'Open WhatsApp',
        instruction: 'Unlock your phone and tap gently on the WhatsApp icon on your home screen.',
        visualTip: 'Look for the green round circle with a white telephone handset inside.',
        warning: null,
      },
      {
        stepNumber: 2,
        title: 'Find Your Family Member',
        instruction: 'Scroll down your list of chats and tap on your family member\'s name or photo.',
        visualTip: 'You can also tap the small magnifying glass (Search) icon at the top right to type their name.',
        warning: null,
      },
      {
        stepNumber: 3,
        title: 'Tap the Video Camera Icon',
        instruction: 'Look at the very top right corner of your chat screen. Tap the small icon shaped like a video camera.',
        visualTip: 'It looks like a little rectangular video camera, right next to the telephone symbol.',
        warning: 'Be careful not to tap the regular telephone icon if you want to see their face.',
      },
      {
        stepNumber: 4,
        title: 'Hold Your Phone and Smile',
        instruction: 'Hold the phone in front of your face at eye level and wait for them to pick up.',
        visualTip: 'When you are finished talking, tap the red round button at the bottom to end the call.',
        warning: 'If a message pops up asking "Allow WhatsApp to use camera?", tap "While using the app" or "Allow".',
      },
    ],
    comfortingTip: 'Seeing your smile will make their day wonderful! Take your time.',
  },
  'pay-bill': {
    taskTitle: 'How to Pay Your Utility Bill Online',
    overview: 'Pay your electricity, water, or gas bill securely from the comfort of your sofa.',
    steps: [
      {
        stepNumber: 1,
        title: 'Open Google Pay or PhonePe',
        instruction: 'Tap on your preferred payment app on your home screen.',
        visualTip: 'Look for the official Google Pay (multi-color G) or PhonePe (purple icon) on your phone.',
        warning: null,
      },
      {
        stepNumber: 2,
        title: 'Select "Electricity" or "Bills"',
        instruction: 'Scroll down to the section titled "Recharge & Pay Bills" and tap the "Electricity" icon.',
        visualTip: 'Look for the yellow lightbulb icon labeled "Electricity".',
        warning: null,
      },
      {
        stepNumber: 3,
        title: 'Choose Your Electricity Provider',
        instruction: 'Select your state or board name (e.g. BESCOM, Tata Power, BSES, MSEDCL) and enter your Consumer Number.',
        visualTip: 'Your Consumer Account Number is printed in bold on the top right of any old paper bill.',
        warning: 'Double check that the name shown on screen matches your household name.',
      },
      {
        stepNumber: 4,
        title: 'Review the Amount & Enter Your Secret PIN',
        instruction: 'Verify the bill amount on screen. Tap "Pay", select your bank, and enter your 4 or 6-digit secret UPI PIN.',
        visualTip: 'The keypad will show numbers from 0 to 9. Your PIN is never visible to anyone else.',
        warning: 'Only enter your UPI PIN when paying a bill yourself. Never enter your PIN if someone called and instructed you to.',
      },
      {
        stepNumber: 5,
        title: 'Save the Receipt',
        instruction: 'Wait for the green checkmark with the chime sound. Your bill is fully cleared!',
        visualTip: 'A green tick and transaction ID will appear on screen. You will also get an SMS from your bank.',
        warning: null,
      },
    ],
    comfortingTip: 'No more standing in long lines at the electricity office. You did this all by yourself!',
  },
  'share-location': {
    taskTitle: 'How to Share Your Live Location with Family',
    overview: 'Give your family peace of mind whenever you are traveling, shopping, or taking a walk.',
    steps: [
      {
        stepNumber: 1,
        title: 'Open WhatsApp and Select Your Child',
        instruction: 'Open WhatsApp and tap into the chat with your son, daughter, or spouse.',
        visualTip: 'Open the conversation just like you are going to send them a text message.',
        warning: null,
      },
      {
        stepNumber: 2,
        title: 'Tap the Paperclip (Attachment) Icon',
        instruction: 'At the bottom right where you type messages, tap the small paperclip or "+" symbol.',
        visualTip: 'A menu will pop up showing options like Gallery, Document, and Location.',
        warning: null,
      },
      {
        stepNumber: 3,
        title: 'Tap the "Location" Button',
        instruction: 'Tap the green map-pin icon labeled "Location".',
        visualTip: 'It looks like an inverted teardrop map pointer.',
        warning: 'If asked to "Enable GPS / Location", tap "Continue" or "OK".',
      },
      {
        stepNumber: 4,
        title: 'Choose "Share Live Location"',
        instruction: 'Tap the option that says "Share Live Location", choose "1 Hour" or "8 Hours", and tap the green send arrow.',
        visualTip: 'Your family will be able to see your safe movement on their map in real time.',
        warning: 'You can tap the red "Stop Sharing" button anytime you reach home.',
      },
    ],
    comfortingTip: 'This keeps your children assured and happy knowing you are safe on your walk.',
  },
  'order-medicine': {
    taskTitle: 'How to Order Monthly Medicines Online',
    overview: 'Get your prescribed medicines delivered right to your front door.',
    steps: [
      {
        stepNumber: 1,
        title: 'Open Pharmacy App (Tata 1mg / Apollo)',
        instruction: 'Tap to open your chosen medical app on your smartphone.',
        visualTip: 'Look for the pharmacy app icon you have installed.',
        warning: null,
      },
      {
        stepNumber: 2,
        title: 'Upload Doctor Prescription',
        instruction: 'Tap the button labeled "Upload Prescription" or take a photo of your doctor\'s prescription paper.',
        visualTip: 'Place your paper prescription under good light and take a steady, clear picture.',
        warning: 'Make sure the doctor\'s clinic stamp and date are clearly readable in the photo.',
      },
      {
        stepNumber: 3,
        title: 'Confirm Delivery Address',
        instruction: 'Select your home address and preferred delivery date.',
        visualTip: 'Review your house number and society name.',
        warning: null,
      },
      {
        stepNumber: 4,
        title: 'Select "Cash on Delivery" or Pay Online',
        instruction: 'For extra peace of mind, you can choose "Cash on Delivery" so you only pay when the delivery person arrives at your doorstep.',
        visualTip: 'Look for "Cash on Delivery" or "Pay on Delivery".',
        warning: 'Check the expiry dates on the medicine boxes when the package arrives.',
      },
    ],
    comfortingTip: 'Having your regular medicines delivered on time ensures you never miss a dose.',
  },
};

// Preset data for "My Day" screen
export const INITIAL_MY_DAY_TASKS: DailyTaskItem[] = [
  {
    id: 'task-1',
    time: '07:30 AM',
    title: 'Morning Blood Pressure & Heart Medicine',
    category: 'medicine',
    completed: true,
    notes: 'Take with warm water after morning breakfast',
  },
  {
    id: 'task-2',
    time: '08:30 AM',
    title: '20-Minute Morning Sunlight Walk',
    category: 'routine',
    completed: true,
    notes: 'In the garden or balcony with comfortable walking shoes',
  },
  {
    id: 'task-3',
    time: '01:30 PM',
    title: 'Afternoon Diabetes Tablet (Metformin)',
    category: 'medicine',
    completed: false,
    notes: 'Take right after lunchtime meal',
  },
  {
    id: 'task-4',
    time: '05:00 PM',
    title: 'WhatsApp Video Call with Grandson',
    category: 'call',
    completed: false,
    notes: 'Arjun is returning home from school; he wants to share his drawing',
  },
  {
    id: 'task-5',
    time: '08:00 PM',
    title: 'Review Electricity Bill on Saathi',
    category: 'alert',
    completed: false,
    notes: 'Check the month-end electricity bill with Saathi to verify no hidden charges',
  },
];

// Presets for Voice Assistant "Talk to Saathi"
export const VOICE_PROMPTS = [
  {
    prompt: 'Is it safe to share my OTP if a bank caller asks?',
    response: 'No, absolutely not! A real bank will never, ever ask for your secret OTP over a phone call. Hang up immediately if anyone asks.',
  },
  {
    prompt: 'Can someone steal money if I answer an unknown phone call?',
    response: 'Just answering a phone call cannot steal your money. Money is only deducted if you share an OTP, click a bad link, or enter your secret UPI PIN. You are completely safe.',
  },
  {
    prompt: 'How do I know if an SMS is from a real government office?',
    response: 'Real government offices never threaten to cut off your electricity or block your account within 2 hours. They will also never ask you to call a personal cell number.',
  },
  {
    prompt: 'How can I make the letters bigger on my screen?',
    response: 'You can tap the settings icon at the top right of Saathi to switch text size to Large or Extra Large anytime you wish.',
  },
];
