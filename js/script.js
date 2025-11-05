


const DOMElements = {}; 
const eventListeners = new Map(); 
let rafId = null; 


document.addEventListener('DOMContentLoaded', function() {
    performance.mark('app-init-start');
    
    
    cacheDOMElements();
    
    
    requestAnimationFrame(() => {
        
        initAuthentication();
        initNavigation();
        initMobileNav();
        
        
        requestAnimationFrame(() => {
            initInteractiveElements();
            initTaskManagement();
            initGroupInteractions();
            
            
            requestAnimationFrame(() => {
                initConditionalFeatures();
                performance.mark('app-init-end');
                performance.measure('app-init', 'app-init-start', 'app-init-end');
            });
        });
    });
});


function cacheDOMElements() {
    const selectors = {
        uploadBtn: '#uploadBtn',
        createScheduleBtn: '#createScheduleBtn', 
        editProfileBtn: '#editProfileBtn',
        createGroupBtn: '#createGroupBtn',
        navLinks: '.nav-link',
        navToggle: '#navToggle',
        mainNav: '.main-nav'
    };
    
    Object.entries(selectors).forEach(([key, selector]) => {
        if (selector.startsWith('.')) {
            DOMElements[key] = document.querySelectorAll(selector);
        } else {
            DOMElements[key] = document.querySelector(selector);
        }
    });
}


function initConditionalFeatures() {
    if (DOMElements.uploadBtn) {
        console.log('Upload button found, initializing upload modal...');
        initUploadModal();
    }
    
    if (DOMElements.createScheduleBtn) {
        console.log('Schedule button found, initializing schedule modal...');
        initScheduleModal();
    }
    
    if (DOMElements.editProfileBtn) {
        console.log('Edit profile button found, initializing profile modal...');
        initProfileModal();
    }
    
    if (DOMElements.createGroupBtn) {
        initDynamicGroupCreation();
    }
}


function initNavigation() {
    const navLinks = DOMElements.navLinks || document.querySelectorAll('.nav-link');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        
        if (href === currentPage) {
            link.classList.add('active');
        }
        
        
        const clickHandler = function(e) {
            e.preventDefault();
            
            
            if (this.dataset.navigating === 'true') return;
            this.dataset.navigating = 'true';
            
            
            this.classList.add('loading');
            
            
            requestAnimationFrame(() => {
                const spanText = this.querySelector('span')?.textContent || 'page';
                showNotification(`Navigating to ${spanText}...`, 'info');
                
                
                const timeoutId = setTimeout(() => {
                    window.location.href = href;
                }, 300);
                
                eventListeners.set(this, timeoutId);
            });
        };
        
        
        let hoverRAF = null;
        const mouseEnterHandler = function() {
            if (hoverRAF) cancelAnimationFrame(hoverRAF);
            hoverRAF = requestAnimationFrame(() => {
                this.style.transform = 'translateY(-2px)';
            });
        };
        
        const mouseLeaveHandler = function() {
            if (hoverRAF) cancelAnimationFrame(hoverRAF);
            hoverRAF = requestAnimationFrame(() => {
                this.style.transform = 'translateY(0)';
            });
        };
        
        
        link.addEventListener('click', clickHandler);
        link.addEventListener('mouseenter', mouseEnterHandler, { passive: true });
        link.addEventListener('mouseleave', mouseLeaveHandler, { passive: true });
    });
}


function initInteractiveElements() {
    
    const elements = {
        videoCallBtn: '.btn-video-call',
        audioCallBtn: '.btn-audio-call',
        headerIcons: '.header-icons i',
        resourceItems: '.resource-item'
    };
    
    
    document.addEventListener('click', handleElementClicks, { passive: false });
    
    
    requestAnimationFrame(() => {
        animateProgressCircles();
        initRippleEffects();
    });
}


function handleElementClicks(e) {
    const target = e.target.closest('.btn-video-call, .btn-audio-call, .header-icons i, .resource-item');
    if (!target) return;
    
    
    if (target.dataset.processing === 'true') return;
    target.dataset.processing = 'true';
    
    requestAnimationFrame(() => {
        if (target.matches('.btn-video-call')) {
            target.classList.add('clicked');
            initializeVideoCall();
        } else if (target.matches('.btn-audio-call')) {
            target.classList.add('clicked');
            initializeAudioCall();
        } else if (target.matches('.header-icons i')) {
            handleHeaderIconClick(target);
        } else if (target.matches('.resource-item')) {
            handleResourceItemClick(target);
        }
        
        
        setTimeout(() => {
            target.dataset.processing = 'false';
        }, 100);
    });
}


function handleHeaderIconClick(icon) {
    const iconClass = icon.className;
    
    if (iconClass.includes('bell')) {
        showNotification('You have 3 new notifications', 'info');
        icon.classList.add('bounce');
        setTimeout(() => icon.classList.remove('bounce'), 600);
    } else if (iconClass.includes('heart')) {
        showNotification('Added to favorites!', 'success');
        icon.classList.toggle('fa-regular');
        icon.classList.toggle('fa-solid');
        icon.style.color = icon.classList.contains('fa-solid') ? '#ff6b6b' : '';
    } else if (iconClass.includes('bars')) {
        toggleMobileNav();
    }
}


function handleResourceItemClick(item) {
    const fileName = item.querySelector('.file-name')?.textContent || 'file';
    showNotification(`Opening ${fileName}...`, 'info');
    item.classList.add('selected');
    
    setTimeout(() => {
        item.classList.remove('selected');
    }, 1000);
}


function initRippleEffects() {
    const rippleElements = document.querySelectorAll('.btn, .card, .nav-link');
    
    rippleElements.forEach(element => {
        element.addEventListener('mousedown', createRippleEffect, { passive: true });
    });
}


function createRippleEffect(e) {
    if (this.querySelector('.ripple')) return; 
    
    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
    `;
    ripple.classList.add('ripple');
    
    this.style.position = this.style.position || 'relative';
    this.appendChild(ripple);
    
    
    setTimeout(() => ripple.remove(), 600);
}


function initMobileNav() {
    const navToggle = document.getElementById('navToggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (navToggle && mainNav) {
        navToggle.addEventListener('click', toggleMobileNav);
        
        
        document.addEventListener('click', function(e) {
            if (!mainNav.contains(e.target) && mainNav.classList.contains('active')) {
                toggleMobileNav();
            }
        });
    }
}

function toggleMobileNav() {
    const mainNav = document.querySelector('.main-nav');
    const navToggle = document.getElementById('navToggle');
    
    if (mainNav && navToggle) {
        mainNav.classList.toggle('active');
        navToggle.classList.toggle('active');
        
        
        const icon = navToggle.querySelector('i');
        if (mainNav.classList.contains('active')) {
            icon.classList.replace('fa-bars', 'fa-times');
        } else {
            icon.classList.replace('fa-times', 'fa-bars');
        }
    }
}


function initTaskManagement() {
    const taskContainer = document.querySelector('.task-list') || document.querySelector('.tasks-container');
    if (!taskContainer) return;
    
    
    taskContainer.addEventListener('change', handleTaskCheckbox, { passive: true });
    taskContainer.addEventListener('click', handleTaskButtons, { passive: true });
    
    
    initAddTaskFeature();
}


function handleTaskCheckbox(e) {
    if (!e.target.matches('input[type="checkbox"]')) return;
    
    const checkbox = e.target;
    const item = checkbox.closest('.task-item');
    const label = item.querySelector('label');
    const taskText = label?.textContent || 'Task';
    
    
    requestAnimationFrame(() => {
        if (checkbox.checked) {
            item.classList.add('completed');
            showNotification(`Task completed: ${taskText}`, 'success');
        } else {
            item.classList.remove('completed');
            showNotification(`Task reopened: ${taskText}`, 'info');
        }
    });
}


function handleTaskButtons(e) {
    if (!e.target.matches('.close-btn')) return;
    
    const closeBtn = e.target;
    const item = closeBtn.closest('.task-item');
    const label = item.querySelector('label');
    const taskText = label?.textContent || 'Task';
    
    
    requestAnimationFrame(() => {
        item.style.cssText = 'transform: translateX(100%); opacity: 0; transition: all 0.3s ease;';
        
        setTimeout(() => {
            item.remove();
            showNotification(`Task removed: ${taskText}`, 'warning');
        }, 300);
    });
}


function showNotification(message, type = 'info') {
    
    const existingNotifications = document.querySelectorAll('.notification');
    if (existingNotifications.length >= 3) {
        existingNotifications[0].remove();
    }
    
    const fragment = document.createDocumentFragment();
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fa-solid ${getNotificationIcon(type)}"></i>
        <span>${escapeHtml(message)}</span>
        <button class="notification-close">&times;</button>
    `;
    
    
    notification.addEventListener('click', (e) => {
        if (e.target.matches('.notification-close')) {
            hideNotification(notification);
        }
    }, { passive: true });
    
    fragment.appendChild(notification);
    document.body.appendChild(fragment);
    
    
    requestAnimationFrame(() => {
        notification.classList.add('show');
        
        
        setTimeout(() => {
            if (notification.parentNode) {
                hideNotification(notification);
            }
        }, 3000);
    });
}

function hideNotification(notification) {
    notification.classList.add('hide');
    setTimeout(() => notification.remove(), 300);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-triangle',
        warning: 'fa-exclamation-circle',
        info: 'fa-info-circle'
    };
    return icons[type] || icons.info;
}


function escapeHtml(str) {
    return String(str)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}


function animateProgressCircles() {
    const progressCircles = document.querySelectorAll('.progress-circle');
    if (progressCircles.length === 0) return;
    
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const circle = entry.target;
                const progress = getComputedStyle(circle).getPropertyValue('--progress');
                
                requestAnimationFrame(() => {
                    circle.style.setProperty('--progress', '0');
                    
                    requestAnimationFrame(() => {
                        circle.style.setProperty('--progress', progress);
                    });
                });
                
                observer.unobserve(circle);
            }
        });
    }, { threshold: 0.1 });
    
    progressCircles.forEach(circle => observer.observe(circle));
}


function initAuthentication() {
    console.log('🔐 Authentication system loading...');
}


function initAddTaskFeature() {
    
    console.log('📝 Task management system loaded');
}


function initGroupInteractions() {
    console.log('👥 Group interactions initialized');
}


function initUploadModal() {
    console.log('📤 Upload modal initialized');
}

function initScheduleModal() {
    console.log('📅 Schedule modal initialized');
}

function initProfileModal() {
    console.log('👤 Profile modal initialized');
}

function initDynamicGroupCreation() {
    console.log('🎯 Dynamic group creation initialized');
}


function initializeVideoCall() {
    
    createVideoCallModal();
    showNotification('Starting video call...', 'info');
}

function initializeAudioCall() {
    
    createAudioCallModal();
    showNotification('Starting audio call...', 'info');
}


function createVideoCallModal() {
    
    const existing = document.getElementById('videoCallModal');
    if (existing) existing.remove();
    
    const modal = document.createElement('div');
    modal.id = 'videoCallModal';
    modal.className = 'modal-overlay active';
    modal.innerHTML = `
        <div class="video-call-container">
            <div class="video-call-header">
                <h3><i class="fa-solid fa-video"></i> Video Call</h3>
                <button class="close-modal" onclick="closeVideoCall()">
                    <i class="fa-solid fa-times"></i>
                </button>
            </div>
            <div class="video-call-content">
                <div class="video-placeholder">
                    <div class="video-avatar">
                        <i class="fa-solid fa-user"></i>
                    </div>
                    <p>Video call simulation</p>
                    <div class="call-status">
                        <span class="status-indicator connecting"></span>
                        <span>Connecting...</span>
                    </div>
                </div>
                <div class="call-controls">
                    <button class="call-btn mute-btn" onclick="toggleMute(this)">
                        <i class="fa-solid fa-microphone"></i>
                    </button>
                    <button class="call-btn video-btn" onclick="toggleVideo(this)">
                        <i class="fa-solid fa-video"></i>
                    </button>
                    <button class="call-btn end-call-btn" onclick="endCall()">
                        <i class="fa-solid fa-phone-slash"></i>
                    </button>
                    <button class="call-btn screen-share-btn" onclick="shareScreen()">
                        <i class="fa-solid fa-desktop"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    
    setTimeout(() => {
        const status = modal.querySelector('.call-status span:last-child');
        const indicator = modal.querySelector('.status-indicator');
        if (status && indicator) {
            status.textContent = 'Connected';
            indicator.className = 'status-indicator connected';
        }
    }, 2000);
}


function createAudioCallModal() {
    const existing = document.getElementById('audioCallModal');
    if (existing) existing.remove();
    
    const modal = document.createElement('div');
    modal.id = 'audioCallModal';
    modal.className = 'modal-overlay active';
    modal.innerHTML = `
        <div class="audio-call-container">
            <div class="audio-call-header">
                <h3><i class="fa-solid fa-phone"></i> Audio Call</h3>
                <button class="close-modal" onclick="closeAudioCall()">
                    <i class="fa-solid fa-times"></i>
                </button>
            </div>
            <div class="audio-call-content">
                <div class="audio-avatar-large">
                    <i class="fa-solid fa-user"></i>
                </div>
                <h4>Study Group Call</h4>
                <div class="call-status">
                    <span class="status-indicator connecting"></span>
                    <span>Connecting...</span>
                </div>
                <div class="call-duration">00:00</div>
                <div class="call-controls">
                    <button class="call-btn mute-btn" onclick="toggleMute(this)">
                        <i class="fa-solid fa-microphone"></i>
                    </button>
                    <button class="call-btn end-call-btn" onclick="endAudioCall()">
                        <i class="fa-solid fa-phone-slash"></i>
                    </button>
                    <button class="call-btn speaker-btn" onclick="toggleSpeaker(this)">
                        <i class="fa-solid fa-volume-up"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    
    setTimeout(() => {
        const status = modal.querySelector('.call-status span:last-child');
        const indicator = modal.querySelector('.status-indicator');
        if (status && indicator) {
            status.textContent = 'Connected';
            indicator.className = 'status-indicator connected';
            startCallTimer(modal);
        }
    }, 2000);
}


function toggleMute(btn) {
    const icon = btn.querySelector('i');
    const isMuted = icon.classList.contains('fa-microphone-slash');
    
    if (isMuted) {
        icon.className = 'fa-solid fa-microphone';
        btn.classList.remove('muted');
        showNotification('Microphone unmuted', 'success');
    } else {
        icon.className = 'fa-solid fa-microphone-slash';
        btn.classList.add('muted');
        showNotification('Microphone muted', 'info');
    }
}

function toggleVideo(btn) {
    const icon = btn.querySelector('i');
    const isOff = icon.classList.contains('fa-video-slash');
    
    if (isOff) {
        icon.className = 'fa-solid fa-video';
        btn.classList.remove('video-off');
        showNotification('Camera enabled', 'success');
    } else {
        icon.className = 'fa-solid fa-video-slash';
        btn.classList.add('video-off');
        showNotification('Camera disabled', 'info');
    }
}

function toggleSpeaker(btn) {
    const icon = btn.querySelector('i');
    const isMuted = icon.classList.contains('fa-volume-mute');
    
    if (isMuted) {
        icon.className = 'fa-solid fa-volume-up';
        btn.classList.remove('speaker-off');
        showNotification('Speaker enabled', 'success');
    } else {
        icon.className = 'fa-solid fa-volume-mute';
        btn.classList.add('speaker-off');
        showNotification('Speaker disabled', 'info');
    }
}

function shareScreen() {
    showNotification('Screen sharing started', 'success');
    const btn = event.target.closest('.screen-share-btn');
    btn.classList.toggle('active');
}

function endCall() {
    closeVideoCall();
    showNotification('Video call ended', 'info');
}

function endAudioCall() {
    closeAudioCall();
    showNotification('Audio call ended', 'info');
}

function closeVideoCall() {
    const modal = document.getElementById('videoCallModal');
    if (modal) modal.remove();
}

function closeAudioCall() {
    const modal = document.getElementById('audioCallModal');
    if (modal) modal.remove();
}

function startCallTimer(modal) {
    let seconds = 0;
    const timerElement = modal.querySelector('.call-duration');
    
    const timer = setInterval(() => {
        seconds++;
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
        
        if (!document.body.contains(modal)) {
            clearInterval(timer);
        }
    }, 1000);
}


function initScheduleModal() {
    const openBtn = document.getElementById('openScheduleModalBtn');
    const modal = document.getElementById('scheduleModal');
    const closeBtn = document.getElementById('closeScheduleModal');
    const cancelBtn = document.getElementById('cancelScheduleBtn');
    const form = document.getElementById('scheduleForm');
    
    if (openBtn && modal) {
        openBtn.addEventListener('click', () => openScheduleModal());
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => closeScheduleModal());
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => closeScheduleModal());
    }
    
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeScheduleModal();
        });
    }
    
    if (form) {
        form.addEventListener('submit', handleScheduleSubmit);
    }
    
    
    initTimeSlotManagement();
}

function openScheduleModal() {
    const modal = document.getElementById('scheduleModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        
        const dateInput = document.getElementById('scheduleDate');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.value = today;
        }
        
        showNotification('Schedule creator opened', 'info');
    }
}

function closeScheduleModal() {
    const modal = document.getElementById('scheduleModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
        
        
        const form = document.getElementById('scheduleForm');
        if (form) form.reset();
    }
}

function handleScheduleSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const scheduleName = formData.get('scheduleName');
    const scheduleDate = formData.get('scheduleDate');
    
    if (!scheduleName || !scheduleDate) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    
    const timeSlots = [];
    const slots = document.querySelectorAll('.time-slot');
    
    slots.forEach(slot => {
        const startTime = slot.querySelector('input[name="startTime"]').value;
        const endTime = slot.querySelector('input[name="endTime"]').value;
        const subject = slot.querySelector('input[name="subject"]').value;
        const priority = slot.querySelector('select[name="priority"]').value;
        
        if (startTime && endTime && subject) {
            timeSlots.push({ startTime, endTime, subject, priority });
        }
    });
    
    if (timeSlots.length === 0) {
        showNotification('Please add at least one time slot', 'error');
        return;
    }
    
    
    const scheduleData = {
        name: scheduleName,
        date: scheduleDate,
        timeSlots: timeSlots,
        reminder: formData.get('reminder'),
        repeatType: formData.get('repeatType')
    };
    
    console.log('Schedule created:', scheduleData);
    showNotification(`Schedule "${scheduleName}" created successfully!`, 'success');
    closeScheduleModal();
    
    
    updateSchedulePreview(timeSlots);
}

function updateSchedulePreview(timeSlots) {
    const previewContainer = document.querySelector('.schedule-preview');
    if (!previewContainer || timeSlots.length === 0) return;
    
    previewContainer.innerHTML = timeSlots.slice(0, 3).map(slot => `
        <div class="schedule-item">
            <span class="schedule-time">${slot.startTime}</span>
            <span class="schedule-subject">${slot.subject}</span>
        </div>
    `).join('');
    
    if (timeSlots.length > 3) {
        previewContainer.innerHTML += `
            <div class="schedule-item">
                <span class="schedule-time">...</span>
                <span class="schedule-subject">+${timeSlots.length - 3} more</span>
            </div>
        `;
    }
}


function initTimeSlotManagement() {
    
    const addBtn = document.querySelector('.add-slot-btn');
    if (addBtn) {
        addBtn.addEventListener('click', addTimeSlot);
    }
}

function addTimeSlot() {
    const container = document.getElementById('timeSlots');
    if (!container) return;
    
    const slotCount = container.children.length;
    const newSlot = document.createElement('div');
    newSlot.className = 'time-slot';
    newSlot.innerHTML = `
        <div class="form-row">
            <div class="form-group">
                <label>Start Time</label>
                <input type="time" name="startTime" value="09:00" required>
            </div>
            <div class="form-group">
                <label>End Time</label>
                <input type="time" name="endTime" value="10:00" required>
            </div>
            <div class="form-group">
                <label>Subject</label>
                <input type="text" name="subject" placeholder="Subject name" required>
            </div>
            <div class="form-group">
                <label>Priority</label>
                <select name="priority">
                    <option value="high">High</option>
                    <option value="medium" selected>Medium</option>
                    <option value="low">Low</option>
                </select>
            </div>
            <button type="button" class="remove-slot-btn" onclick="removeTimeSlot(this)">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    `;
    
    container.appendChild(newSlot);
    showNotification('Time slot added', 'success');
    
    
    newSlot.style.opacity = '0';
    newSlot.style.transform = 'translateY(-20px)';
    requestAnimationFrame(() => {
        newSlot.style.transition = 'all 0.3s ease';
        newSlot.style.opacity = '1';
        newSlot.style.transform = 'translateY(0)';
    });
}

function removeTimeSlot(btn) {
    const slot = btn.closest('.time-slot');
    const container = document.getElementById('timeSlots');
    
    if (container.children.length <= 1) {
        showNotification('At least one time slot is required', 'warning');
        return;
    }
    
    
    slot.style.transition = 'all 0.3s ease';
    slot.style.opacity = '0';
    slot.style.transform = 'translateX(-100%)';
    
    setTimeout(() => {
        slot.remove();
        showNotification('Time slot removed', 'info');
    }, 300);
}




function initMobileNav() {
    const toggle = document.getElementById('navToggle');
    const overlay = document.getElementById('mobileNavOverlay');
    const close = document.getElementById('mobileNavClose');
    
    if (!toggle || !overlay) return;
    
    toggle.addEventListener('click', () => openMobileNav());
    if (close) close.addEventListener('click', () => closeMobileNav());
    
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeMobileNav();
    });
    
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('active')) {
            closeMobileNav();
        }
    });
}

function openMobileNav() {
    const overlay = document.getElementById('mobileNavOverlay');
    if (overlay) {
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeMobileNav() {
    const overlay = document.getElementById('mobileNavOverlay');
    if (overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}




let notificationCount = 0;

function initNotifications() {
    
    if (!document.getElementById('notificationContainer')) {
        const container = document.createElement('div');
        container.id = 'notificationContainer';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            pointer-events: none;
        `;
        document.body.appendChild(container);
    }
}

function showNotification(message, type = 'info') {
    const container = document.getElementById('notificationContainer');
    if (!container || notificationCount >= 3) return;
    
    notificationCount++;
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        background: ${getNotificationColor(type)};
        color: white;
        padding: 12px 20px;
        margin-bottom: 10px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        transform: translateX(400px);
        transition: transform 0.3s ease;
        pointer-events: auto;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    notification.innerHTML = `
        <i class="fa-solid ${getNotificationIcon(type)}"></i>
        <span>${escapeHtml(message)}</span>
    `;
    
    container.appendChild(notification);
    
    
    requestAnimationFrame(() => {
        notification.style.transform = 'translateX(0)';
    });
    
    
    setTimeout(() => hideNotification(notification), 3000);
    
    
    notification.addEventListener('click', () => hideNotification(notification));
}

function hideNotification(notification) {
    if (!notification.parentNode) return;
    
    notification.style.transform = 'translateX(400px)';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
            notificationCount = Math.max(0, notificationCount - 1);
        }
    }, 300);
}

function getNotificationColor(type) {
    const colors = {
        success: 'linear-gradient(135deg, #27ae60, #2ecc71)',
        error: 'linear-gradient(135deg, #e74c3c, #c0392b)',
        warning: 'linear-gradient(135deg, #f39c12, #e67e22)',
        info: 'linear-gradient(135deg, #667eea, #764ba2)'
    };
    return colors[type] || colors.info;
}

function getNotificationIcon(type) {
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-triangle',
        warning: 'fa-exclamation-circle',
        info: 'fa-info-circle'
    };
    return icons[type] || icons.info;
}




function initTaskManager() {
    const modal = document.getElementById('taskModal');
    const openBtn = document.getElementById('addTaskBtn');
    const closeBtn = document.getElementById('closeTaskModal');
    const form = document.getElementById('taskForm');
    
    if (!modal || !openBtn || !form) return;
    
    
    openBtn.addEventListener('click', () => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        
        setTimeout(() => {
            const firstInput = document.getElementById('taskTitle');
            if (firstInput) firstInput.focus();
        }, 100);
    });
    
    
    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        form.reset();
        resetCharCounters();
    };
    
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const title = document.getElementById('taskTitle')?.value.trim();
        if (!title) {
            showNotification('Please enter a task title', 'error');
            return;
        }
        
        addTaskToList(title);
        closeModal();
        showNotification('Task added successfully!', 'success');
    });
    
    
    initCharCounters();
    
    
    initTaskListInteractions();
}

function initCharCounters() {
    const titleInput = document.getElementById('taskTitle');
    const descInput = document.getElementById('taskDescription');
    const titleCounter = document.getElementById('titleCounter');
    const descCounter = document.getElementById('descCounter');
    
    if (titleInput && titleCounter) {
        titleInput.addEventListener('input', () => {
            updateCharCounter(titleInput, titleCounter, 100);
        });
    }
    
    if (descInput && descCounter) {
        descInput.addEventListener('input', () => {
            updateCharCounter(descInput, descCounter, 300);
        });
    }
}

function updateCharCounter(input, counter, maxLength) {
    const length = input.value.length;
    counter.textContent = `${length}/${maxLength}`;
    
    counter.classList.remove('warning', 'danger');
    if (length >= maxLength * 0.8) counter.classList.add('warning');
    if (length >= maxLength * 0.95) counter.classList.add('danger');
}

function resetCharCounters() {
    const titleCounter = document.getElementById('titleCounter');
    const descCounter = document.getElementById('descCounter');
    
    if (titleCounter) {
        titleCounter.textContent = '0/100';
        titleCounter.classList.remove('warning', 'danger');
    }
    if (descCounter) {
        descCounter.textContent = '0/300';
        descCounter.classList.remove('warning', 'danger');
    }
}

function addTaskToList(title) {
    const taskList = document.querySelector('.task-list');
    if (!taskList) return;
    
    const taskId = 'task_' + Date.now();
    const taskItem = document.createElement('li');
    taskItem.className = 'task-item';
    taskItem.style.cssText = 'opacity: 0; transform: translateY(-10px); transition: all 0.3s ease;';
    
    taskItem.innerHTML = `
        <input type="checkbox" id="${taskId}">
        <label for="${taskId}">${escapeHtml(title)}</label>
        <button class="close-btn" type="button">&times;</button>
    `;
    
    
    if (taskList.firstChild) {
        taskList.insertBefore(taskItem, taskList.firstChild);
    } else {
        taskList.appendChild(taskItem);
    }
    
    
    requestAnimationFrame(() => {
        taskItem.style.cssText = 'opacity: 1; transform: translateY(0); transition: all 0.3s ease;';
    });
}

function initTaskListInteractions() {
    const taskList = document.querySelector('.task-list');
    if (!taskList) return;
    
    
    taskList.addEventListener('click', (e) => {
        if (e.target.classList.contains('close-btn')) {
            const taskItem = e.target.closest('.task-item');
            if (taskItem) {
                taskItem.style.cssText = 'opacity: 0; transform: translateX(100%); transition: all 0.3s ease;';
                setTimeout(() => taskItem.remove(), 300);
                showNotification('Task removed', 'info');
            }
        }
    });
    
    taskList.addEventListener('change', (e) => {
        if (e.target.type === 'checkbox') {
            const taskItem = e.target.closest('.task-item');
            const label = taskItem.querySelector('label');
            
            if (e.target.checked) {
                taskItem.style.opacity = '0.6';
                label.style.textDecoration = 'line-through';
                showNotification('Task completed!', 'success');
            } else {
                taskItem.style.opacity = '1';
                label.style.textDecoration = 'none';
            }
        }
    });
}




function initScheduleManager() {
    const modal = document.getElementById('scheduleModal');
    const openBtn = document.getElementById('createScheduleBtn');
    const closeBtn = document.getElementById('closeScheduleModal');
    const form = document.getElementById('scheduleForm');
    
    if (!modal || !openBtn) return;
    
    openBtn.addEventListener('click', () => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        if (form) form.reset();
    };
    
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            closeModal();
            showNotification('Schedule saved successfully!', 'success');
        });
    }
}




function initGroupInteractions() {
    
    if (!localStorage.getItem('studybuddy_members')) {
        localStorage.setItem('studybuddy_members', '{}');
    }
    
    
    document.addEventListener('click', (e) => {
        const groupCard = e.target.closest('.group-card');
        const joinBtn = e.target.closest('.btn-join');
        
        if (joinBtn && groupCard) {
            e.stopPropagation();
            toggleGroupMembership(groupCard);
        } else if (groupCard && !e.target.closest('button')) {
            openGroupModal(groupCard);
        }
    });
}

function toggleGroupMembership(groupCard) {
    const groupId = groupCard.dataset.groupId || 'group_' + Date.now();
    const joinBtn = groupCard.querySelector('.btn-join');
    const memberships = JSON.parse(localStorage.getItem('studybuddy_members') || '{}');
    
    if (memberships[groupId]) {
        delete memberships[groupId];
        joinBtn.classList.remove('active');
        joinBtn.textContent = 'Join';
        showNotification('You left the group', 'info');
    } else {
        memberships[groupId] = true;
        joinBtn.classList.add('active');
        joinBtn.textContent = 'Member';
        showNotification('You joined the group!', 'success');
    }
    
    localStorage.setItem('studybuddy_members', JSON.stringify(memberships));
}

function openGroupModal(groupCard) {
    const groupName = groupCard.querySelector('.group-info h3')?.textContent || 'Group';
    const description = groupCard.querySelector('.group-description')?.textContent || 'No description';
    
    
    const existingModal = document.getElementById('groupModal');
    if (existingModal) existingModal.remove();
    
    const modal = document.createElement('div');
    modal.id = 'groupModal';
    modal.className = 'modal-overlay active';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${escapeHtml(groupName)}</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <p>${escapeHtml(description)}</p>
                <div class="group-modal-actions">
                    <button class="btn btn-primary">View Details</button>
                    <button class="btn btn-secondary">Share Group</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.remove();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}




function initAuth() {
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            showAuthModal('login');
        });
    }
    
    if (signupBtn) {
        signupBtn.addEventListener('click', () => {
            showAuthModal('signup');
        });
    }
}

function showAuthModal(type) {
    
    const existingModal = document.getElementById('authModal');
    if (existingModal) existingModal.remove();
    
    const isLogin = type === 'login';
    const modal = document.createElement('div');
    modal.id = 'authModal';
    modal.className = 'modal-overlay active';
    
    modal.innerHTML = `
        <div class="modal-content auth-modal">
            <div class="modal-header">
                <h3>${isLogin ? 'Welcome Back' : 'Join StudyBuddy'}</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <form id="authForm">
                    ${!isLogin ? '<div class="form-group"><input type="text" placeholder="Full Name" required></div>' : ''}
                    <div class="form-group">
                        <input type="email" placeholder="Email Address" required>
                    </div>
                    <div class="form-group">
                        <input type="password" placeholder="Password" required>
                    </div>
                    <button type="submit" class="btn btn-primary">${isLogin ? 'Sign In' : 'Create Account'}</button>
                </form>
                <div class="auth-switch">
                    <p>${isLogin ? "Don't have an account?" : 'Already have an account?'} 
                    <a href="#" id="switchAuth">${isLogin ? 'Sign up' : 'Sign in'}</a></p>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    
    modal.querySelector('.close-modal').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
    
    
    modal.querySelector('#switchAuth').addEventListener('click', (e) => {
        e.preventDefault();
        modal.remove();
        showAuthModal(isLogin ? 'signup' : 'login');
    });
    
    
    modal.querySelector('#authForm').addEventListener('submit', (e) => {
        e.preventDefault();
        modal.remove();
        showNotification(`${isLogin ? 'Signed in' : 'Account created'} successfully!`, 'success');
    });
}




function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}


window.addEventListener('beforeunload', () => {
    
    APP.timers.forEach(timer => clearTimeout(timer));
    
    
    APP.observers.forEach(observer => observer.disconnect());
    
    
    APP.cache.clear();
});


const notificationCSS = `
    @keyframes notificationSlide {
        from { transform: translateX(400px); }
        to { transform: translateX(0); }
    }
    
    .notification {
        animation: notificationSlide 0.3s ease;
    }
    
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(5px);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .modal-content {
        background: linear-gradient(135deg, #0f0f23, #1a1a3e);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 15px;
        max-width: 500px;
        width: 90%;
        overflow: hidden;
    }
    
    .modal-header {
        background: linear-gradient(135deg, #667eea, #764ba2);
        padding: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: white;
    }
    
    .modal-body {
        padding: 20px;
        color: white;
    }
    
    .form-group {
        margin-bottom: 15px;
    }
    
    .form-group input {
        width: 100%;
        padding: 12px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.1);
        color: white;
    }
    
    .close-modal {
        background: none;
        border: none;
        color: white;
        font-size: 24px;
        cursor: pointer;
    }
`;


const style = document.createElement('style');
style.textContent = notificationCSS;
document.head.appendChild(style);
