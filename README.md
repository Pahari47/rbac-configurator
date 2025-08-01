# 🔐 RBAC Configurator

A modern web application for managing Role-Based Access Control (RBAC) with an AI-powered assistant. Built with Next.js, Supabase, and Tailwind CSS.

## 🎯 What is RBAC?

Imagine you have a toy box with different toys. Some friends can play with all toys, others only with blocks, and some can't touch anything. RBAC is like giving each friend a special card that says exactly what they can and cannot play with!

## ✨ Features

- **Role Management**: Create, edit, and delete user roles
- **Permission Management**: Define granular permissions with descriptions
- **Role-Permission Assignment**: Assign permissions to roles with a simple interface
- **User-Role Assignment**: Assign roles to users for access control
- **AI Assistant**: Natural language commands to configure RBAC
- **Modern UI**: Clean, responsive interface with dark mode support
- **Real-time Database**: Powered by Supabase for reliable data storage

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Google Gemini API key (for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd rbac-configurator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Set up Supabase Database**
   
   Create the following tables in your Supabase database:

   ```sql
   -- Roles table
   CREATE TABLE roles (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     name TEXT NOT NULL UNIQUE,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Permissions table
   CREATE TABLE permissions (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     name TEXT NOT NULL UNIQUE,
     description TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Role-Permission assignments
   CREATE TABLE role_permissions (
     role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
     permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
     PRIMARY KEY (role_id, permission_id)
   );

   -- User-Role assignments
   CREATE TABLE user_roles (
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
     PRIMARY KEY (user_id, role_id)
   );
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage

### 1. Authentication
- Register a test user using the "Register Test User" button on the login page
- Or sign up with your own email and password

### 2. Role Management
- Navigate to "Roles" in the dashboard
- Create roles like "Admin", "Editor", "Viewer"
- Edit or delete existing roles

### 3. Permission Management
- Go to "Permissions" to create granular permissions
- Examples: "can_edit_articles", "can_delete_users", "can_view_reports"
- Add descriptions for better organization

### 4. Assign Permissions to Roles
- Use "Assign Permissions" to link permissions to roles
- Select a role and toggle permissions on/off
- Changes are saved automatically

### 5. Assign Roles to Users
- Use "Assign Roles" to give users specific roles
- Select a user and assign appropriate roles
- Users inherit all permissions from their assigned roles

### 6. AI Assistant
- Try the "AI Configurator" for natural language commands
- Examples:
  - "Give editors permission to edit articles"
  - "Allow admins to delete users"
  - "Let viewers see reports"

## 🛠 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI**: Google Gemini API
- **Deployment**: Vercel-ready

## 📁 Project Structure

```
rbac-configurator/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   ├── login/            # Authentication
│   └── globals.css       # Global styles
├── components/            # Reusable components
│   ├── ui/               # UI components
│   └── NavBar.tsx        # Navigation
├── lib/                  # Utility functions
│   ├── supabase.ts       # Supabase client
│   ├── supabaseAdmin.ts  # Admin client
│   └── utils.ts          # Helper functions
└── public/               # Static assets
```

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Yes |
| `GEMINI_API_KEY` | Google Gemini API key | Yes (for AI features) |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Supabase](https://supabase.com/) for the backend-as-a-service
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Radix UI](https://www.radix-ui.com/) for accessible UI components
- [Google Gemini](https://ai.google.dev/) for AI capabilities

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

Made with ❤️ for better access control management 