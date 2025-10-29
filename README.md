# 🌸 Lunara Spa - Next.js Frontend

<div align="center">

**A Modern Full-Stack Spa Management & Booking Platform Frontend Built with Next.js & React**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Redux](https://img.shields.io/badge/Redux-Toolkit-764ABC?style=for-the-badge&logo=redux&logoColor=white)](https://redux-toolkit.js.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

![Educational](https://img.shields.io/badge/Purpose-Educational%20Only-orange?style=for-the-badge)
![Not For Commercial Use](https://img.shields.io/badge/Commercial%20Use-Not%20Allowed-red?style=for-the-badge)

**🚀 Tech Highlights:** Next.js 14 • React 18 • TypeScript • Redux Toolkit • React Hook Form • Zod Validation • Tailwind CSS • shadcn/ui • Axios • Google OAuth

[Features](#-features) • [Installation](#-installation) • [Tech Stack](#-tech-stack)

</div>

---

## 👨‍💻 About This Project

### 🎯 The Full-Stack Transformation Journey

This Next.js frontend represents the **culmination of an intense 2-month learning journey** during my semester break (August 8th to September 30th, 2024) between my **4th and 5th semester** at **UiTM Jasin**. It's part of a complete architectural transformation from a monolithic Laravel application to a **modern full-stack system** with separated concerns.

> **ℹ️ CONTEXT:** This is the frontend portion of the **Lunara Spa Full-Stack System**, paired with a Laravel API backend. The **Lunara Spa logo and brand** were **created by me (Muhammad Ilyas Bin Amran)** as original work.

> **⚠️ DISCLAIMER:** This project is developed **for educational and learning purposes only**, specifically for my **Final Year Project (FYP)**. This is a portfolio project to demonstrate modern full-stack development skills with React and Next.js, and is not intended for commercial use.

---

## 📖 My React & Next.js Learning Story

### 🎓 The Big Decision (Before Semester Break)

As my 4th semester wrapped up, I had this crazy ambition - rebuild my entire Laravel spa booking system (which I'd already rebuilt from PHP) into something even more modern for my **FYP project**. But this time, I wanted to go full-stack with a proper frontend framework. The question was: **which framework?**

### 🤔 Vue vs React vs Angular? (Early August 2024)

At first, **Vue.js** seemed like the obvious choice. Everyone I talked to said the same thing: *"Vue is the easiest to learn!"*, *"It's more beginner-friendly than React!"*, *"Angular is way too complex, avoid it!"* 

But then I started thinking differently. Sure, Vue might be easier to learn initially, but what about in the long run? I did my research:

**React** has:
- The **biggest community** and ecosystem
- The **most job opportunities** in Malaysia and globally  
- **Flexibility** - you can build it however you want
- **Massive library ecosystem** - there's a package for everything
- It's used by Facebook, Netflix, Airbnb, and tons of major companies

So I made my decision: I'm going with **React**, even if it's harder. Better to invest time learning something that'll be more valuable in the long run, right?

### 📺 The BroCode Crash Course (August 8-9, 2024)

I found this absolute gem on YouTube - **[BroCode's React Full Course](https://www.youtube.com/watch?v=CgkZ7MvWUAA)**. It's a comprehensive 12-hour tutorial covering everything from basics to advanced React concepts.

And here's the crazy part - **I finished the entire course in 2 days**. 

**Day 1 (August 8):**
- Woke up at 9 AM, grabbed breakfast
- Started the course at 10 AM
- Coded along with every single example
- Took short breaks for meals
- By midnight, I was 6 hours in
- Finally crashed at 2 AM

**Day 2 (August 9):**
- Started again at 10 AM
- Finished the remaining 6 hours
- Rewatched confusing parts
- Practiced building small components on my own
- By 10 PM, I felt like I finally "understood" React

The concepts I grasped:
- **Components & JSX** - Building blocks of React
- **Props** - Passing data between components
- **State Management** - Using `useState`
- **Event Handling** - onClick, onChange, etc.
- **Conditional Rendering** - Showing/hiding components
- **Lists & Keys** - Rendering arrays of data
- **Forms** - Handling user input
- **useEffect Hook** - Side effects and lifecycle

By the end of day 2, I was thinking in components. I could visualize how to break down a UI into reusable pieces. React's component-based architecture just *clicked*.

### ⚡ Discovering Next.js (Mid-August 2024)

Just when I thought I had my tech stack figured out, someone mentioned **Next.js** in a Discord server I was lurking in. They said:

*"Why use plain React when Next.js gives you all of this out of the box?"*
- **File-based routing** - No React Router configuration needed!
- **Server-side rendering** - Better SEO and performance
- **Built-in API routes** - Can create backend endpoints in the same project!
- **Image optimization** - Automatic image optimization
- **Fast refresh** - Lightning-fast development experience
- **TypeScript support** - First-class TypeScript integration

I looked into it and thought, *"If I'm building something for my FYP, why not use the best tools available?"*

So I started learning Next.js. The learning curve wasn't that steep since I already knew React. The main new concepts were:
- App Router vs Pages Router (I went with App Router)
- Server Components vs Client Components
- File-based routing with folders
- Loading and error boundaries
- Layouts and templates

Within a week, I was comfortable with Next.js and decided: **This is what I'm using for my project!**

### 📚 The Never-Ending YouTube Binge (August - September 2024)

And then... the real learning began. Over the next month and a half, I basically lived on YouTube. My browser history was just:
- "React hooks tutorial"
- "Redux Toolkit crash course"
- "useContext vs Redux"
- "React Hook Form tutorial"
- "How to handle forms in React"
- "Zod validation React"
- "TanStack Query tutorial"
- "Axios vs Fetch"
- "TypeScript with React"

**What I Had to Learn:**

**React Hooks Deep Dive:**
- **useState** - Managing local component state (understanding closures and why state doesn't update immediately was a journey!)
- **useEffect** - Side effects, dependency arrays (I spent hours debugging infinite loops because I didn't understand dependencies properly)
- **useContext** - Context API for avoiding prop drilling (made my life so much easier!)
- **useMemo & useCallback** - Performance optimization (learned when NOT to use them too)
- **Custom Hooks** - Creating reusable stateful logic

**State Management - Redux Toolkit:**

This was probably the **hardest concept** to grasp. I watched at least 10 different Redux tutorials before it finally clicked.

The Redux concepts I struggled with:
- **Store** - Global state container
- **Slices** - Reducers + actions combined
- **Actions & Reducers** - How state actually updates
- **Selectors** - Reading from the store
- **Thunks** - Async operations

But once I understood the pattern, Redux became my go-to for managing complex state. The DevTools are amazing for debugging!

**Form Handling:**
- **React Hook Form** - Performance-focused form library
- **Zod** - Schema validation (TypeScript-first!)
- Form validation patterns
- Error handling in forms

**Data Fetching:**
- **Axios** - HTTP client (I chose this over Fetch because it reduces boilerplate)
- **TanStack Query** - Server state management

About TanStack Query... I actually learned it and thought it looked amazing with its automatic caching, background refetching, and optimistic updates. But honestly, when I started building my project, I found that **Axios + Redux** was working fine for my use case, so I didn't end up using TanStack Query. Maybe in my next project!

**TypeScript:**
- Types and Interfaces
- Generics
- Type inference
- Utility types

**Styling:**
- **Tailwind CSS** - Utility-first CSS (no more writing CSS files!)
- **shadcn/ui** - Beautiful pre-built components
- Responsive design patterns

### 🔥 The Day-to-Night Coding Marathon (August - September 2024)

Calling it a "semester break" would be a lie. It was more like an **intense 2-month self-imposed full-stack bootcamp**. 

My typical day:
- Wake up around 10 AM (if I slept)
- Coffee + breakfast while watching a tutorial
- Start coding by 11 AM
- Code straight through lunch
- Brief dinner break
- Code more
- "Just one more feature" at 11 PM
- Suddenly it's 2 AM
- "Let me just fix this bug"
- Look at the clock: **6 AM**
- Finally crash from exhaustion
- Repeat

My parents were worried. My friends thought I'd gone crazy. But I was in this incredible flow state where I was learning so much every single day. Every bug I fixed taught me something new about React's rendering cycle, or Redux's state updates, or how async/await really works.

### 💪 Learning Laravel as Pure API (The Backend Journey)

This project also required me to learn **Laravel in a completely different way** than I had before. Previously, I used Laravel with Blade templates - a traditional server-rendered approach.

Now I had to learn:
- **RESTful API design** - Proper HTTP status codes, REST conventions
- **Laravel API Resources** - Formatting JSON responses properly
- **Stateless authentication** - JWT tokens, OAuth 2.0
- **CORS configuration** - Making frontend and backend talk to each other
- **API middleware** - Authorization, rate limiting
- **Sanctum vs Passport** - I went with Passport for OAuth 2.0

No more Blade templates. No more server-side sessions. Everything had to be **pure JSON responses** and **token-based authentication**.

### 😤 The 6-Day Laravel Passport Battle (Late August 2024)

If I'm completely honest, setting up **Laravel Passport (OAuth 2.0)** was the **most frustrating** part of this entire project. It took me **almost 6 days** to get it working correctly!

The challenges:
- OAuth 2.0 concepts were abstract and confusing
- **HTTP-only cookies** with CORS - Why won't the cookies be sent?!
- **Token refresh logic** - When does the access token expire?
- **Passport client setup** - Which grant type do I use?
- **Cookie settings** - secure, httpOnly, sameSite - getting all of these right
- **CORS preflight requests** - OPTIONS requests failing

I probably spent 3 of those days just on the **cookie-based authentication** part. The tokens would work with localStorage, but I wanted the security of HTTP-only cookies. Getting the browser to actually send those cookies in cross-origin requests... man, that was a battle.

By the end of those 6 days, I had read the Laravel Passport documentation probably 15 times, watched every Passport tutorial on YouTube, and had about 50 Stack Overflow tabs open.

But when it finally worked? When I saw the cookies being sent correctly and the authentication flow working smoothly? Best feeling ever.

### 🌐 The Never-Ending CORS Nightmare

Speaking of frustrations... **CORS issues**. The bane of every full-stack developer's existence.

`Access-Control-Allow-Origin` errors. `CORS policy: No 'Access-Control-Allow-Credentials'` errors. Preflight requests failing. Cookies not being sent.

The backend was running on `localhost:8000`. The frontend on `localhost:3000`. They refused to talk to each other nicely.

I had to learn about:
- **CORS headers** - Access-Control-Allow-Origin, -Methods, -Headers, -Credentials
- **Preflight requests** - OPTIONS requests before actual requests
- **withCredentials** - Enabling cookies in Axios
- **Laravel CORS package** - Configuration in `config/cors.php`

It took countless hours of tweaking configurations, clearing caches, and testing in different browsers before everything worked smoothly.

### 🎯 Why Axios Over Fetch?

One decision I'm really proud of: choosing **Axios over the native Fetch API**. While Fetch is built into JavaScript, Axios just makes life so much easier:

**Axios advantages:**
- Automatic JSON transformation (no more `response.json()`)
- Better error handling (actually throws on error status codes)
- **Interceptors** - Perfect for adding auth tokens to every request
- Request/response transformation
- Timeout configuration
- Cancel requests easily
- Better browser support

The interceptors feature alone made it worth it. I could add the authentication logic once and have it apply to all API calls. Beautiful!

### 🎉 The Finish Line (Late September 2024)

And then, amazingly, in **late September** - right before my **5th semester started** - I finished it!

The full-stack system was complete:
- ✅ Laravel API backend with Passport authentication
- ✅ Next.js frontend with modern React patterns
- ✅ Redux Toolkit for state management
- ✅ Complete booking system with calendar
- ✅ Payment integration (ToyyibPay)
- ✅ Admin dashboard with analytics
- ✅ Role-based access control
- ✅ Responsive design with Tailwind CSS
- ✅ Type-safe with TypeScript

I had done it. **Solo**. I built a production-quality full-stack application using technologies I learned from scratch in just 2 months.



### 🎓 The FYP Head Start

The best part about finishing this before semester 5? **This project IS my FYP project!**

While my classmates are just starting to plan their final year projects, I've already built mine. All those sleepless nights, all the CORS frustrations, all the Redux confusion - it was all worth it because I'm already way ahead.

And more importantly, **I can confidently say: I know how to create a full-stack system for real now**. Not just following a tutorial, but actually architecting, building, and deploying a complete application. Solo.

---

## ✨ Features

### 🏠 Client Features

**Service Browsing:**
- Beautiful service catalog with categories
- Search and filter functionality
- Service details with pricing and duration
- High-quality service images

**Booking System:**
- Multi-step booking process
- Real-time therapist availability
- Calendar date picker
- Time slot selection
- Booking confirmation

**User Management:**
- User registration with validation
- Login with email/password
- Google OAuth integration
- Profile management
- Password change
- Profile picture upload

**My Bookings:**
- View all bookings with status
- Detailed booking information page
- Cancel bookings
- Payment retry for failed payments
- Download receipts (PDF)

**Payment Integration:**
- ToyyibPay payment gateway
- Cash payment option
- Payment status tracking
- Secure payment flow

### 👨‍💼 Admin/Therapist Features

**Dashboard:**
- Real-time statistics (revenue, bookings, customers)
- Sales charts (last 15 days)
- Top services analytics
- Appointment status distribution
- Recent activity feed
- Month-over-month trends

**Booking Management:**
- View all bookings
- Data table with sorting and filtering
- Update booking status
- Cancel bookings
- Search functionality
- Date range filtering
- Status filtering

**Service Management:**
- CRUD operations for services
- Category management
- Image upload
- Pricing and duration setup
- Therapist assignment

**User Management:**
- View all users
- Role-based access
- User profile management

### 🎨 UI/UX Features

- **Responsive Design** - Works on all devices
- **Dark Mode Support** - Toggle between light and dark themes
- **Loading States** - Skeleton loaders and spinners
- **Error Handling** - User-friendly error messages
- **Toast Notifications** - Real-time feedback
- **Modal Dialogs** - Confirmation dialogs
- **Form Validation** - Real-time validation with Zod
- **Smooth Animations** - Tailwind CSS transitions

---

## 🚀 Installation

### Prerequisites

- Node.js 18+ 
- npm or yarn or pnpm
- Backend API running (Laravel API)

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/lunara-spa-fullstack.git
cd lunara-spa-fullstack/frontend
```

### Step 2: Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### Step 3: Environment Configuration

Create a `.env.local` file in the frontend directory:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000

# Google OAuth Client ID (Optional)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id-here
```

### Step 4: Start Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Your application will be available at `http://localhost:3000` 🎉

### Step 5: Build for Production

```bash
npm run build
npm start
```

---

## 🛠️ Tech Stack

### Core Framework
- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type safety

### State Management
- **Redux Toolkit** - Global state management
- **React Context** - Local state sharing

### Forms & Validation
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **@hookform/resolvers** - Form resolver integration

### Styling
- **Tailwind CSS** - Utility-first CSS
- **shadcn/ui** - UI component library
- **Radix UI** - Headless UI primitives
- **Lucide React** - Icon library

### Data Fetching
- **Axios** - HTTP client
- **React Hooks** - useState, useEffect for data management

### Authentication
- **HTTP-only Cookies** - Secure token storage
- **Google OAuth** - Social authentication

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting (if configured)
- **TypeScript** - Static type checking

---

## 📂 Project Structure

```
frontend/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   ├── register/
│   │   ├── forgot-password/
│   │   └── reset-password/
│   ├── booking/
│   ├── categories/
│   ├── services/
│   ├── my-bookings/
│   │   └── [id]/              # Booking details page
│   ├── profile/
│   ├── dashboard/
│   │   ├── bookings/
│   │   ├── services/
│   │   ├── users/
│   │   └── categories/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── ui/                     # shadcn/ui components
│   ├── layout/                 # Layout components
│   └── dashboard/              # Dashboard components
├── lib/
│   ├── axios.ts                # Axios configuration
│   ├── config.ts               # App configuration
│   ├── utils.ts                # Utility functions
│   └── toast.tsx               # Toast notifications
├── app/
│   └── features/
│       └── auth/
│           └── authSlice.ts    # Redux auth slice
├── store.ts                    # Redux store
├── types/                      # TypeScript types
└── public/
    ├── Logo/
    └── img/
```

---

## 🎨 Key Components

### Authentication Flow

```typescript
// Redux slice for auth state management
const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, isAuthenticated: false },
  reducers: {
    login: (state, action) => { /* ... */ },
    logout: (state) => { /* ... */ }
  }
})
```

### API Integration

```typescript
// Axios instance with interceptors
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // Send cookies
})

api.interceptors.request.use(/* Auth token */)
```

### Form Validation

```typescript
// Zod schema validation
const bookingSchema = z.object({
  service_id: z.number(),
  therapist_id: z.number(),
  appointment_date: z.string(),
  appointment_time: z.string(),
})
```

---

## 🔐 Security Features

- ✅ **HTTP-only cookies** for auth tokens
- ✅ **CSRF protection** through backend
- ✅ **XSS prevention** with React's built-in escaping
- ✅ **Type safety** with TypeScript
- ✅ **Input validation** with Zod
- ✅ **Secure API calls** with Axios interceptors
- ✅ **Environment variables** for sensitive data

---

## 📱 Responsive Design

The application is fully responsive and optimized for:
- 📱 Mobile devices (320px and up)
- 📱 Tablets (768px and up)
- 💻 Desktops (1024px and up)
- 🖥️ Large screens (1280px and up)

---

## 🐛 Common Issues & Solutions

### Issue: API calls failing with CORS error

**Solution:** Make sure your backend CORS is configured and `NEXT_PUBLIC_API_URL` is correct:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Issue: Environment variables not working

**Solution:** Restart the dev server after changing `.env.local`:
```bash
npm run dev
```

### Issue: Images not loading

**Solution:** Check that the image paths are correct and the backend storage is linked:
```bash
cd backend
php artisan storage:link
```

### Issue: Authentication not persisting

**Solution:** Ensure cookies are being sent with `withCredentials: true` in Axios config.

---

## 🎯 Future Enhancements

- [ ] Real-time notifications with WebSockets
- [ ] Progressive Web App (PWA) support
- [ ] Internationalization (i18n) for multiple languages
- [ ] Advanced analytics dashboard
- [ ] Email notifications
- [ ] SMS notifications for appointments
- [ ] Review and rating system
- [ ] Loyalty points system
- [ ] Multi-location support

---

## 📄 License

### MIT License (Code Only)

```
MIT License

Copyright (c) 2024 Muhammad Ilyas Bin Amran

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 👤 Author

**Muhammad Ilyas Bin Amran**

- 📧 Email: muhammadilyasamran@gmail.com
- 💻 GitHub: [@unatesta175](https://github.com/unatesta175)
- 🔗 LinkedIn: [MUHAMMAD ILYAS BIN AMRAN](https://linkedin.com/in/muhammad-ilyas-bin-amran-3a9a2a298)

---

## 🙏 Acknowledgments

### Special Thanks

- **BroCode** - For the incredible [React Full Course](https://www.youtube.com/watch?v=CgkZ7MvWUAA) that started my React journey (seriously, watch this if you're learning React!)
- **Vercel** - For creating Next.js and amazing documentation
- **Redux Toolkit Team** - For making state management bearable
- **shadcn** - For the beautiful UI component library
- **Next.js Community** - For excellent resources and support
- **Stack Overflow** - For solving my 3 AM debugging sessions
- **YouTube Tutorial Creators** - For teaching me React hooks at 2x speed
- **My Coffee Machine** - For keeping me awake during those 6 AM coding sessions

---

## 📞 Support

Need help? Have questions?

- 📧 Email: muhammadilyasamran@gmail.com
- 📖 Next.js Docs: [Next.js Documentation](https://nextjs.org/docs)
- 📖 React Docs: [React Documentation](https://react.dev)
- 📖 Redux Toolkit: [Redux Toolkit Documentation](https://redux-toolkit.js.org)

---

## 🎓 Learning Resources

Want to learn React and Next.js like I did?

### Must-Watch Courses:
- 🎥 **[React Full Course - BroCode](https://www.youtube.com/watch?v=CgkZ7MvWUAA)** - The course that started it all! 12 hours of pure React goodness (I finished it in 2 days!)
- 📚 **[Next.js Documentation](https://nextjs.org/docs)** - Official docs are actually great
- 📚 **[React Documentation](https://react.dev)** - New React docs with hooks
- 🎥 **YouTube** - Seriously, YouTube is amazing for learning React

### Topics to Learn (in order):
1. JavaScript ES6+ features
2. React basics (components, props, state)
3. React hooks (useState, useEffect, useContext)
4. Redux Toolkit for state management
5. Next.js App Router
6. TypeScript basics
7. Form handling with React Hook Form
8. API integration with Axios

---

<div align="center">

### ⭐ If you found this project helpful, please consider giving it a star!

**Built with ⚡ React, Next.js, and countless hours of YouTube tutorials by Muhammad Ilyas Bin Amran**

*From React beginner to full-stack developer in one summer break*

*"The best way to learn React? Build something real. Preferably at 3 AM when the bugs hit different."*

---

![Made with Next.js](https://img.shields.io/badge/Made%20with-Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)
![Made with React](https://img.shields.io/badge/Made%20with-React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Powered by Redux](https://img.shields.io/badge/Powered%20by-Redux-764ABC?style=for-the-badge&logo=redux&logoColor=white)
![Learned from YouTube](https://img.shields.io/badge/Learned%20from-YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white)
![Educational Purpose](https://img.shields.io/badge/Educational-Purpose%20Only-orange?style=for-the-badge&logo=graduation-cap&logoColor=white)

**© 2024 Muhammad Ilyas Bin Amran**

*Final Year Project • Built August-September 2024 • 2-Month Semester Break Development • Learned React in 2 Days • For Learning Purposes Only*

*Special shoutout to [BroCode](https://www.youtube.com/@BroCodez) for the React course that made this all possible! 🙌*

</div>
