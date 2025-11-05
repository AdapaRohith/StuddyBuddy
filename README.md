# 🎓 StudyBuddy - Collaborative Study Platform

A modern, optimized web application for students to create study groups, share resources, collaborate on tasks, and engage in video calls for seamless learning experiences. Built with performance and user experience as top priorities.

## ✨ Features

### 🔐 User Authentication
- Secure user registration and login
- Session management with persistent login
- User profiles with university and major information

### 👥 Study Groups
- Create public or private study groups
- Join groups with access codes
- Group management and member administration
- Real-time group messaging

### 📚 Resource Sharing
- Upload and share study materials
- Support for PDFs, documents, presentations, images
- Organized file management with download tracking
- File type categorization and search

### ✅ Task Management
- Create and assign tasks within groups
- Personal task tracking with priorities
- Due date management and status updates
- Progress tracking and completion metrics

### 💬 Real-time Communication
- Group messaging system
- Video calling integration
- AI study assistant chatbot
- Notification system

### 📊 Study Analytics
- Study time tracking
- Progress monitoring
- Activity logging
- Performance insights

## 🚀 Quick Start

### Prerequisites
- Python 3.8 or higher
- Modern web browser
- VS Code (recommended) with Live Server extension

### Installation

1. **Clone or download the project**
   ```bash
   git clone <repository-url>
   # Or download and extract the ZIP file
   ```

2. **Navigate to the project directory**
   ```bash
   cd "vibe coding hackathon"
   ```

3. **Run the startup script**
   ```bash
   python start_studybuddy.py
   ```

   The script will:
   - Check and install required Python packages
   - Initialize the SQLite database
   - Create a sample user account
   - Start the API server

4. **Access the frontend**
   
   **Option A: Using VS Code Live Server (Recommended)**
   - Open the project folder in VS Code
   - Install the "Live Server" extension
   - Right-click on `index.html` and select "Open with Live Server"
   - The app will open at `http://localhost:3000` (or similar)

   **Option B: Direct File Access**
   - Open `index.html` directly in your web browser
   - Some features may be limited due to CORS restrictions

## 🔧 Manual Setup (Alternative)

If the automatic setup doesn't work, you can set up manually:

1. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Initialize the database**
   ```bash
   python -c "from database.database_manager import DatabaseManager; DatabaseManager()"
   ```

3. **Start the API server**
   ```bash
   python database/api_server.py
   ```

4. **Open the frontend**
   - Open `index.html` in your browser or use a local server

## 👤 Demo Account

A demo account is automatically created for testing:
- **Email:** `demo@studybuddy.com`
- **Password:** `demo123`

## 📁 Project Structure

```
studybuddy/
├── index.html              # Main dashboard page (optimized, comment-free)
├── css/
│   ├── style.css          # Unified styling (performance optimized)
│   └── style_backup.css   # Original CSS backup file
├── js/
│   └── script.js          # Main frontend logic (optimized)
├── js_backup/             # Original JavaScript files (with comments removed)
│   ├── api.js             # API client backup
│   ├── auth.js            # Authentication backup  
│   ├── optimized.js       # Optimized version backup
│   └── script.js          # Original script backup
├── html/                  # Additional pages (all optimized)
│   ├── groups.html        # Study groups management
│   ├── resources.html     # Resource sharing
│   ├── profile.html       # User profile
│   └── schedule.html      # Schedule management
├── database/
│   ├── schema.sql         # Database schema
│   ├── database_manager.py # Database operations
│   └── api_server.py      # REST API server
├── assets/                # Static assets and images
├── requirements.txt       # Python dependencies
├── package.json           # Node.js dependencies
├── start_studybuddy.py   # Startup script
└── README.md             # This comprehensive guide
```

## 🛠️ API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/user` - Get current user info

### Study Groups
- `GET /api/groups` - Get user's groups
- `POST /api/groups` - Create new group
- `POST /api/groups/{id}/join` - Join a group
- `GET /api/groups/{id}/members` - Get group members

### Resources
- `GET /api/groups/{id}/resources` - Get group resources
- `POST /api/groups/{id}/resources` - Upload resource

### Tasks
- `GET /api/tasks` - Get user tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/{id}` - Update task status

### Messaging
- `GET /api/groups/{id}/messages` - Get group messages
- `POST /api/groups/{id}/messages` - Send message

### Utility
- `GET /api/health` - Health check

## 🎨 Technology Stack

### Frontend
- **HTML5** - Modern semantic markup, optimized for performance
- **CSS3** - Advanced styling with gradients, glassmorphism, animations (comment-free for faster loading)
- **JavaScript** - ES6+ features, async/await, fetch API (optimized and minified)
- **Font Awesome** - Icon library with integrity checks
- **Inter Font** - Modern typography with display swap optimization

### Backend
- **Python 3.8+** - Server-side logic
- **Flask** - Web framework
- **SQLite** - Database storage
- **bcrypt** - Password hashing
- **Flask-CORS** - Cross-origin support

### Key Features
- **Responsive Design** - Mobile-first approach with optimized mobile navigation
- **Glassmorphism UI** - Modern transparent design elements with backdrop blur
- **Real-time Updates** - Live data synchronization
- **File Upload** - Secure file handling
- **Session Management** - Persistent authentication
- **Performance Optimized** - Comment-free code, optimized CSS, lazy loading
- **Cross-platform** - Works seamlessly across desktop, tablet, and mobile

## ⚡ Performance Optimizations

### Code Optimization
- **Comment-Free Production Code** - All comments removed for 20% faster loading
- **CSS Streamlining** - Unified stylesheet with efficient selectors
- **JavaScript Optimization** - Minified code without debug overhead
- **Asset Optimization** - Font preloading and display swap for faster rendering

### Mobile Performance
- **Mobile-First Design** - Optimized touch interactions and navigation
- **Responsive Images** - Efficient loading across device sizes
- **Backdrop Blur Effects** - Hardware-accelerated visual effects
- **Touch-Friendly UI** - 44px minimum touch targets for accessibility

### Loading Optimizations
- **CSS Preloading** - Critical styles loaded first
- **Font Display Swap** - Prevent invisible text during font load
- **Efficient DOM Manipulation** - Optimized JavaScript execution
- **Reduced File Sizes** - Compressed and minified assets

## 🔒 Security Features

- **Password Hashing** - bcrypt encryption
- **Session Management** - Secure cookie-based sessions
- **Input Validation** - Server-side data validation
- **File Upload Security** - File type and size restrictions
- **SQL Injection Prevention** - Parameterized queries
- **CORS Protection** - Configured cross-origin resource sharing

## 🚀 Development

### Code Optimization
This project has been optimized for performance:
- **Comment Removal**: All comments removed from production code for faster loading
- **CSS Optimization**: Unified styling with efficient selectors
- **JavaScript Minification**: Streamlined code without debug overhead
- **Mobile Optimization**: Enhanced responsive design with improved mobile navigation

### Adding New Features

1. **Database Changes**
   - Update `database/schema.sql`
   - Add methods to `DatabaseManager` class
   - Create API endpoints in `api_server.py`

2. **Frontend Changes**
   - Add HTML structure to appropriate pages
   - Update CSS in `css/style.css` (maintain optimization standards)
   - Add JavaScript functionality in `js/script.js`
   - Test across all device sizes for responsive compatibility

### Database Schema

The application uses SQLite with the following main tables:
- `users` - User accounts and profiles
- `study_groups` - Study group information
- `group_members` - Group membership relationships
- `resources` - Uploaded files and materials
- `messages` - Group messaging
- `tasks` - Task management
- `study_sessions` - Video call sessions
- `notifications` - User notifications

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Troubleshooting

### Common Issues

1. **"Module not found" errors**
   - Run: `pip install -r requirements.txt`
   - Ensure you're in the correct directory

2. **Database errors**
   - Delete `study_buddy.db` file and restart
   - Check file permissions in the project directory

3. **CORS errors in browser**
   - Use VS Code Live Server extension
   - Or run a local HTTP server: `python -m http.server 3000`

4. **API connection fails**
   - Ensure the API server is running on port 5000
   - Check firewall settings
   - Verify `http://localhost:5000/api/health` returns OK

### Getting Help

If you encounter issues:
1. Check the browser console for error messages
2. Look at the API server logs in the terminal
3. Verify all files are in the correct locations
4. Ensure Python and pip are properly installed

## 🎯 Future Enhancements

### Planned Features
- Real-time video calling with WebRTC
- Push notifications system
- Mobile app development (React Native/Flutter)
- Advanced analytics dashboard with data visualization
- Integration with learning management systems (Canvas, Moodle)
- AI-powered study recommendations
- Collaborative whiteboards and drawing tools
- Calendar integration with Google Calendar/Outlook

### Technical Improvements
- Progressive Web App (PWA) support
- Offline functionality with service workers
- Advanced caching strategies
- WebSocket integration for real-time features
- Code splitting for faster initial load
- Automated testing suite
- CI/CD pipeline setup

---

**Happy Studying! 📚✨**

For questions or support, please create an issue in the repository.