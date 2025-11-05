
class AuthManager {
    constructor() {
        this.loginModal = null;
        this.registerModal = null;
        this.init();
    }

    init() {
        this.createAuthModals();
        this.setupEventListeners();
        this.checkAuthOnLoad();
    }

    createAuthModals() {
        
        this.loginModal = this.createModal('login', `
            <div class="auth-modal-content">
                <div class="auth-header">
                    <h2>Welcome Back</h2>
                    <p>Continue your learning journey with StudyBuddy</p>
                </div>
                <form id="loginForm" class="auth-form">
                    <div class="form-group">
                        <label for="loginEmail">Email Address</label>
                        <input type="email" id="loginEmail" name="email" placeholder="Enter your email address" required>
                    </div>
                    <div class="form-group">
                        <label for="loginPassword">Password</label>
                        <input type="password" id="loginPassword" name="password" placeholder="Enter your password" required>
                    </div>
                    <div class="form-options">
                        <label class="checkbox-container">
                            <input type="checkbox" id="rememberMe">
                            <span class="checkmark"></span>
                            Keep me signed in
                        </label>
                        <a href="#" class="forgot-password">Forgot password?</a>
                    </div>
                    <button type="submit" class="auth-button">Sign In to StudyBuddy</button>
                </form>
                <div class="auth-switch">
                    <p>New to StudyBuddy? <a href="#" id="switchToRegister">Create an account</a></p>
                </div>
            </div>
        `);

        
        this.registerModal = this.createModal('register', `
            <div class="auth-modal-content">
                <div class="auth-header">
                    <h2>Create Your Account</h2>
                    <p>Join thousands of students collaborating and achieving academic excellence</p>
                </div>
                <form id="registerForm" class="auth-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="registerFullName">Full Name</label>
                            <input type="text" id="registerFullName" name="fullName" placeholder="Enter your full name" required>
                        </div>
                        <div class="form-group">
                            <label for="registerUsername">Username</label>
                            <input type="text" id="registerUsername" name="username" placeholder="Choose a username" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="registerEmail">Email Address</label>
                        <input type="email" id="registerEmail" name="email" placeholder="Enter your email address" required>
                    </div>
                    <div class="form-group">
                        <label for="registerPassword">Password</label>
                        <input type="password" id="registerPassword" name="password" placeholder="Create a secure password" required minlength="6">
                        <small class="password-hint">Password must be at least 6 characters long</small>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="registerUniversity">University</label>
                            <input type="text" id="registerUniversity" name="university" placeholder="Your university (optional)">
                        </div>
                        <div class="form-group">
                            <label for="registerMajor">Field of Study</label>
                            <input type="text" id="registerMajor" name="major" placeholder="Your major (optional)">
                        </div>
                    </div>
                    <div class="terms-agreement">
                        <label class="checkbox-container">
                            <input type="checkbox" id="agreeTerms" required>
                            <span class="checkmark"></span>
                            I agree to the <a href="#" class="terms-link">Terms of Service</a> and <a href="#" class="privacy-link">Privacy Policy</a>
                        </label>
                    </div>
                    <button type="submit" class="auth-button">Create My Account</button>
                </form>
                <div class="auth-switch">
                    <p>Already part of our community? <a href="#" id="switchToLogin">Sign in here</a></p>
                </div>
            </div>
        `);

        
        this.addAuthStyles();
    }

    createModal(type, content) {
        const modal = document.createElement('div');
        modal.className = `auth-modal ${type}-modal`;
        modal.innerHTML = `
            <div class="auth-modal-overlay">
                <div class="auth-modal-dialog">
                    <button class="auth-modal-close">&times;</button>
                    ${content}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        return modal;
    }

    addAuthStyles() {
        if (document.getElementById('auth-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'auth-styles';
        styles.textContent = `
            .auth-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 10000;
                display: none;
                animation: fadeIn 0.3s ease-out;
            }

            .auth-modal.show {
                display: flex;
            }

            .auth-modal-overlay {
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, rgba(15, 15, 35, 0.95) 0%, rgba(26, 26, 62, 0.9) 50%, rgba(45, 27, 105, 0.95) 100%);
                backdrop-filter: blur(10px);
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
            }

            .auth-modal-dialog {
                background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%);
                backdrop-filter: blur(25px);
                border-radius: 24px;
                padding: 50px 40px;
                max-width: 480px;
                width: 100%;
                position: relative;
                box-shadow: 
                    0 25px 80px rgba(0, 0, 0, 0.3),
                    0 0 0 1px rgba(255, 255, 255, 0.1),
                    inset 0 1px 0 rgba(255, 255, 255, 0.2);
                border: 1px solid rgba(255, 255, 255, 0.1);
                animation: slideUp 0.4s ease-out;
                margin: auto;
            }

            .auth-modal-close {
                position: absolute;
                top: 24px;
                right: 24px;
                background: rgba(255, 255, 255, 0.1);
                border: none;
                font-size: 20px;
                cursor: pointer;
                color: rgba(255, 255, 255, 0.8);
                width: 36px;
                height: 36px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: all 0.3s;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .auth-modal-close:hover {
                background: rgba(255, 255, 255, 0.2);
                color: #ffffff;
                transform: scale(1.1);
            }

            .auth-header {
                text-align: center;
                margin-bottom: 35px;
            }

            .auth-header h2 {
                font-family: 'Inter', sans-serif;
                font-weight: 700;
                font-size: 32px;
                margin: 0 0 12px 0;
                color: #ffffff;
                text-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
                letter-spacing: -0.5px;
            }

            .auth-header p {
                color: rgba(255, 255, 255, 0.8);
                margin: 0;
                font-size: 16px;
                font-weight: 400;
            }

            .auth-form {
                display: flex;
                flex-direction: column;
                gap: 24px;
            }

            .form-row {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 16px;
            }

            .form-group {
                display: flex;
                flex-direction: column;
                gap: 8px;
                position: relative;
            }

            .password-hint {
                font-size: 12px;
                color: rgba(255, 255, 255, 0.6);
                margin-top: 4px;
            }

            .form-options {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin: -8px 0 8px 0;
            }

            .checkbox-container {
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 14px;
                color: rgba(255, 255, 255, 0.8);
                cursor: pointer;
                position: relative;
            }

            .checkbox-container input[type="checkbox"] {
                appearance: none;
                width: 18px;
                height: 18px;
                border: 2px solid rgba(255, 255, 255, 0.3);
                border-radius: 4px;
                background: transparent;
                cursor: pointer;
                position: relative;
                margin: 0;
            }

            .checkbox-container input[type="checkbox"]:checked {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-color: #667eea;
            }

            .checkbox-container input[type="checkbox"]:checked::after {
                content: '✓';
                position: absolute;
                top: -2px;
                left: 2px;
                color: white;
                font-size: 12px;
                font-weight: bold;
            }

            .terms-agreement {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 12px;
                padding: 16px;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .terms-link, .privacy-link, .forgot-password {
                color: rgba(255, 255, 255, 0.9);
                text-decoration: none;
                font-weight: 500;
                transition: all 0.3s;
            }

            .terms-link:hover, .privacy-link:hover, .forgot-password:hover {
                color: #ffffff;
                text-shadow: 0 0 10px rgba(102, 126, 234, 0.5);
            }

            .forgot-password {
                font-size: 14px;
                opacity: 0.8;
            }

            .form-group label {
                font-family: 'Inter', sans-serif;
                font-weight: 500;
                color: rgba(255, 255, 255, 0.9);
                font-size: 14px;
                margin-bottom: 2px;
            }

            .form-group input {
                padding: 16px 18px;
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 14px;
                font-family: 'Inter', sans-serif;
                font-size: 16px;
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(15px);
                transition: all 0.3s ease;
                outline: none;
                color: #ffffff;
                placeholder-color: rgba(255, 255, 255, 0.5);
            }

            .form-group input::placeholder {
                color: rgba(255, 255, 255, 0.5);
            }

            .form-group input:focus {
                border-color: rgba(102, 126, 234, 0.6);
                background: rgba(255, 255, 255, 0.15);
                box-shadow: 
                    0 0 0 3px rgba(102, 126, 234, 0.2),
                    0 8px 25px rgba(0, 0, 0, 0.15);
                transform: translateY(-2px);
            }

            .auth-button {
                padding: 18px 28px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                border-radius: 14px;
                font-family: 'Inter', sans-serif;
                font-weight: 600;
                font-size: 16px;
                cursor: pointer;
                transition: all 0.3s ease;
                margin-top: 15px;
                position: relative;
                overflow: hidden;
                box-shadow: 0 8px 25px rgba(102, 126, 234, 0.25);
            }

            .auth-button::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                transition: left 0.6s;
            }

            .auth-button:hover::before {
                left: 100%;
            }

            .auth-button:hover {
                transform: translateY(-3px);
                box-shadow: 0 15px 40px rgba(102, 126, 234, 0.4);
            }

            .auth-button:active {
                transform: translateY(-1px);
            }

            .auth-switch {
                text-align: center;
                margin-top: 25px;
                padding-top: 25px;
                border-top: 1px solid rgba(255, 255, 255, 0.15);
            }

            .auth-switch p {
                color: rgba(255, 255, 255, 0.7);
                margin: 0;
                font-size: 15px;
            }

            .auth-switch a {
                color: #ffffff;
                text-decoration: none;
                font-weight: 600;
                transition: all 0.3s;
                position: relative;
                text-shadow: 0 2px 10px rgba(102, 126, 234, 0.3);
            }

            .auth-switch a::after {
                content: '';
                position: absolute;
                bottom: -2px;
                left: 0;
                width: 0;
                height: 2px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                transition: width 0.3s ease;
            }

            .auth-switch a:hover::after {
                width: 100%;
            }

            .auth-switch a:hover {
                color: #ffffff;
                text-shadow: 0 2px 15px rgba(102, 126, 234, 0.5);
            }

            .user-menu {
                position: relative;
                display: none;
            }

            .user-menu.show {
                display: block;
            }

            .user-button {
                background: rgba(255, 255, 255, 0.2);
                border: none;
                border-radius: 50px;
                padding: 8px 16px;
                color: white;
                font-family: 'Inter', sans-serif;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.3s;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .user-button:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: translateY(-1px);
            }

            .user-dropdown {
                position: absolute;
                top: 100%;
                right: 0;
                margin-top: 8px;
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(20px);
                border-radius: 12px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
                border: 1px solid rgba(255, 255, 255, 0.2);
                min-width: 200px;
                z-index: 1000;
                opacity: 0;
                transform: translateY(-10px);
                transition: all 0.3s;
                pointer-events: none;
            }

            .user-dropdown.show {
                opacity: 1;
                transform: translateY(0);
                pointer-events: all;
            }

            .user-dropdown-item {
                padding: 12px 16px;
                color: #333;
                text-decoration: none;
                display: block;
                transition: background 0.2s;
                font-family: 'Inter', sans-serif;
                font-size: 14px;
                border: none;
                background: none;
                width: 100%;
                text-align: left;
                cursor: pointer;
            }

            .user-dropdown-item:first-child {
                border-top-left-radius: 12px;
                border-top-right-radius: 12px;
            }

            .user-dropdown-item:last-child {
                border-bottom-left-radius: 12px;
                border-bottom-right-radius: 12px;
            }

            .user-dropdown-item:hover {
                background: rgba(102, 126, 234, 0.1);
            }

            .user-dropdown-divider {
                height: 1px;
                background: rgba(0, 0, 0, 0.1);
                margin: 4px 0;
            }

            @keyframes fadeIn {
                from { 
                    opacity: 0; 
                }
                to { 
                    opacity: 1; 
                }
            }

            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateY(50px) scale(0.9);
                    filter: blur(5px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                    filter: blur(0);
                }
            }

            @media (max-width: 640px) {
                .form-row {
                    grid-template-columns: 1fr;
                    gap: 20px;
                }
                
                .form-options {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 12px;
                }
            }

            @media (max-width: 580px) {
                .auth-modal-dialog {
                    padding: 40px 25px;
                    margin: 15px;
                    max-width: 95%;
                    border-radius: 20px;
                }

                .auth-header h2 {
                    font-size: 26px;
                }

                .auth-modal-overlay {
                    padding: 15px;
                }

                .form-group input {
                    padding: 14px 16px;
                    font-size: 15px;
                }

                .auth-button {
                    padding: 16px 24px;
                    font-size: 15px;
                }

                .terms-agreement {
                    padding: 12px;
                }

                .checkbox-container {
                    font-size: 13px;
                    line-height: 1.4;
                }
            }

            @media (max-width: 380px) {
                .auth-modal-dialog {
                    padding: 35px 20px;
                }

                .auth-header h2 {
                    font-size: 24px;
                }

                .auth-header p {
                    font-size: 14px;
                }
            }
        `;

        document.head.appendChild(styles);
    }

    setupEventListeners() {
        
        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const email = formData.get('email');
            const password = formData.get('password');

            try {
                await api.login(email, password);
                this.hideModal('login');
                this.updateAuthUI();
                
                if (typeof loadUserData === 'function') {
                    loadUserData();
                }
            } catch (error) {
                
            }
        });

        
        document.getElementById('registerForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            
            const userData = {
                username: formData.get('username'),
                email: formData.get('email'),
                password: formData.get('password'),
                full_name: formData.get('fullName'),
                university: formData.get('university') || null,
                major: formData.get('major') || null
            };

            try {
                await api.register(userData);
                this.hideModal('register');
                this.showModal('login');
                
                document.getElementById('loginEmail').value = userData.email;
            } catch (error) {
                
            }
        });

        
        document.getElementById('switchToRegister').addEventListener('click', (e) => {
            e.preventDefault();
            this.hideModal('login');
            this.showModal('register');
        });

        document.getElementById('switchToLogin').addEventListener('click', (e) => {
            e.preventDefault();
            this.hideModal('register');
            this.showModal('login');
        });

        
        document.querySelectorAll('.auth-modal-close').forEach(btn => {
            btn.addEventListener('click', () => {
                this.hideModal('login');
                this.hideModal('register');
            });
        });

        
        document.querySelectorAll('.auth-modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    this.hideModal('login');
                    this.hideModal('register');
                }
            });
        });

        
        
    }

    setupAuthButtons() {
        
        const nav = document.querySelector('nav') || document.querySelector('.nav');
        if (nav && !nav.querySelector('.auth-buttons')) {
            const authButtons = document.createElement('div');
            authButtons.className = 'auth-buttons';
            authButtons.innerHTML = `
                <button class="auth-nav-btn login-btn">Sign In</button>
                <div class="user-menu">
                    <button class="user-button">
                        <span class="user-name">User</span>
                        <span>▼</span>
                    </button>
                    <div class="user-dropdown">
                        <div class="user-dropdown-item user-info">
                            <strong class="user-name">User Name</strong>
                            <small class="user-email">user@email.com</small>
                        </div>
                        <div class="user-dropdown-divider"></div>
                        <button class="user-dropdown-item" id="logoutBtn">Sign Out</button>
                    </div>
                </div>
            `;

            
            const navAuthStyles = document.createElement('style');
            navAuthStyles.textContent = `
                .auth-nav-btn {
                    background: rgba(255, 255, 255, 0.2);
                    border: none;
                    border-radius: 25px;
                    padding: 8px 20px;
                    color: white;
                    font-family: 'Inter', sans-serif;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.3s;
                    font-size: 14px;
                }

                .auth-nav-btn:hover {
                    background: rgba(255, 255, 255, 0.3);
                    transform: translateY(-1px);
                }

                .user-info {
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                    pointer-events: none;
                }

                .user-info small {
                    color: #666;
                    font-size: 12px;
                }
            `;
            document.head.appendChild(navAuthStyles);

            nav.appendChild(authButtons);

            
            authButtons.querySelector('.login-btn').addEventListener('click', () => {
                this.showModal('login');
            });

            const userButton = authButtons.querySelector('.user-button');
            const userDropdown = authButtons.querySelector('.user-dropdown');
            
            userButton.addEventListener('click', () => {
                userDropdown.classList.toggle('show');
            });

            
            document.addEventListener('click', (e) => {
                if (!authButtons.contains(e.target)) {
                    userDropdown.classList.remove('show');
                }
            });

            document.getElementById('logoutBtn').addEventListener('click', async () => {
                try {
                    await api.logout();
                    this.updateAuthUI();
                    
                    window.location.reload();
                } catch (error) {
                    
                }
            });
        }
    }

    async checkAuthOnLoad() {
        const isAuthenticated = await api.checkAuthStatus();
        this.updateAuthUI();
        return isAuthenticated;
    }

    updateAuthUI() {
        const authButtons = document.querySelector('.auth-buttons');
        if (!authButtons) return;

        const loginBtn = authButtons.querySelector('.login-btn');
        const userMenu = authButtons.querySelector('.user-menu');

        if (api.user) {
            
            loginBtn.style.display = 'none';
            userMenu.classList.add('show');
            
            
            const userNameElements = authButtons.querySelectorAll('.user-name');
            const userEmailElements = authButtons.querySelectorAll('.user-email');
            
            userNameElements.forEach(el => {
                el.textContent = api.user.full_name || api.user.username;
            });
            
            userEmailElements.forEach(el => {
                el.textContent = api.user.email;
            });
        } else {
            
            loginBtn.style.display = 'block';
            userMenu.classList.remove('show');
        }
    }

    showModal(type) {
        const modal = type === 'login' ? this.loginModal : this.registerModal;
        modal.classList.add('show');
        
        
        setTimeout(() => {
            const firstInput = modal.querySelector('input');
            if (firstInput) firstInput.focus();
        }, 100);
    }

    hideModal(type) {
        const modal = type === 'login' ? this.loginModal : this.registerModal;
        modal.classList.remove('show');
    }

    
    requireAuth() {
        if (!api.user) {
            this.showModal('login');
            return false;
        }
        return true;
    }
}


document.addEventListener('DOMContentLoaded', () => {
    window.auth = new AuthManager();
});


window.AuthManager = AuthManager;
