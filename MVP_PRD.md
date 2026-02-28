# PRODUCT REQUIREMENTS DOCUMENT

## Robot Training Data Marketplace  
### MVP Mobile Application

---

**Version:** 1.0 - MVP  
**Date:** February 2026  
**Status:** Development Ready  
**Platform:** iOS & Android (React Native / Flutter)  
**Target Launch:** Week 1-2 (14 days)  

---

## Executive Summary

This document defines the Minimum Viable Product (MVP) for the Robot Training Data Marketplace mobile application. The app enables gig workers in India to earn ₹600-800/hour by filming household chores using their smartphones. The collected videos are processed, annotated, and sold to robot companies training humanoid robots.

**Primary Goal:** Launch a functional worker app in 14 days that can collect 150+ quality video clips from 5 pilot workers.

**Success Metrics:** 5 active workers, 150+ approved clips, <10% rejection rate, ₹50,000 in worker payments processed.

---

## Table of Contents

1. Product Overview
2. User Personas
3. Core Features
4. User Flows
5. Technical Requirements
6. UI/UX Specifications
7. Quality Controls
8. Payment System
9. Admin Dashboard Requirements
10. Out of Scope (Post-MVP)
11. Development Timeline
12. Success Criteria

---

## 1. Product Overview

### 1.1 Problem Statement

Robot companies need diverse, real-world human demonstration data to train humanoid robots. Current solutions are expensive (filming in labs at $50-100/hour) and not diverse (same people, same environment). We solve this by crowdsourcing data collection from homes across India.

### 1.2 Solution

A mobile-first platform where workers use their smartphones to record household tasks. The app provides:

- Simple task assignment ("Fold 5 t-shirts", "Pour water into cups")
- Real-time quality checks (lighting, hand visibility, stability)
- Instant UPI payments (within 2 hours of approval)
- Progress tracking and earnings dashboard
- WhatsApp-based support for quick issue resolution

### 1.3 Value Proposition

#### For Workers:
- Earn ₹600-800/hour (premium vs Swiggy delivery ₹30-40/order)
- Work from home, choose your hours
- Instant UPI payments (no waiting weeks)
- Simple tasks (things they already do daily)
- No special skills required

#### For the Business:
- Low cost per clip (₹40-50 vs $5-8 in US)
- Massive diversity (1,000 homes > 1 lab)
- Rapid scaling (recruit 100 workers overnight)
- Sell same data to multiple customers = 90%+ margins

---

## 2. User Personas

### 2.1 Primary User: The Gig Worker

**Name:** Priya, 26, Bangalore

**Background:**
- Lives with roommates, works part-time remote job
- Has Redmi Note 11 (48MP camera)
- Uses Swiggy, PhonePe, WhatsApp daily
- Needs extra ₹15,000-20,000/month for savings

**Goals:**
- Earn side income without commuting
- Work 2-3 hours daily when free
- Get paid quickly (not wait 30 days)
- Understand exactly what to do (no confusion)

**Pain Points:**
- Skeptical of online earning apps ("Is this a scam?")
- Worried about privacy (filming home)
- Limited data plan (needs WiFi)
- Uncomfortable with English-only interfaces

**Tech Comfort:** Medium — Can use apps but needs clear instructions

### 2.2 Secondary User: College Student

**Name:** Rahul, 21, Delhi

- Engineering student, lives in hostel
- Tech-savvy, comfortable with apps
- Wants pocket money (₹5,000-10,000/month)
- Flexible schedule (can work evenings/weekends)

### 2.3 Secondary User: Homemaker

**Name:** Sunita, 38, Mumbai

- Manages household, kids in school
- Free 2-3 hours midday (10 AM - 3 PM)
- Wants financial independence
- Already does these tasks daily anyway
- Prefers Hindi language interface

---

## 3. Core Features (MVP)

### 3.1 Onboarding & Authentication

#### Phone Number Login
- Enter phone number (10 digits)
- Receive OTP via SMS
- Auto-verify OTP (6 digits)
- Session persists (don't ask again for 30 days)

#### Profile Setup
- Full Name (required)
- City (dropdown, required)
- Language preference (Hindi/English toggle)
- UPI ID for payments (PhonePe/GooglePay/Paytm)
- Email (optional)

#### Welcome Tutorial
- 3-screen swipeable tutorial with illustrations
- Screen 1: "How it works" (task → record → earn)
- Screen 2: "Quality matters" (good vs bad video examples)
- Screen 3: "Get paid fast" (UPI instant payment)

**Technical Requirements:**
- Firebase Authentication (phone auth)
- Store user profile in Supabase `workers` table
- Skip tutorial after first login

---

### 3.2 Home Screen (Task List)

#### Layout
- **Header:** Greeting ("Namaste, Priya!"), earnings today, help icon
- **Available Tasks section:** Scrollable list
- **My Progress section:** Submitted clips pending review
- **Bottom Navigation:** Home, Earnings, Profile

#### Task Card Design

Each task displays:
- Task title (Hindi + English): "फोल्ड 5 टी-शर्ट / Fold 5 T-Shirts"
- Payment: "₹600" (large, bold)
- Duration estimate: "~15 minutes"
- Thumbnail image (example of task)
- "Start" button (green, prominent)

#### Empty States
- No tasks available: "Check back in 2 hours! New tasks coming soon."
- All tasks completed: "You're amazing! More tasks tomorrow."

---

### 3.3 Task Detail Screen

#### Information Displayed
- Full task title and description (bilingual)
- Step-by-step instructions with numbered list
- Example video (embedded player, 30-second demo)
- Requirements checklist:
  - Good lighting (windows or bright lights)
  - Hands visible in frame
  - Phone stable (chest mount or propped)
  - Background noise okay, no music
- Payment amount and deadline (if any)
- "Start Recording" button

---

### 3.4 Video Recording

#### Camera Setup
- Pre-check: "Is your phone mounted on your chest?" (Yes/No)
- Auto-enable rear camera (better quality than selfie cam)
- 1080p resolution (balance quality vs file size)
- 30 FPS (standard, lower bandwidth)
- Auto-focus enabled

#### Recording Interface
- Full-screen camera preview
- Overlay guides: Hand bounding box (green when detected)
- Real-time indicators:
  - Lighting score: ☀️ Good | ⚠️ Too dark
  - Hand visibility: ✓ Hands visible | ✗ Move closer
  - Stability: 📊 Stable | 📊 Hold steady
- Timer: "0:45 / 2:00" (current / max duration)
- Big red record button → changes to stop button when recording
- "Cancel" button (top-left)

#### During Recording
- Haptic feedback on start/stop
- Warning if quality drops: "Lighting too low" (banner)
- Auto-stop at max duration (prevents overlong clips)
- Capture gyroscope data (for stability analysis)

#### Post-Recording
- Video preview (play/pause controls)
- Quality assessment:
  - ✓ Lighting: Good
  - ✓ Hands visible: 95%
  - ✓ Stability: Excellent
- Estimated earnings: "₹120" (green, bold)
- Two buttons:
  - "Submit" (green, primary) → uploads video
  - "Redo" (gray, secondary) → delete and re-record

**Technical Requirements:**
- Use native camera APIs (React Native Vision Camera / Flutter camera)
- Compress video locally (H.264 codec, ~5MB/min target)
- ML Kit for hand detection (on-device, no API cost)
- Gyroscope sampling at 10Hz (stability check)
- Save metadata: duration, resolution, FPS, capture timestamp

---

### 3.5 Upload & Processing

#### Upload Flow
- Show progress bar: "Uploading... 23%"
- Check WiFi vs mobile data:
  - If mobile data: "You're using mobile data. Continue? (Yes/No)"
  - If WiFi: Auto-proceed
- Upload to Cloudflare R2 / AWS S3
- Retry logic: 3 attempts if upload fails
- Success screen: "Uploaded! Under review." with confetti animation

#### Background Upload
- If user leaves app mid-upload: Continue in background
- Push notification when upload completes
- Queue multiple uploads (upload one at a time to save bandwidth)

---

### 3.6 Earnings Dashboard

#### Top Section (Summary Cards)
- Today's Earnings: "₹1,200" (large, bold, green)
- This Week: "₹3,800"
- Total Lifetime: "₹15,600"
- Pending (under review): "₹600" (yellow)

#### Transaction History
- List of all payments (scrollable)
- Each entry shows:
  - Task name: "Fold 5 t-shirts"
  - Amount: "₹600"
  - Status: Paid ✓ | Pending ⏳ | Rejected ✗
  - Date: "23 Feb, 4:30 PM"
  - UPI Ref: "312456789" (if paid)
- Filter by: All / Paid / Pending / Rejected

#### Rejection Details
- If clip rejected: Tap to see reason
- Modal shows:
  - Reason: "Lighting too dark"
  - Suggestion: "Record during daytime or use bright lights"
  - "Try Again" button → navigates back to task

---

### 3.7 Profile & Settings

#### Profile Information
- Display name, phone, city
- Worker tier: "Tier 1" (badge)
- Rating: 4.8/5.0 (stars)
- Total clips submitted: "47"
- Approval rate: "92%" (green if >85%, yellow if 70-85%, red if <70%)
- Member since: "Jan 2026"

#### Settings Options
- Language: Hindi / English toggle
- UPI ID: Edit payment details
- Notifications: Enable/disable push notifications
- Data usage: Prefer WiFi (on/off)
- Help & Support: Opens WhatsApp to support number
- Terms & Privacy: Opens in-app webview
- Logout: Confirmation dialog → clears session

---

### 3.8 Notifications

#### Push Notification Types
- New task available: "New task: Fold t-shirts - ₹600"
- Clip approved: "Your video was approved! ₹120 paid to your UPI"
- Clip rejected: "Video rejected: Lighting too dark. Try again?"
- Payment processed: "₹600 sent to your UPI (Ref: 123456789)"
- Reminder: "You have 3 pending tasks. Earn ₹1,800 today!"

#### In-App Notifications
- Bell icon in header shows unread count
- Tap to see notification list
- Mark all as read button

---

## 4. Key User Flows

### 4.1 First-Time User Flow

1. Opens app → Splash screen (2 seconds)
2. Phone number entry → OTP sent → Auto-verify
3. Profile setup: Name, city, UPI ID, language
4. 3-screen tutorial (swipe through)
5. Lands on Home screen → sees available tasks
6. Taps first task → reads instructions → starts recording
7. Records 1-min video → submits → sees "Under review" message
8. Gets push notification in 1 hour: "Approved! ₹120 paid"

### 4.2 Daily Active User Flow

1. Opens app → Auto-logged in
2. Sees greeting: "Good morning, Priya!" + Today's earnings
3. Browses 3-4 available tasks
4. Picks highest paying: "₹800 - Cut vegetables"
5. Watches example video (30 seconds)
6. Starts recording → completes task → submits
7. Moves to next task → records another video
8. Checks Earnings tab → sees pending ₹1,600
9. Gets payment notification → checks UPI app → money received!

### 4.3 Rejection & Recovery Flow

1. Gets push notification: "Video rejected"
2. Opens app → goes to Earnings → sees rejected task
3. Taps to see reason: "Lighting too dark"
4. Reads suggestion: "Use bright lights or daytime"
5. Taps "Try Again" → navigates back to task
6. Re-records with better lighting → submits
7. Approved this time → gets paid

---

## 5. Technical Requirements

### 5.1 Tech Stack

**Mobile App:**
- Framework: React Native OR Flutter (choose one)
- Recommendation: React Native (faster intern onboarding)
- State management: Zustand (React Native) or Provider (Flutter)
- Navigation: React Navigation / Flutter Navigator
- Camera: react-native-vision-camera OR camera package (Flutter)

**Backend:**
- Database: Supabase (PostgreSQL + Auth + Storage)
- File storage: Cloudflare R2 (free 10GB) OR AWS S3
- Authentication: Firebase Phone Auth
- Push notifications: Firebase Cloud Messaging (FCM)

**AI/ML:**
- Hand detection: Google ML Kit (on-device, free)
- Object recognition: Gemini API (free tier 1,000 frames/day)
- Action classification: Later phase (post-MVP)

**Payment:**
- UPI integration: Razorpay Payout API OR Instamojo
- Cost: ₹2-5 per payout
- Manual fallback: Direct UPI transfer via PhonePe/GooglePay

---

### 5.2 Minimum Device Requirements

**Android:**
- OS: Android 9+ (API 28+)
- Camera: 12MP+ rear camera
- Storage: 2GB free space minimum
- RAM: 3GB+
- Sensors: Gyroscope (optional but preferred)

**iOS:**
- OS: iOS 13+
- Device: iPhone 8 or newer
- Storage: 2GB free space

---

### 5.3 Performance Targets

- App launch time: <2 seconds
- Camera startup: <1 second
- Video compression: <5MB per minute of footage
- Upload speed (WiFi): 1-minute video uploads in <30 seconds
- Hand detection: Real-time (<100ms latency)
- Battery drain: <10% per hour of recording

---

### 5.4 Security Requirements

- All API calls over HTTPS
- Phone number + OTP authentication (no passwords to manage)
- JWT tokens for session management (30-day expiry)
- UPI ID encrypted at rest
- Video files: Public URLs expire after 24 hours
- Row-level security in Supabase (workers see only their data)

---

## 6. UI/UX Specifications

### 6.1 Design System

#### Color Palette
- Primary: #2E75B6 (Blue — trust, professional)
- Success: #34A853 (Green — earnings, approved)
- Warning: #FBBC04 (Yellow — pending, caution)
- Error: #EA4335 (Red — rejection, error)
- Background: #F5F5F5 (Light gray)
- Text: #212121 (Dark gray)
- Secondary text: #757575 (Medium gray)

#### Typography
- Primary font: Inter (clean, readable)
- Fallback: System default (Roboto/San Francisco)
- Heading 1: 28pt, bold
- Heading 2: 22pt, semi-bold
- Body: 16pt, regular
- Caption: 14pt, regular
- Button text: 16pt, semi-bold

#### Spacing
- Base unit: 8px
- Padding: 16px (2 units) for cards/containers
- Margin between elements: 8px (1 unit)
- Margin between sections: 24px (3 units)

#### Components

**Buttons:**
- Primary: Green background, white text, 12px radius
- Secondary: White background, blue border, blue text
- Height: 48px (large tap target)

**Cards:**
- White background, subtle shadow, 12px radius
- Padding: 16px

**Input fields:**
- Height: 48px, light gray border, 8px radius
- Focus: Blue border

---

### 6.2 Localization (Hindi Support)

- All user-facing text in Hindi + English
- Default: Auto-detect phone language
- Manual toggle in settings
- Key screens fully translated:
  - Onboarding, task instructions, error messages
- Numbers/currency: Always show ₹ symbol
- Dates: DD/MM/YYYY format (Indian standard)

---

### 6.3 Accessibility

- Font scaling: Support up to 200% system font size
- Color contrast: WCAG AA standard (4.5:1 for text)
- Touch targets: Minimum 44x44 points
- Screen reader support: Label all buttons/inputs
- Error messages: Clear, actionable (not just "Error")

---

## 7. Quality Control System

### 7.1 Automated Quality Checks

#### During Recording (Real-time)

**Lighting check:**
- Calculate average brightness (0-255 scale)
- Reject if <60 (too dark) or >220 (overexposed)
- Show warning banner: "Lighting too low — use bright lights"

**Hand visibility:**
- ML Kit hand detection every 10 frames
- Require hands visible in >80% of frames
- Warning: "Move hands into frame"

**Stability check:**
- Gyroscope readings: rotation <5°/sec = stable
- Warning: "Hold phone steady"

#### Post-Recording (Before Submit)

**Duration check:**
- Minimum 30 seconds, maximum 5 minutes
- Block submit if outside range

**File size check:**
- Target: 5MB per minute
- If >10MB/min: Re-compress before upload

**Audio check:**
- Detect if audio present (optional, not required)
- Strip audio if music/loud background noise detected

#### Server-Side (Post-Upload)

**Duplicate detection:**
- Hash video file, check against existing clips
- Auto-reject if duplicate found

**Inappropriate content:**
- Google Cloud Vision API: Safe Search (adult, violence)
- Auto-reject if flagged

**Task compliance:**
- Gemini API: "Does this video show someone folding t-shirts?"
- Confidence threshold: >70%

---

### 7.2 Human Review Process

- All clips pass through annotator review (MVP: you + interns)
- Review checklist:
  - Task completed correctly? (Yes/No)
  - Hands visible throughout? (Yes/No)
  - Usable for training? (Yes/No)
- Approval: All 3 = Yes → Approve
- Rejection: Any = No → Reject with reason
- Target: Review within 2 hours of submission

---

### 7.3 Worker Rating System

**Rating calculation:**
- Approval rate: (Approved clips / Total clips) × 5
- Example: 18 approved / 20 total = 4.5 stars

**Consequences:**
- <3.5 stars: Warning email
- <3.0 stars: 3-day suspension
- <2.5 stars: Permanent ban

**Incentive:** >4.5 stars = ₹100 weekly bonus

---

## 8. Payment System

### 8.1 Payment Flow

1. Worker submits clip → Clip enters review queue
2. Admin/intern reviews → Approves clip
3. System triggers payment:
   - Calculate amount (task pay + any bonus)
   - Create payment record in database
   - Call Razorpay Payout API
4. Razorpay processes UPI transfer (~2 minutes)
5. Worker receives money in UPI app
6. Push notification: "₹600 paid to your UPI (Ref: 123456789)"
7. Payment marked complete in database

---

### 8.2 Payment Schedule

- Timing: Within 2 hours of approval (MVP goal)
- Frequency: Instant per-task payment
- Minimum payout: ₹100 (no maximum)
- Batch payments: Group multiple approved tasks if submitted together

---

### 8.3 Payment Failure Handling

**If Razorpay API fails:**
- Retry 3 times with exponential backoff
- If still fails: Mark as 'manual intervention required'
- Admin dashboard shows failed payments
- Manual fallback: You pay via PhonePe/GooglePay directly

**Invalid UPI ID:**
- Send push notification: "Payment failed - Update UPI ID"
- Hold payment in 'pending' status
- Retry after worker updates UPI

---

### 8.4 Payment Security

- 2FA on admin panel for manual payments
- Transaction logs: All payments logged with timestamp, amount, UPI ref
- Dispute resolution: Screenshot of UPI app as proof
- Fraud detection: Flag workers who change UPI ID frequently

---

## 9. Admin Dashboard Requirements

### 9.1 Core Features

#### Clip Review Queue

**List view:**
- Clip thumbnail, worker name, task, upload time
- Sort by: Newest first, Longest pending
- Filter by: Worker, Task, Status

**Detail view:**
- Video player (play, pause, scrub)
- Quality scores (lighting, hand visibility, stability)
- Metadata (duration, file size, device)

**Actions:**
- ✓ Approve → Triggers payment
- ✗ Reject → Dropdown: Select reason
  - Lighting poor
  - Hands not visible
  - Task not completed
  - Duplicate submission
  - Other (text input)

#### Worker Management

**Worker list:**
- Name, phone, city, tier, rating, total clips, total earnings
- Search by name/phone
- Filter: Active, Suspended, Banned

**Worker detail:**
- Full profile, device info, payment history
- All submitted clips (approved/rejected/pending)
- Actions: Suspend, Ban, Send message (WhatsApp)

#### Task Management

**Create new task:**
- Select category, title (EN + HI), instructions, pay amount
- Upload example video
- Set deadline (optional)

**Edit task:** Update instructions, change pay, pause/resume

**Task analytics:**
- Completion rate, average time, rejection rate

#### Analytics Dashboard

**Key metrics (today / this week / all time):**
- Total clips collected
- Clips pending review
- Approval rate (%)
- Active workers
- Total paid out (₹)
- Average payment per clip

**Charts:**
- Clips collected over time (line chart)
- Top workers by clips (bar chart)
- Task distribution (pie chart)

---

### 9.2 Technical Requirements

- Platform: Web-based (Next.js OR simple React)
- Auth: Email + password (just for you + interns)
- Hosting: Vercel (free tier)
- Database: Same Supabase instance as mobile app
- Real-time updates: Supabase realtime (clips queue updates live)

---

## 10. Out of Scope (Post-MVP)

These features are important but NOT required for MVP launch:

### 10.1 Advanced Features
- Multiple equipment tiers (Tier 2-5 chest mounts, sensors)
- Dynamic pricing (adjust pay based on demand)
- Worker leaderboard & gamification
- Referral system (earn ₹500 for each friend)
- In-app chat support (use WhatsApp for MVP)
- Advanced annotation tools (polygon, keypoint)
- Customer-facing API & data portal

### 10.2 Nice-to-Haves
- Offline mode (record without internet, upload later)
- Video editing (trim, crop) before submit
- Social sharing ("I earned ₹X today!")
- Dark mode
- More languages (Tamil, Telugu, Bengali)
- Worker training videos / certification

---

## 11. Development Timeline

### 11.1 Week 1: Core App Development

**Day 1-2: Foundation**
- Set up React Native/Flutter project
- Configure Firebase Auth
- Set up Supabase database
- Design screens in Figma (interns)

**Day 3-4: Authentication & Home**
- Phone auth + OTP verification
- Profile setup screen
- Onboarding tutorial
- Home screen (task list)

**Day 5-6: Recording & Upload**
- Camera integration
- Real-time quality checks (ML Kit)
- Video compression
- Upload to cloud storage
- Background upload

**Day 7: Polish & Test**
- Earnings screen
- Profile & settings
- Push notifications
- Bug fixes, polish UI

---

### 11.2 Week 2: Admin Dashboard & Testing

**Day 8-10: Admin Dashboard**
- Clip review queue
- Worker management
- Task management
- Analytics dashboard
- Payment integration (Razorpay)

**Day 11-12: Integration Testing**
- End-to-end flow testing
- Payment system testing
- Load testing (simulate 10 concurrent users)
- Fix critical bugs

**Day 13-14: Pilot Prep & Launch**
- Deploy to production (TestFlight/Google Play Beta)
- Create 5 pilot tasks
- Recruit 5 pilot workers
- Onboard workers, distribute equipment
- Start data collection!

---

## 12. Success Criteria

### 12.1 MVP Launch Criteria (Day 14)

- App deployed to TestFlight (iOS) and Google Play Beta (Android)
- 5 workers onboarded and trained
- All core features functional (no blocking bugs)
- Payment system tested with real UPI transfers
- Admin dashboard operational

---

### 12.2 Week 3 Success Metrics

- 150+ clips collected (30 clips per worker)
- Approval rate: >85%
- Worker satisfaction: >4/5 stars (informal survey)
- ₹50,000 in worker payments processed
- Zero payment failures
- Average time to payment: <2 hours

---

### 12.3 Key Performance Indicators

#### Product Metrics
- Daily active workers: Track engagement
- Clips per worker per day: Target 10-15
- Approval rate: Target >85%
- Time to review: Target <2 hours
- App crash rate: <1%

#### Business Metrics
- Cost per approved clip: Target ₹40-50
- Worker retention: Target >70% week-over-week
- Payment processing time: Target <2 hours
- Data quality score: Target >4/5

---

### 12.4 Go/No-Go Decision (Day 21)

After 3 weeks (1 week build + 2 weeks pilot), evaluate:

**GO (Scale to 20+ workers):**
- ✓ 150+ clips collected
- ✓ >85% approval rate
- ✓ Workers happy (would recommend)
- ✓ No major technical issues
- ✓ Payment system reliable

**NO-GO (Pivot or iterate):**
- ✗ <100 clips (low productivity)
- ✗ <70% approval rate (quality issues)
- ✗ Workers unhappy or churning
- ✗ Frequent app crashes
- ✗ Payment system unreliable

---

## Appendix

### A. Example Task Instructions

**Task: Fold 5 T-Shirts**

**Payment:** ₹600 (₹120 per shirt)  
**Time estimate:** 15 minutes

**Instructions:**
1. Gather 5 different t-shirts (different colors/sizes preferred)
2. Lay each shirt flat on a table or bed
3. Fold each shirt using your normal method
4. Keep your hands visible throughout
5. Record all 5 shirts in one continuous video

**Tips:**
- Film during daytime for best lighting
- Use your chest mount or prop phone on a table
- Don't rush - quality over speed
- Background noise is okay, music is not

---

### B. Glossary

- **Clip:** A single video recording of a task
- **Worker:** Person who records videos (gig worker)
- **Task:** An assignment to film a specific activity
- **Approval rate:** Percentage of clips approved vs rejected
- **UPI:** Unified Payments Interface (instant bank transfer in India)
- **Tier:** Equipment level (Tier 1 = smartphone only, Tier 2-5 = advanced sensors)
- **Annotation:** Adding labels to video (hand positions, objects, actions)

---

**— END OF DOCUMENT —**
